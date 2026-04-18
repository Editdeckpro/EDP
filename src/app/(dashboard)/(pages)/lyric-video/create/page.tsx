"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import UploadAudioStep from "@/components/pages/lyric-video/steps/upload-audio-step";
import TranscribeStep from "@/components/pages/lyric-video/steps/transcribe-step";
import AddLyricsStep from "@/components/pages/lyric-video/steps/add-lyrics-step";
import TrimAudioStep from "@/components/pages/lyric-video/steps/trim-audio-step";
import PreviewStep from "@/components/pages/lyric-video/steps/preview-step";
import ExportStep from "@/components/pages/lyric-video/steps/export-step";
import type { AssemblyWord, AssemblyLine } from "@/components/pages/lyric-video/api";
type Step = 1 | 2 | 3 | 4 | 5 | 6;

export interface LyricVideoData {
  audioId?: string;
  audioUrl?: string;
  audioDuration?: number;
  lyrics?: string;
  /** Word-level timestamps from AssemblyAI transcription (seconds, relative to original audio) */
  assemblyWords?: AssemblyWord[];
  /** Line-level timestamps from AssemblyAI transcription (seconds, relative to original audio) */
  assemblyLines?: AssemblyLine[];
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

// ---------------------------------------------------------------------------
// Wizard state persistence
// sessionStorage survives refresh but dies on tab close — matches the
// "active session only" requirement. Keyed by user id so prior-user state
// cannot leak to whoever signs in next in the same tab.
// ---------------------------------------------------------------------------
const WIZARD_KEY_PREFIX = "lyric-wizard:";
const MAX_PAYLOAD_BYTES = 2_000_000;

interface PersistedWizardState {
  step: Step;
  data: LyricVideoData;
}

function buildStorageKey(userId: number | undefined): string | null {
  return typeof userId === "number" ? `${WIZARD_KEY_PREFIX}${userId}` : null;
}

function persistWizardState(key: string, step: Step, data: LyricVideoData): void {
  if (typeof window === "undefined") return;
  try {
    let payload: PersistedWizardState = { step, data };
    let json = JSON.stringify(payload);
    if (json.length > MAX_PAYLOAD_BYTES) {
      // Heavy word-timing arrays push the payload past the sessionStorage
      // budget — drop them; subcomponents can re-fetch from the DB if needed.
      const trimmedData: LyricVideoData = { ...data };
      delete trimmedData.assemblyWords;
      delete trimmedData.assemblyLines;
      payload = { step, data: trimmedData };
      json = JSON.stringify(payload);
    }
    window.sessionStorage.setItem(key, json);
  } catch {
    // Quota exceeded, private browsing, etc. — best-effort persistence.
  }
}

function readWizardState(key: string): PersistedWizardState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedWizardState;
    const step = parsed?.step;
    if (typeof step !== "number" || step < 1 || step > 6) return null;
    return { step: step as Step, data: parsed.data || {} };
  } catch {
    return null;
  }
}

export default function CreateLyricVideoPage() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();
  const userId = session?.user.id;

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [videoData, setVideoData] = useState<LyricVideoData>({});
  const [restored, setRestored] = useState(false);

  const updateVideoData = (data: Partial<LyricVideoData>) => {
    setVideoData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < 6) setCurrentStep((prev) => (prev + 1) as Step);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step);
  };

  // Restore persisted state once the session has resolved. Step components
  // are not rendered until `restored` is true, so auto-triggering effects
  // inside them cannot fire against a to-be-overwritten empty state.
  useEffect(() => {
    if (restored) return;
    if (sessionStatus === "loading") return;

    if (sessionStatus === "authenticated") {
      const key = buildStorageKey(userId);
      if (key) {
        const saved = readWizardState(key);
        if (saved) {
          setCurrentStep(saved.step);
          setVideoData(saved.data);
        }
      }
    }
    setRestored(true);
  }, [sessionStatus, userId, restored]);

  // Persist on every state change once restore has completed.
  useEffect(() => {
    if (!restored) return;
    const key = buildStorageKey(userId);
    if (!key) return;
    persistWizardState(key, currentStep, videoData);
  }, [currentStep, videoData, userId, restored]);

  const clearPersistedState = useCallback(() => {
    const key = buildStorageKey(userId);
    if (key && typeof window !== "undefined") {
      window.sessionStorage.removeItem(key);
    }
  }, [userId]);

  const handleStartOver = useCallback(() => {
    if (typeof window !== "undefined" && !window.confirm("Start over? This clears your current progress.")) {
      return;
    }
    clearPersistedState();
    setCurrentStep(1);
    setVideoData({});
  }, [clearPersistedState]);

  const handleExportComplete = useCallback(() => {
    clearPersistedState();
    router.push("/lyric-videos");
  }, [clearPersistedState, router]);

  const showStartOver = currentStep > 1 || !!videoData.audioId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Create Lyric Video</h1>
          <p className="text-sm text-muted-foreground mt-1">Step {currentStep} of 6</p>
        </div>
        {showStartOver && (
          <Button variant="ghost" size="sm" onClick={handleStartOver}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Start Over
          </Button>
        )}
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
        {!restored ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
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
              <ExportStep onPrev={prevStep} onComplete={handleExportComplete} videoData={videoData} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
