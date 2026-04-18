"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Play, RefreshCw, Clapperboard } from "lucide-react";
import {
  generatePreviewClient,
  getJobStatusClient,
  getLyricVideoByIdClient,
} from "@/components/pages/lyric-video/api";

interface PreviewStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: Partial<{ previewUrl: string }>) => void;
  videoData: { lyricVideoId?: number; previewUrl?: string };
}

export default function PreviewStep({ onNext, onPrev, onDataUpdate, videoData }: PreviewStepProps) {
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState("");
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const started = useRef(false);

  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const checkExisting = useCallback(async (): Promise<boolean> => {
    if (!videoData.lyricVideoId) return false;
    try {
      const result = await getLyricVideoByIdClient(videoData.lyricVideoId);
      if (result.previewVideoUrl) {
        setPreviewUrl(result.previewVideoUrl);
        onDataUpdate({ previewUrl: result.previewVideoUrl });
        setStatus("completed");
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  }, [onDataUpdate, videoData.lyricVideoId]);

  const finishWithSuccess = useCallback(async () => {
    setGenerating(false);
    setStatus("completed");
    if (!videoData.lyricVideoId) return;
    const videoResult = await getLyricVideoByIdClient(videoData.lyricVideoId);
    if (videoResult.previewVideoUrl) {
      setPreviewUrl(videoResult.previewVideoUrl);
      onDataUpdate({ previewUrl: videoResult.previewVideoUrl });
    }
    toast.success("Preview ready");
  }, [onDataUpdate, videoData.lyricVideoId]);

  const startPolling = useCallback(
    (jobId: string) => {
      if (pollingRef.current) clearInterval(pollingRef.current);
      const startedAt = Date.now();
      const interval = setInterval(async () => {
        if (Date.now() - startedAt > 5 * 60 * 1000) {
          clearInterval(interval);
          setGenerating(false);
          setStatus("failed");
          toast.error("Preview is taking too long. Please try again.");
          return;
        }
        try {
          const result = await getJobStatusClient(jobId);
          if (typeof result.progress === "number") setProgressPercent(Math.round(result.progress));
          if (result.state === "completed") {
            clearInterval(interval);
            await finishWithSuccess();
          } else if (result.state === "failed") {
            clearInterval(interval);
            setGenerating(false);
            setStatus("failed");
            toast.error(result.failedReason || "Preview generation failed");
          }
        } catch {
          // continue polling
        }
      }, 2000);
      pollingRef.current = interval;
    },
    [finishWithSuccess]
  );

  const handleGenerate = useCallback(async () => {
    if (!videoData.lyricVideoId) {
      toast.error("Lyric video not found");
      return;
    }
    setGenerating(true);
    setStatus("generating");
    setProgressPercent(0);
    setProgressStage("");

    try {
      const result = await generatePreviewClient(videoData.lyricVideoId);
      if (result.previewUrl || !result.jobId) {
        await finishWithSuccess();
        return;
      }
      startPolling(result.jobId);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err?.response?.data?.message || err?.message || "Failed to generate preview");
      setGenerating(false);
      setStatus("");
    }
  }, [videoData.lyricVideoId, finishWithSuccess, startPolling]);

  // On entering this step: check for an existing preview. If none exists,
  // auto-trigger generation so the user doesn't sit staring at an empty state.
  // The `started` ref guards against StrictMode double-mount re-firing.
  useEffect(() => {
    if (started.current) return;
    if (!videoData.lyricVideoId) return;
    started.current = true;
    (async () => {
      const found = await checkExisting();
      if (!found) handleGenerate();
    })();
  }, [videoData.lyricVideoId, checkExisting, handleGenerate]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Preview</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Generate a preview of your lyric video before exporting.
        </p>
      </div>

      {!previewUrl && status !== "generating" && (
        <div className="flex flex-col items-center justify-center py-16 gap-5 rounded-xl border-2 border-dashed border-border">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <Clapperboard className="w-8 h-8 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-medium">No preview yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Generate a preview to see how your video will look.
            </p>
          </div>
          <Button onClick={handleGenerate} disabled={generating} className="px-8">
            <Play className="w-4 h-4 mr-2" />
            Generate Preview
          </Button>
        </div>
      )}

      {status === "generating" && (
        <div className="flex flex-col items-center justify-center py-12 gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Clapperboard className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-semibold">Rendering your lyric video...</p>
            <p className="text-sm text-muted-foreground mt-1">This takes 30–60 seconds</p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progressStage || "Rendering..."}</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {previewUrl && status === "completed" && (
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden bg-black aspect-video">
            <video
              src={previewUrl}
              controls
              width="100%"
              height="100%"
              style={{ display: "block", width: "100%", height: "100%" }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Preview is 720p · Export is full 1080p HD
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={generating}
            className="gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-1">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!previewUrl || status !== "completed"}>
          Next: Export
        </Button>
      </div>
    </div>
  );
}