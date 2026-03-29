"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Music, Upload, Loader2, CheckCircle2, X } from "lucide-react";
import { uploadAudioClient } from "@/components/pages/lyric-video/api";
import { useSession } from "@/lib/auth-client";

interface UploadAudioStepProps {
  onNext: () => void;
  onDataUpdate: (data: Partial<{ audioId: string; audioUrl: string; audioDuration: number }>) => void;
  videoData: { audioId?: string; audioUrl?: string; audioDuration?: number };
}

export default function UploadAudioStep({ onNext, onDataUpdate, videoData }: UploadAudioStepProps) {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const planType = session?.user?.subscription?.planType || "FREE";
  const planLimit = planType === "NEXT_LEVEL" ? 20 : 300;

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;
      setFileName(file.name);
      setFileSize(file.size);
      setUploading(true);
      try {
        const result = await uploadAudioClient(file);
        if (result.duration > planLimit) {
          toast.error(`Audio (${Math.round(result.duration)}s) exceeds your plan limit of ${planLimit}s`);
          setFileName("");
          return;
        }
        onDataUpdate({ audioId: result.audioId, audioUrl: result.audioUrl, audioDuration: result.duration });
        toast.success("Audio uploaded");
      } catch (error: unknown) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        toast.error(err?.response?.data?.message || err?.message || "Upload failed");
        setFileName("");
      } finally {
        setUploading(false);
      }
    },
    [planLimit, onDataUpdate]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "audio/mpeg": [".mp3"], "audio/wav": [".wav"] },
    maxSize: 50 * 1024 * 1024,
    multiple: false,
  });

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName("");
    setFileSize(0);
    onDataUpdate({ audioId: undefined, audioUrl: undefined, audioDuration: undefined });
  };

  const isReady = Boolean(videoData.audioId);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Upload Audio</h2>
        <p className="text-sm text-muted-foreground mt-1">
          MP3 or WAV · Max 50MB · Up to {planLimit}s on your plan
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`relative rounded-xl border-2 border-dashed p-14 text-center cursor-pointer transition-all ${
          isDragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : isReady
            ? "border-primary/40 bg-primary/5"
            : "border-border hover:border-primary/40 hover:bg-accent/20"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input {...getInputProps()} />

        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="font-medium text-sm">Uploading...</p>
          </div>
        ) : isReady ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="font-medium">{fileName || "Audio uploaded"}</p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {fileSize > 0 && `${(fileSize / 1024 / 1024).toFixed(1)} MB · `}
                {videoData.audioDuration && `${Math.round(videoData.audioDuration)}s`}
              </p>
            </div>
            <p className="text-xs text-muted-foreground">Click or drag to replace</p>
            <button
              onClick={handleClear}
              className="absolute top-3 right-3 w-7 h-7 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
              {isDragActive ? (
                <Music className="h-7 w-7 text-primary" />
              ) : (
                <Upload className="h-7 w-7 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="font-medium">{isDragActive ? "Drop it!" : "Drag & drop your audio"}</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse</p>
            </div>
            <div className="flex gap-2 mt-1">
              {["MP3", "WAV"].map((fmt) => (
                <span key={fmt} className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">
                  {fmt}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {videoData.audioUrl && (
        <div className="rounded-lg bg-muted/50 p-3">
          <audio controls src={videoData.audioUrl} className="w-full h-8" />
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!isReady || uploading} className="px-6">
          Next: Transcribe
        </Button>
      </div>
    </div>
  );
}
