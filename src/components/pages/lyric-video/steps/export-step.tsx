"use client";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Download, CheckCircle2, Video } from "lucide-react";
import {
  generateFinalVideoClient,
  getJobStatusClient,
  getLyricVideoByIdClient,
} from "@/components/pages/lyric-video/api";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Check } from "lucide-react";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
}) as unknown as ComponentType<Record<string, unknown>>;

interface ExportStepProps {
  onPrev: () => void;
  onComplete: () => void;
  videoData: { lyricVideoId?: number };
}

const ASPECT_RATIOS: { value: "1:1" | "9:16" | "16:9"; label: string; sub: string; icon: string }[] = [
  { value: "1:1", label: "Square", sub: "Instagram · 1080×1080", icon: "⬜" },
  { value: "9:16", label: "Portrait", sub: "TikTok · Reels · 1080×1920", icon: "📱" },
  { value: "16:9", label: "Landscape", sub: "YouTube · 1920×1080", icon: "🖥" },
];

export default function ExportStep({ onPrev, onComplete, videoData }: ExportStepProps) {
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "9:16" | "16:9">("16:9");
  const [generating, setGenerating] = useState(false);
  const [finalVideoUrl, setFinalVideoUrl] = useState("");
  const [status, setStatus] = useState("");
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressStage, setProgressStage] = useState("");
  const [framesDone, setFramesDone] = useState(0);
  const [totalFrames, setTotalFrames] = useState(0);
  const [previewFrameUrl, setPreviewFrameUrl] = useState("");
  const [downloading, setDownloading] = useState(false);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => { if (pollingRef.current) clearInterval(pollingRef.current); };
  }, []);

  useEffect(() => {
    if (!videoData.lyricVideoId || finalVideoUrl) return;
    getLyricVideoByIdClient(videoData.lyricVideoId)
      .then((result) => {
        if (result.finalVideoUrl) {
          setFinalVideoUrl(result.finalVideoUrl);
          setStatus("completed");
        }
      })
      .catch(() => {});
  }, [finalVideoUrl, videoData.lyricVideoId]);

  const applyProgress = (p: unknown) => {
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
  };

  const finishWithSuccess = async (lyricVideoId: number) => {
    setGenerating(false);
    setStatus("completed");
    const result = await getLyricVideoByIdClient(lyricVideoId);
    if (result.finalVideoUrl) setFinalVideoUrl(result.finalVideoUrl);
    toast.success("Video ready to download!");
  };

  const startPolling = (jobId: string, lyricVideoId: number) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    const startedAt = Date.now();
    const interval = setInterval(async () => {
      if (Date.now() - startedAt > 10 * 60 * 1000) {
        clearInterval(interval);
        setGenerating(false);
        setStatus("failed");
        toast.error("Export is taking too long. Please try again.");
        return;
      }
      try {
        const result = await getJobStatusClient(jobId);
        applyProgress(result.progress);
        if (result.state === "completed") {
          clearInterval(interval);
          await finishWithSuccess(lyricVideoId);
        } else if (result.state === "failed") {
          clearInterval(interval);
          setGenerating(false);
          setStatus("failed");
          toast.error(result.failedReason || "Export failed");
        }
      } catch {
        // continue polling
      }
    }, 2000);
    pollingRef.current = interval;
  };

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
      const result = await generateFinalVideoClient(lyricVideoId, aspectRatio);
      if (result.jobId.startsWith("sync-")) {
        await new Promise((r) => setTimeout(r, 1000));
        try {
          const jobResult = await getJobStatusClient(result.jobId);
          applyProgress(jobResult.progress);
          if (jobResult.state === "completed") {
            await finishWithSuccess(lyricVideoId);
            return;
          } else if (jobResult.state === "failed") {
            setGenerating(false);
            setStatus("failed");
            toast.error("Export failed");
            return;
          }
        } catch {
          // fall through to polling
        }
      }
      startPolling(result.jobId, lyricVideoId);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to start export");
      setGenerating(false);
      setStatus("");
    }
  };

  const handleDownload = async () => {
    if (!finalVideoUrl) return;
    setDownloading(true);
    try {
      const response = await fetch(finalVideoUrl);
      if (!response.ok) throw new Error("Fetch failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `lyric-video-${videoData.lyricVideoId || "export"}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      toast.error("Download failed. Try right-clicking the video to save.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Export</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose your format and generate the final video. This counts as 1 generation toward your monthly limit.
        </p>
      </div>

      {/* Aspect ratio selection */}
      {!finalVideoUrl && status !== "generating" && (
        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-sm font-medium">Format</p>
            <div className="grid grid-cols-3 gap-3">
              {ASPECT_RATIOS.map((r) => (
                <button
                  key={r.value}
                  onClick={() => setAspectRatio(r.value)}
                  className={`relative flex flex-col items-center gap-2 py-5 px-3 rounded-xl border-2 transition-all ${
                    aspectRatio === r.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40 hover:bg-accent/20"
                  }`}
                >
                  {aspectRatio === r.value && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  )}
                  <span className="text-xl">{r.icon}</span>
                  <span className="font-medium text-sm">{r.label}</span>
                  <span className="text-xs text-muted-foreground text-center leading-tight">{r.sub}</span>
                </button>
              ))}
            </div>
          </div>
          <Button onClick={handleGenerate} disabled={generating} className="w-full py-5 text-base">
            <Video className="w-4 h-4 mr-2" />
            Generate Final Video
          </Button>
        </div>
      )}

      {/* Generating */}
      {status === "generating" && (
        <div className="flex flex-col items-center py-12 gap-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-card border flex items-center justify-center">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
            </div>
          </div>
          <div className="text-center">
            <p className="font-semibold">Rendering final video...</p>
            <p className="text-sm text-muted-foreground mt-1">This may take several minutes</p>
          </div>
          <div className="w-full max-w-sm space-y-2">
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{progressStage || "Starting..."}</span>
              <span>{progressPercent}%</span>
            </div>
            {totalFrames > 0 && (
              <p className="text-xs text-muted-foreground">
                Frames: {framesDone} / {totalFrames}
              </p>
            )}
          </div>
          {previewFrameUrl && (
            <div className="w-full max-w-sm rounded-xl overflow-hidden border">
              <Image
                src={previewFrameUrl}
                alt="Rendering frame"
                width={640}
                height={360}
                className="w-full object-cover"
                unoptimized
              />
            </div>
          )}
        </div>
      )}

      {/* Completed */}
      {finalVideoUrl && status === "completed" && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-green-500 text-sm font-medium">
            <CheckCircle2 className="w-4 h-4" />
            Video ready
          </div>
          <div className="rounded-xl overflow-hidden bg-black aspect-video">
            <ReactPlayer
              url={finalVideoUrl}
              controls
              width="100%"
              height="100%"
              onError={(e: unknown) => {
                console.error("ReactPlayer error:", e);
                toast.error("Video failed to load. Try downloading directly.");
              }}
            />
          </div>
          <div className="flex gap-3">
            <Button onClick={handleDownload} disabled={downloading} className="flex-1">
              {downloading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Downloading...</>
              ) : (
                <><Download className="w-4 h-4 mr-2" />Download MP4</>
              )}
            </Button>
            <Button variant="outline" onClick={onComplete} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-1">
        <Button variant="outline" onClick={onPrev} disabled={generating}>
          Back
        </Button>
        {status === "completed" && (
          <Button onClick={onComplete}>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            View All Videos
          </Button>
        )}
      </div>
    </div>
  );
}
