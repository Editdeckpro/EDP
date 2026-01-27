"use client";
import { useState } from "react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Download, CheckCircle2 } from "lucide-react";
import { generateFinalVideoClient, getJobStatusClient, getLyricVideoByIdClient } from "@/components/pages/lyric-video/api";
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

  const handleGenerate = async () => {
    if (!videoData.lyricVideoId) {
      toast.error("Lyric video not found");
      return;
    }

    const lyricVideoId = videoData.lyricVideoId;

    setGenerating(true);
    setStatus("generating");

    try {
      const result = await generateFinalVideoClient(videoData.lyricVideoId, aspectRatio);
      pollJobStatus(result.jobId, lyricVideoId);
    } catch (error: unknown) {
      const err = error as { message?: string };
      toast.error(err?.message || "Failed to generate video");
      setGenerating(false);
      setStatus("");
    }
  };

  const pollJobStatus = async (jobId: string, lyricVideoId: number) => {
    const interval = setInterval(async () => {
      try {
        const result = await getJobStatusClient(jobId);
        if (result.state === "completed") {
          clearInterval(interval);
          setGenerating(false);
          setStatus("completed");
          // Reload video data to get final URL
          const videoResult = await getLyricVideoByIdClient(lyricVideoId);
          if (videoResult.finalVideoUrl) {
            setFinalVideoUrl(videoResult.finalVideoUrl);
          }
          toast.success("Video generated successfully!");
        } else if (result.state === "failed") {
          clearInterval(interval);
          setGenerating(false);
          setStatus("failed");
          toast.error("Video generation failed");
        }
      } catch (error) {
        console.error("Error polling job status:", error);
      }
    }, 3000);

    // Clear interval after 10 minutes
    setTimeout(() => clearInterval(interval), 10 * 60 * 1000);
  };

  const handleDownload = () => {
    if (finalVideoUrl) {
      const link = document.createElement("a");
      link.href = finalVideoUrl;
      link.download = `lyric-video-${videoData.lyricVideoId || ""}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Export Video</h2>
        <p className="text-muted-foreground">
          Choose the aspect ratio and generate your final lyric video. This will use 1 credit.
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
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Generating final video...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take several minutes</p>
        </div>
      )}

      {finalVideoUrl && status === "completed" && (
        <div className="space-y-4">
          <div className="bg-black rounded-lg overflow-hidden aspect-video">
            <ReactPlayer url={finalVideoUrl} controls width="100%" height="100%" />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download Video
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
