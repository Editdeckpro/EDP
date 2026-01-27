"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import UploadAudioStep from "@/components/pages/lyric-video/steps/upload-audio-step";
import AddLyricsStep from "@/components/pages/lyric-video/steps/add-lyrics-step";
import TimingEditorStep from "@/components/pages/lyric-video/steps/timing-editor-step";
import StyleSelectionStep from "@/components/pages/lyric-video/steps/style-selection-step";
import CustomizationStep from "@/components/pages/lyric-video/steps/customization-step";
import PreviewStep from "@/components/pages/lyric-video/steps/preview-step";
import ExportStep from "@/components/pages/lyric-video/steps/export-step";
import { SubscriptionRequiredModal } from "@/components/pages/auth/subscription-required-modal";

type Step = 1 | 2 | 3 | 4 | 5 | 6 | 7;

interface LyricVideoData {
  audioId?: string;
  audioUrl?: string;
  audioDuration?: number;
  lyrics?: string;
  lyricVideoId?: number;
  timingData?: unknown;
  style?: string;
  font?: string;
  textColor?: string;
  highlightColor?: string;
  backgroundColor?: string;
  backgroundImage?: string;
}

export default function CreateLyricVideoPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [videoData, setVideoData] = useState<LyricVideoData>({});

  const planType = session?.user?.subscription?.planType || "FREE";
  const bypassSubscription = Boolean(session?.user?.bypassSubscription);

  // Check plan access
  if (!bypassSubscription && (planType === "STARTER" || planType === "FREE")) {
    return (
      <>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <h1 className="text-2xl font-bold">Lyric Videos Not Available</h1>
          <p className="text-muted-foreground">
            Lyric videos are available on Next Level and Pro Studio plans.
          </p>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Upgrade Plan
          </button>
        </div>
        <SubscriptionRequiredModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          details={{
            title: "Upgrade Required",
            message: "Lyric videos are not available on your current plan. Please upgrade to Next Level or Pro Studio plan.",
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
    if (currentStep < 7) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
    }
  };

  const goToStep = (step: Step) => {
    setCurrentStep(step);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Lyric Video</h1>
        <p className="text-muted-foreground">
          Step {currentStep} of 7: {getStepTitle(currentStep)}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div
              key={step}
              className={`flex-1 h-2 mx-1 rounded ${
                step <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Upload</span>
          <span>Lyrics</span>
          <span>Timing</span>
          <span>Style</span>
          <span>Customize</span>
          <span>Preview</span>
          <span>Export</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-card rounded-lg p-6">
        {currentStep === 1 && (
          <UploadAudioStep
            onNext={nextStep}
            onDataUpdate={updateVideoData}
            videoData={videoData}
          />
        )}
        {currentStep === 2 && (
          <AddLyricsStep
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={updateVideoData}
            videoData={videoData}
          />
        )}
        {currentStep === 3 && (
          <TimingEditorStep
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={updateVideoData}
            videoData={videoData}
          />
        )}
        {currentStep === 4 && (
          <StyleSelectionStep
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={updateVideoData}
            videoData={videoData}
          />
        )}
        {currentStep === 5 && (
          <CustomizationStep
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={updateVideoData}
            videoData={videoData}
          />
        )}
        {currentStep === 6 && (
          <PreviewStep
            onNext={nextStep}
            onPrev={prevStep}
            onDataUpdate={updateVideoData}
            videoData={videoData}
            onEditTiming={() => goToStep(3)}
          />
        )}
        {currentStep === 7 && (
          <ExportStep
            onPrev={prevStep}
            onComplete={() => router.push("/lyric-videos")}
            videoData={videoData}
          />
        )}
      </div>
    </div>
  );
}

function getStepTitle(step: Step): string {
  const titles: Record<Step, string> = {
    1: "Upload Audio",
    2: "Add Lyrics",
    3: "Edit Timing",
    4: "Choose Style",
    5: "Customize",
    6: "Preview",
    7: "Export",
  };
  return titles[step];
}
