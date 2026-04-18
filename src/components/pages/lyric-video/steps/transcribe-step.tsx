"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2, AlertCircle, Sparkles, Clock } from "lucide-react";
import { transcribeAudioClient, type AssemblyWord, type AssemblyLine } from "@/components/pages/lyric-video/api";

interface TranscribeStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: Partial<{ lyrics: string; assemblyWords: AssemblyWord[]; assemblyLines: AssemblyLine[] }>) => void;
  videoData: { audioId?: string; lyrics?: string };
}

type Status = "loading" | "success" | "error";

export default function TranscribeStep({ onNext, onPrev, onDataUpdate, videoData }: TranscribeStepProps) {
  const [status, setStatus] = useState<Status>("loading");
  const [elapsed, setElapsed] = useState(0);
  const started = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    if (videoData.lyrics) {
      setStatus("success");
      return;
    }

    if (!videoData.audioId) {
      setStatus("error");
      return;
    }

    timerRef.current = setInterval(() => setElapsed((s) => s + 1), 1000);

    transcribeAudioClient(videoData.audioId)
      .then(({ transcript, words, lines }) => {
        if (transcript?.trim()) {
          const update: Parameters<typeof onDataUpdate>[0] = { lyrics: transcript.trim() };
          if (words && words.length > 0) update.assemblyWords = words;
          if (lines && lines.length > 0) update.assemblyLines = lines;
          onDataUpdate(update);
          setStatus("success");
        } else {
          setStatus("error");
          toast.error("No speech detected — enter lyrics manually");
        }
      })
      .catch(() => {
        setStatus("error");
        toast.error("Transcription failed — you can type lyrics manually");
      })
      .finally(() => {
        if (timerRef.current) clearInterval(timerRef.current);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  const handleSkip = () => {
    onDataUpdate({ lyrics: "" });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Transcribing Audio</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Using AssemblyAI to detect lyrics from your audio
        </p>
      </div>

      <div className="flex flex-col items-center justify-center py-16 gap-5">
        {status === "loading" && (
          <>
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-9 h-9 text-primary" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-card border flex items-center justify-center">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
              </div>
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">Analyzing your audio...</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                AssemblyAI is detecting lyrics. Longer tracks can take 1–2 minutes.
              </p>
            </div>
            <div className="w-64 space-y-2">
              <div className="h-1.5 w-full rounded-full bg-primary/10 overflow-hidden">
                <div className="h-full w-2/5 bg-primary/50 rounded-full animate-progress" />
              </div>
              <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>{Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, "0")} elapsed</span>
              </div>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">Lyrics detected!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Review and edit them in the next step.
              </p>
            </div>
          </>
        )}

        {status === "error" && (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-lg">Couldn&apos;t detect lyrics</p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                No worries — you can type or paste your lyrics in the next step.
              </p>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={status === "loading"}>
          Back
        </Button>
        <div className="flex gap-2">
          {status === "loading" ? (
            <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
              Skip — enter manually
            </Button>
          ) : (
            <Button onClick={onNext}>
              {status === "success" ? "Review Lyrics" : "Enter Manually"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
