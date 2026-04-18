"use client";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Loader2, Video, Download, Clock, Music2 } from "lucide-react";
import Link from "next/link";
import { getLyricVideosClient, LyricVideo } from "@/components/pages/lyric-video/api";

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function formatDuration(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${String(rem).padStart(2, "0")}`;
}

function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diffSec = Math.floor((Date.now() - then) / 1000);
  if (diffSec < 60) return "just now";
  const min = Math.floor(diffSec / 60);
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// Lyrics blob has no dedicated title — derive one from the first non-label line
// so cards show something recognizable instead of a bare id.
function deriveTitle(lyrics: string | null | undefined): string {
  if (!lyrics) return "Untitled lyric video";
  const firstLine = lyrics
    .split(/\r?\n/)
    .map((l) => l.trim())
    .find((l) => l && !/^\[.*\]$/.test(l));
  if (!firstLine) return "Untitled lyric video";
  return firstLine.length > 60 ? firstLine.slice(0, 60) + "…" : firstLine;
}

function statusMeta(status: string): { label: string; pillClass: string } {
  switch (status) {
    case "completed":
      return {
        label: "Completed",
        pillClass: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      };
    case "preview":
      return {
        label: "Preview ready",
        pillClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      };
    case "processing":
      return {
        label: "Processing",
        pillClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      };
    case "failed":
      return {
        label: "Failed",
        pillClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      };
    case "draft":
      return {
        label: "Draft",
        pillClass: "bg-muted text-muted-foreground border-transparent",
      };
    default:
      return {
        label: status || "Unknown",
        pillClass: "bg-muted text-muted-foreground border-transparent",
      };
  }
}

export default function LyricVideosPage() {
  const [videos, setVideos] = useState<LyricVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getLyricVideosClient({ page, limit: 20 });
      setVideos(result.videos ?? []);
      setTotalPages(result.pagination?.totalPages ?? 1);
    } catch {
      toast.error("Failed to load lyric videos");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const handleDownload = (video: LyricVideo) => {
    if (!video.finalVideoUrl) return;
    const link = document.createElement("a");
    link.href = video.finalVideoUrl;
    link.download = `lyric-video-${video.id}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Lyric Videos</h1>
          <p className="text-sm text-muted-foreground">
            {videos.length === 0
              ? "Your lyric video projects will appear here"
              : `${videos.length} ${videos.length === 1 ? "project" : "projects"}`}
          </p>
        </div>
        <Link href="/lyric-video/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Video
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl border border-dashed border-border bg-gradient-to-br from-muted/40 via-muted/20 to-transparent py-20 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Music2 className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-lg font-semibold">No lyric videos yet</h2>
          <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto px-4">
            Upload an audio file and let AI generate a polished lyric video in minutes.
          </p>
          <Link href="/lyric-video/create">
            <Button className="mt-6">
              <Plus className="h-4 w-4 mr-2" />
              Create your first video
            </Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const title = deriveTitle(video.lyrics);
              const meta = statusMeta(video.status);
              return (
                <div
                  key={video.id}
                  className="group rounded-xl border bg-card overflow-hidden transition-all hover:border-primary/30 hover:shadow-md"
                >
                  <div className="relative aspect-video bg-black">
                    {video.previewVideoUrl ? (
                      <video
                        src={video.previewVideoUrl}
                        preload="metadata"
                        controls
                        className="absolute inset-0 w-full h-full"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                        <Video className="h-10 w-10 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3
                        className="font-medium text-sm truncate flex-1 min-w-0"
                        title={title}
                      >
                        {title}
                      </h3>
                      <Badge variant="outline" className={meta.pillClass}>
                        {meta.label}
                      </Badge>
                    </div>
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDuration(video.audioDuration)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatRelativeTime(video.createdAt)}</span>
                      {video.aspectRatio && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{video.aspectRatio}</span>
                        </>
                      )}
                    </div>
                    {video.finalVideoUrl && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => handleDownload(video)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download MP4
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
