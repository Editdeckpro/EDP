"use client";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import UploadAudioStep from "@/components/pages/lyric-video/steps/upload-audio-step";
import TranscribeStep from "@/components/pages/lyric-video/steps/transcribe-step";
import AddLyricsStep from "@/components/pages/lyric-video/steps/add-lyrics-step";
import TrimAudioStep from "@/components/pages/lyric-video/steps/trim-audio-step";
import PreviewStep from "@/components/pages/lyric-video/steps/preview-step";
import ExportStep from "@/components/pages/lyric-video/steps/export-step";
import { SubscriptionRequiredModal } from "@/components/pages/auth/subscription-required-modal";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

export interface LyricVideoData {
  audioId?: string;
  audioUrl?: string;
  audioDuration?: number;
  lyrics?: string;
  lyricVideoId?: number;
  trimStart?: number;
  trimEnd?: number;
  previewUrl?: string;
}

const STEPS = [
  { num: 1, label: "Upload" },
  { num: 2, label: "Transcribe" },
  { num: 3, label: "Lyrics" },
  { num: 4, label: "Trim" },
  { num: 5, label: "Preview" },
  { num: 6, label: "Export" },
];

export default function CreateLyricVideoPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [videoData, setVideoData] = useState<LyricVideoData>({});

  const planType = session?.user?.subscription?.planType || "FREE";
  const bypassSubscription = Boolean(session?.user?.bypassSubscription);

  if (!bypassSubscription && (planType === "STARTER" || planType === "FREE")) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-3xl">🎬</div>
          <h1 className="text-2xl font-bold">Lyric Videos</h1>
          <p className="text-muted-foreground max-w-sm">
            Lyric videos are available on Next Level and Pro Studio plans.
          </p>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Upgrade Plan
          </button>
        </div>
        <SubscriptionRequiredModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          details={{
            title: "Upgrade Required",
            message: "Lyric videos are not available on your current plan. Please upgrade to Next Level or Pro Studio.",
            actionLink: "/subscription",
            actionText: "View Plans",
          }}
        />
      </>
    );
  }

  const updateVideoData = (data: Partial<LyricVideoData>) => {
    setVideoData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Create Lyric Video</h1>
        <p className="text-sm text-muted-foreground mt-1">Step {currentStep} of 6</p>
      </div>

      {/* Stepper */}
      <div className="mb-10">
        <div className="flex items-start">
          {STEPS.map((step, i) => (
            <div key={step.num} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center w-full">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all shrink-0 ${
                    step.num < currentStep
                      ? "bg-primary border-primary text-primary-foreground"
                      : step.num === currentStep
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {step.num < currentStep ? <Check className="w-3.5 h-3.5" /> : step.num}
                </div>
                <span
                  className={`text-xs mt-1.5 text-center hidden sm:block truncate max-w-full px-0.5 ${
                    step.num === currentStep ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mt-4 mx-0.5 transition-colors ${
                    step.num < currentStep ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="bg-card border rounded-xl p-6 shadow-sm">
        {currentStep === 1 && (
          <UploadAudioStep onNext={nextStep} onDataUpdate={updateVideoData} videoData={videoData} />
        )}
        {currentStep === 2 && (
          <TranscribeStep onNext={nextStep} onPrev={prevStep} onDataUpdate={updateVideoData} videoData={videoData} />
        )}
        {currentStep === 3 && (
          <AddLyricsStep onNext={nextStep} onPrev={prevStep} onDataUpdate={updateVideoData} videoData={videoData} />
        )}
        {currentStep === 4 && (
          <TrimAudioStep onNext={nextStep} onPrev={prevStep} onDataUpdate={updateVideoData} videoData={videoData} />
        )}
        {currentStep === 5 && (
          <PreviewStep onNext={nextStep} onPrev={prevStep} onDataUpdate={updateVideoData} videoData={videoData} />
        )}
        {currentStep === 6 && (
          <ExportStep onPrev={prevStep} onComplete={() => router.push("/lyric-videos")} videoData={videoData} />
        )}
      </div>
    </div>
  );
}
