"use client";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Download, CheckCircle2 } from "lucide-react";
import { generateFinalVideoClient, getJobStatusClient, getLyricVideoByIdClient } from "@/components/pages/lyric-video/api";
import Image from "next/image";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as unknown as ComponentType<Record<string, unknown>>;

interface ExportStepProps {
  onPrev: () => void;
  onComplete: () => void;
  videoData: { lyricVideoId?: number };
}

const ASPECT_RATIOS = [
  { value: "1:1", label: "1:1 (Instagram)", description: "1080x1080" },
  { value: "9:16", label: "9:16 (TikTok/Reels)", description: "1080x1920" },
  { value: "16:9", label: "16:9 (YouTube)", description: "1920x1080" },
];

export default function ExportStep({ onPrev, onComplete, videoData }: ExportStepProps) {
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "9:16" | "16:9">("16:9");
  const [generating, setGenerating] = useState(false);
  const [finalVideoUrl, setFinalVideoUrl] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [progressStage, setProgressStage] = useState<string>("");
  const [framesDone, setFramesDone] = useState<number>(0);
  const [totalFrames, setTotalFrames] = useState<number>(0);
  const [previewFrameUrl, setPreviewFrameUrl] = useState<string>("");
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const checkExistingFinal = async () => {
      if (!videoData.lyricVideoId) return;
      try {
        const result = await getLyricVideoByIdClient(videoData.lyricVideoId);
        if (result.finalVideoUrl) {
          setFinalVideoUrl(result.finalVideoUrl);
          setStatus("completed");
        }
      } catch {
        console.error("Error checking final video");
      }
    };
    if (videoData.lyricVideoId && !finalVideoUrl) {
      checkExistingFinal();
    }
  }, [finalVideoUrl, videoData.lyricVideoId]);

  const handleGenerate = async () => {
    if (!videoData.lyricVideoId) {
      toast.error("Lyric video not found");
      return;
    }

    const lyricVideoId = videoData.lyricVideoId;

    setGenerating(true);
    setStatus("generating");
    setProgressPercent(0);
    setProgressStage("");
    setFramesDone(0);
    setTotalFrames(0);
    setPreviewFrameUrl("");

    try {
      const result = await generateFinalVideoClient(videoData.lyricVideoId, aspectRatio);
      if (result.finalUrl) {
        setFinalVideoUrl(result.finalUrl);
        setGenerating(false);
        setStatus("completed");
        toast.success("Video generated successfully!");
        return;
      }
      pollJobStatus(result.jobId, lyricVideoId);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to generate video");
      setGenerating(false);
      setStatus("");
    }
  };

  const pollJobStatus = async (jobId: string, lyricVideoId: number) => {
    if (jobId.startsWith("sync-")) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const result = await getJobStatusClient(jobId);
        const p = (result as { progress?: unknown }).progress;
        if (p && typeof p === "object") {
          const prog = p as {
            percent?: unknown;
            stage?: unknown;
            frame?: unknown;
            totalFrames?: unknown;
            previewImageUrl?: unknown;
          };
          if (typeof prog.percent === "number") setProgressPercent(Math.max(0, Math.min(100, Math.round(prog.percent))));
          if (typeof prog.stage === "string") setProgressStage(prog.stage);
          if (typeof prog.frame === "number") setFramesDone(prog.frame);
          if (typeof prog.totalFrames === "number") setTotalFrames(prog.totalFrames);
          if (typeof prog.previewImageUrl === "string") {
            const be = process.env.NEXT_PUBLIC_BE_URL || "";
            const url = `${be}${prog.previewImageUrl}`;
            setPreviewFrameUrl(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`);
          }
        } else if (typeof p === "number") {
          setProgressPercent(Math.max(0, Math.min(100, Math.round(p))));
        }

        if (result.state === "completed") {
          setGenerating(false);
          setStatus("completed");
          const videoResult = await getLyricVideoByIdClient(lyricVideoId);
          if (videoResult.finalVideoUrl) {
            setFinalVideoUrl(videoResult.finalVideoUrl);
          }
          toast.success("Video generated successfully!");
        } else if (result.state === "failed") {
          setGenerating(false);
          setStatus("failed");
          toast.error("Video generation failed");
        } else {
          startPolling(jobId, lyricVideoId);
        }
      } catch (error) {
        console.error("Error checking sync job status:", error);
        startPolling(jobId, lyricVideoId);
      }
      return;
    }

    startPolling(jobId, lyricVideoId);
  };

  const startPolling = (jobId: string, lyricVideoId: number) => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    const startedAt = Date.now();
    const timeoutMs = 10 * 60 * 1000;
    const interval = setInterval(async () => {
      try {
        if (Date.now() - startedAt > timeoutMs) {
          if (pollingIntervalRef.current === interval) pollingIntervalRef.current = null;
          clearInterval(interval);
          setGenerating(false);
          setStatus("failed");
          toast.error("Video generation is taking too long. Please try again.");
          return;
        }

        const result = await getJobStatusClient(jobId);
        const p = (result as { progress?: unknown }).progress;
        if (p && typeof p === "object") {
          const prog = p as {
            percent?: unknown;
            stage?: unknown;
            frame?: unknown;
            totalFrames?: unknown;
            previewImageUrl?: unknown;
          };
          if (typeof prog.percent === "number") setProgressPercent(Math.max(0, Math.min(100, Math.round(prog.percent))));
          if (typeof prog.stage === "string") setProgressStage(prog.stage);
          if (typeof prog.frame === "number") setFramesDone(prog.frame);
          if (typeof prog.totalFrames === "number") setTotalFrames(prog.totalFrames);
          if (typeof prog.previewImageUrl === "string") {
            const be = process.env.NEXT_PUBLIC_BE_URL || "";
            const url = `${be}${prog.previewImageUrl}`;
            setPreviewFrameUrl(`${url}${url.includes("?") ? "&" : "?"}t=${Date.now()}`);
          }
        } else if (typeof p === "number") {
          setProgressPercent(Math.max(0, Math.min(100, Math.round(p))));
        }

        if (result.state === "completed") {
          if (pollingIntervalRef.current === interval) pollingIntervalRef.current = null;
          clearInterval(interval);
          setGenerating(false);
          setStatus("completed");
          const videoResult = await getLyricVideoByIdClient(lyricVideoId);
          if (videoResult.finalVideoUrl) {
            setFinalVideoUrl(videoResult.finalVideoUrl);
          }
          toast.success("Video generated successfully!");
        } else if (result.state === "failed") {
          if (pollingIntervalRef.current === interval) pollingIntervalRef.current = null;
          clearInterval(interval);
          setGenerating(false);
          setStatus("failed");
          toast.error(result.failedReason || "Video generation failed");
        }
      } catch (error) {
        console.error("Error polling job status:", error);
      }
    }, 2000);
    pollingIntervalRef.current = interval;
  };

  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (!finalVideoUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(finalVideoUrl);
      if (!response.ok) throw new Error("Failed to fetch video");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `lyric-video-${videoData.lyricVideoId || ""}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed. Try right-clicking the video and saving.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Export Video</h2>
        <p className="text-muted-foreground">
          Choose the aspect ratio and generate your final lyric video. This counts as 1 generation toward your monthly limit.
        </p>
      </div>

      {!finalVideoUrl && status !== "generating" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aspectRatio">Aspect Ratio</Label>
            <Select value={aspectRatio} onValueChange={(value) => setAspectRatio(value as "1:1" | "9:16" | "16:9")}>
              <SelectTrigger id="aspectRatio">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASPECT_RATIOS.map((ratio) => (
                  <SelectItem key={ratio.value} value={ratio.value}>
                    <div>
                      <div className="font-medium">{ratio.label}</div>
                      <div className="text-xs text-muted-foreground">{ratio.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleGenerate} disabled={generating} className="w-full">
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Final Video"
            )}
          </Button>
        </div>
      )}

      {status === "generating" && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Generating final video...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take several minutes</p>
          </div>

          <div className="w-full max-w-md space-y-2">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progressStage ? `Stage: ${progressStage}` : "Stage: starting"}</span>
              <span>{progressPercent}%</span>
            </div>
            {totalFrames > 0 && (
              <div className="text-xs text-muted-foreground">
                Frames: {framesDone}/{totalFrames}
              </div>
            )}
          </div>

          {previewFrameUrl && (
            <div className="w-full max-w-md">
              <div className="relative aspect-video rounded-md overflow-hidden border">
                <Image src={previewFrameUrl} alt="Rendering preview" fill className="object-contain" />
              </div>
            </div>
          )}
        </div>
      )}

      {finalVideoUrl && status === "completed" && (
        <div className="space-y-4">
          <div className="bg-black rounded-lg overflow-hidden aspect-video">
            <ReactPlayer url={finalVideoUrl} controls width="100%" height="100%" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload} disabled={downloading} className="flex-1">
              {downloading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Downloading...</>
              ) : (
                <><Download className="h-4 w-4 mr-2" />Download Video</>
              )}
            </Button>
            <Button onClick={onComplete} variant="outline" className="flex-1">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Done
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={generating}>
          Previous
        </Button>
        {status === "completed" && (
          <Button onClick={onComplete}>View All Videos</Button>
        )}
      </div>
    </div>
  );
}
