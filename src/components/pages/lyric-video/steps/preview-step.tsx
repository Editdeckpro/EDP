"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Play, RefreshCw } from "lucide-react";
import { generatePreviewClient, getJobStatusClient, getLyricVideoByIdClient } from "@/components/pages/lyric-video/api";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

interface PreviewStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: any) => void;
  videoData: any;
  onEditTiming: () => void;
}

export default function PreviewStep({ onNext, onPrev, onDataUpdate, videoData, onEditTiming }: PreviewStepProps) {
  const [generating, setGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [jobId, setJobId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStage, setProgressStage] = useState<string>("");
  const [framesDone, setFramesDone] = useState<number>(0);
  const [totalFrames, setTotalFrames] = useState<number>(0);
  const [previewFrameUrl, setPreviewFrameUrl] = useState<string>("");

  useEffect(() => {
    if (videoData.lyricVideoId && !previewUrl) {
      checkExistingPreview();
    }
  }, [videoData.lyricVideoId]);

  const checkExistingPreview = async () => {
    try {
      const result = await getLyricVideoByIdClient(videoData.lyricVideoId);
      if (result.previewVideoUrl) {
        setPreviewUrl(result.previewVideoUrl);
        setStatus("completed");
      }
    } catch (error) {
      console.error("Error checking preview:", error);
    }
  };

  const handleGeneratePreview = async () => {
    if (!videoData.lyricVideoId) {
      toast.error("Lyric video not found");
      return;
    }

    setGenerating(true);
    setStatus("generating");
    setProgressPercent(0);
    setProgressStage("");
    setFramesDone(0);
    setTotalFrames(0);
    setPreviewFrameUrl("");

    try {
      const result = await generatePreviewClient(videoData.lyricVideoId);
      setJobId(result.jobId);
      
      // If preview URL is already available (sync job completed), use it immediately
      if (result.previewUrl) {
        setPreviewUrl(result.previewUrl);
        setStatus("completed");
        setGenerating(false);
        toast.success("Preview generated successfully");
        return;
      }
      
      // For sync jobs, check immediately; for async jobs, start polling
      await pollJobStatus(result.jobId);
    } catch (error: any) {
      console.error("Error generating preview:", error);
      toast.error(error?.response?.data?.message || error.message || "Failed to generate preview");
      setGenerating(false);
      setStatus("");
    }
  };

  const pollJobStatus = async (jobId: string) => {
    // For sync jobs (starting with 'sync-'), check immediately since they complete synchronously
    if (jobId.startsWith('sync-')) {
      // Wait a moment for the sync job to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const result = await getJobStatusClient(jobId);

        const p: any = (result as any).progress;
        if (p && typeof p === 'object') {
          if (typeof p.percent === 'number') setProgressPercent(Math.max(0, Math.min(100, Math.round(p.percent))));
          if (typeof p.stage === 'string') setProgressStage(p.stage);
          if (typeof p.frame === 'number') setFramesDone(p.frame);
          if (typeof p.totalFrames === 'number') setTotalFrames(p.totalFrames);
          if (typeof p.previewImageUrl === 'string') {
            const be = process.env.NEXT_PUBLIC_BE_URL || '';
            const url = `${be}${p.previewImageUrl}`;
            setPreviewFrameUrl(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`);
          }
        } else if (typeof p === 'number') {
          setProgressPercent(Math.max(0, Math.min(100, Math.round(p))));
        }

        if (result.state === "completed") {
          setGenerating(false);
          setStatus("completed");
          // Reload video data to get preview URL
          const videoResult = await getLyricVideoByIdClient(videoData.lyricVideoId);
          if (videoResult.previewVideoUrl) {
            setPreviewUrl(videoResult.previewVideoUrl);
          }
          toast.success("Preview generated successfully");
        } else if (result.state === "failed") {
          setGenerating(false);
          setStatus("failed");
          toast.error("Preview generation failed");
        } else {
          // Still processing, start polling
          startPolling(jobId);
        }
      } catch (error) {
        console.error("Error checking sync job status:", error);
        // Fallback to polling
        startPolling(jobId);
      }
    } else {
      // For async jobs, start polling immediately
      startPolling(jobId);
    }
  };

  const startPolling = (jobId: string) => {
    const startedAt = Date.now();
    const timeoutMs = 5 * 60 * 1000;
    const interval = setInterval(async () => {
      try {
        if (Date.now() - startedAt > timeoutMs) {
          clearInterval(interval);
          setGenerating(false);
          setStatus("failed");
          toast.error("Preview generation is taking too long. Please try again.");
          return;
        }

        const result = await getJobStatusClient(jobId);
        if (result.state === "completed") {
          clearInterval(interval);
          setGenerating(false);
          setStatus("completed");
          // Reload video data to get preview URL
          const videoResult = await getLyricVideoByIdClient(videoData.lyricVideoId);
          if (videoResult.previewVideoUrl) {
            setPreviewUrl(videoResult.previewVideoUrl);
          }
          toast.success("Preview generated successfully");
        } else if (result.state === "failed") {
          clearInterval(interval);
          setGenerating(false);
          setStatus("failed");
          toast.error(result.failedReason || "Preview generation failed");
        }
      } catch (error) {
        console.error("Error polling job status:", error);
      }
    }, 2000);
  };

  const handleNext = () => {
    if (!previewUrl) {
      toast.error("Please generate preview first");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Preview</h2>
        <p className="text-muted-foreground">
          Generate and review a preview of your lyric video before creating the final version.
        </p>
      </div>

      {!previewUrl && status !== "generating" && (
        <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">No preview generated yet</p>
          <Button onClick={handleGeneratePreview} disabled={generating}>
            <Play className="h-4 w-4 mr-2" />
            Generate Preview
          </Button>
        </div>
      )}

      {status === "generating" && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Generating preview video...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>

          <div className="w-full max-w-lg mt-6 space-y-3">
            <div className="w-full h-2 bg-muted rounded overflow-hidden">
              <div
                className="h-2 bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{progressStage ? `Stage: ${progressStage}` : 'Stage: starting'}</span>
              <span>{progressPercent}%</span>
            </div>
            {totalFrames > 0 && (
              <div className="text-xs text-muted-foreground">Frames: {framesDone}/{totalFrames}</div>
            )}
            {previewFrameUrl && (
              <div className="w-full">
                <img
                  src={previewFrameUrl}
                  alt="Rendering preview"
                  className="w-full rounded border"
                />
              </div>
            )}
          </div>
        </div>
      )}

      {previewUrl && status === "completed" && (
        <div className="space-y-4">
          <div className="bg-black rounded-lg overflow-hidden aspect-video">
            <ReactPlayer url={previewUrl} controls width="100%" height="100%" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleGeneratePreview} disabled={generating}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Regenerate Preview
            </Button>
            <Button variant="outline" onClick={onEditTiming}>
              Edit Timing
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!previewUrl || status !== "completed"}>
          Next: Export
        </Button>
      </div>
    </div>
  );
}
