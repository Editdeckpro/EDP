"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
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

export default function CreateLyricVideoPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [videoData, setVideoData] = useState<LyricVideoData>({});

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
