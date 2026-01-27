"use client";
import { useState, useEffect, useCallback } from "react";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Loader2, Video, Download } from "lucide-react";
import Link from "next/link";
import { getLyricVideosClient, LyricVideo } from "@/components/pages/lyric-video/api";
import dynamic from "next/dynamic";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as unknown as ComponentType<Record<string, unknown>>;

export default function LyricVideosPage() {
  const [videos, setVideos] = useState<LyricVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getLyricVideosClient({ page, limit: 20 });
      setVideos(result.videos);
      setTotalPages(result.pagination.totalPages);
    } catch {
      toast.error("Failed to load lyric videos");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadVideos();
  }, [loadVideos]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "processing":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-muted-foreground";
    }
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lyric Videos</h1>
          <p className="text-muted-foreground">Manage your lyric video projects</p>
        </div>
        <Link href="/lyric-video/create">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create New Video
          </Button>
        </Link>
      </div>

      {videos.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No lyric videos yet</p>
          <Link href="/lyric-video/create">
            <Button>Create Your First Video</Button>
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="border rounded-lg overflow-hidden">
                {video.previewVideoUrl ? (
                  <div className="aspect-video bg-black">
                    <ReactPlayer
                      url={video.previewVideoUrl}
                      width="100%"
                      height="100%"
                      controls
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${getStatusColor(video.status)}`}>
                      {video.status}
                    </span>
                    {video.aspectRatio && (
                      <span className="text-xs text-muted-foreground">{video.aspectRatio}</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Duration: {video.audioDuration.toFixed(1)}s
                  </p>
                  {video.finalVideoUrl && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = video.finalVideoUrl!;
                        link.download = `lyric-video-${video.id}.mp4`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                      }}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
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
