"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { OnboardingData } from "@/schemas/onboarding-schema";
import { saveOnboardingData } from "./request";
import { toast } from "sonner";
import WelcomeStep from "./steps/welcome-step";
import UserTypeStep from "./steps/user-type-step";
import ContentTypeStep from "./steps/content-type-step";
import ReleaseFrequencyStep from "./steps/release-frequency-step";
import PriorityStep from "./steps/priority-step";
import CompletionStep from "./steps/completion-step";
import ThreeBackground from "./three-background";
import { setOnboardingCompleteInStorage } from "@/lib/onboarding-storage";

const TOTAL_STEPS = 6;

export default function OnboardingFlow() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = async (stepData?: Partial<OnboardingData>) => {
    // Update the onboarding data with new step data
    const updatedData = stepData ? { ...onboardingData, ...stepData } : onboardingData;
    
    if (stepData) {
      setOnboardingData(updatedData);
    }

    // If moving to completion step (step 6), save onboarding data first
    if (currentStep === TOTAL_STEPS - 1) {
      try {
        await handleSaveOnboarding(updatedData as OnboardingData);
        setCurrentStep((prev) => prev + 1);
      } catch {
        // Error is already handled in handleSaveOnboarding
        // Don't advance to next step if save fails
      }
    } else if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSaveOnboarding = async (data: OnboardingData) => {
    if (!session?.user) {
      toast.error("Session expired. Please log in again.");
      router.push("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      await saveOnboardingData(data);
      setOnboardingCompleteInStorage(true);
      toast.success("Onboarding completed!");
      setIsSubmitting(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to save onboarding data";
      toast.error(errorMessage);
      setIsSubmitting(false);
      throw error; // Re-throw to prevent moving to next step if save fails
    }
  };

  const handleGenerateFirstImage = () => {
    router.push("/image-generation/generate");
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={() => handleNext()} />;
      case 2:
        return (
          <UserTypeStep
            selectedValue={onboardingData.userType}
            onNext={(value) => handleNext({ userType: value })}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <ContentTypeStep
            selectedValue={onboardingData.contentType}
            onNext={(value) => handleNext({ contentType: value })}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ReleaseFrequencyStep
            selectedValue={onboardingData.releaseFrequency}
            onNext={(value) => handleNext({ releaseFrequency: value })}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <PriorityStep
            selectedValue={onboardingData.priority}
            onNext={(value) => handleNext({ priority: value })}
            onBack={handleBack}
          />
        );
      case 6:
        return <CompletionStep isSubmitting={isSubmitting} onGenerateClick={handleGenerateFirstImage} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/50 via-cyan-50/45 via-purple-50/40 via-pink-50/35 to-indigo-50/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Three.js animated background */}
      <ThreeBackground />
      {/* Left blurs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-300/40 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-300/35 rounded-full blur-3xl -z-10" />
      {/* Right blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/50 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/45 rounded-full blur-3xl -z-10" />
      <div className="w-full max-w-2xl relative z-10">{renderStep()}</div>
    </div>
  );
}
