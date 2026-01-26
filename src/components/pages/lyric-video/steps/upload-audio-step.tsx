"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload, FileAudio, Loader2 } from "lucide-react";
import { uploadAudioClient } from "@/components/pages/lyric-video/api";
import { useSession } from "next-auth/react";

interface UploadAudioStepProps {
  onNext: () => void;
  onDataUpdate: (data: any) => void;
  videoData: any;
}

export default function UploadAudioStep({ onNext, onDataUpdate, videoData }: UploadAudioStepProps) {
  const { data: session } = useSession();
  const [uploading, setUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const planType = session?.user?.subscription?.planType || "FREE";
  const planLimit = planType === "NEXT_LEVEL" ? 20 : 300;

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadedFile(file);
    setUploading(true);

    try {
      const result = await uploadAudioClient(file);

      // Check duration limit
      if (result.duration > planLimit) {
        toast.error(
          `Audio duration (${result.duration}s) exceeds your plan limit of ${planLimit} seconds`
        );
        setUploading(false);
        return;
      }

      onDataUpdate({
        audioId: result.audioId,
        audioUrl: result.audioUrl,
        audioDuration: result.duration,
      });

      toast.success("Audio uploaded successfully");
      setUploading(false);
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to upload audio file";
      toast.error(errorMessage);
      setUploading(false);
      setUploadedFile(null);
    }
  }, [planLimit, onDataUpdate]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "audio/mpeg": [".mp3"],
      "audio/wav": [".wav"],
    },
    maxSize: 50 * 1024 * 1024, // 50MB
    multiple: false,
  });

  const handleNext = () => {
    if (!videoData.audioId) {
      toast.error("Please upload an audio file first");
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Upload Audio</h2>
        <p className="text-muted-foreground">
          Upload your audio file (MP3 or WAV). Maximum duration: {planLimit} seconds for your plan.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
        } ${uploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium">Uploading audio...</p>
          </div>
        ) : uploadedFile ? (
          <div className="flex flex-col items-center gap-4">
            <FileAudio className="h-12 w-12 text-primary" />
            <div>
              <p className="text-lg font-medium">{uploadedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              {videoData.audioDuration && (
                <p className="text-sm text-muted-foreground mt-1">
                  Duration: {videoData.audioDuration.toFixed(2)}s
                </p>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Click or drag to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <Upload className="h-12 w-12 text-muted-foreground" />
            <div>
              <p className="text-lg font-medium">
                {isDragActive ? "Drop audio file here" : "Drag & drop audio file here"}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                or click to browse (MP3, WAV - Max 50MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {videoData.audioUrl && (
        <div className="bg-muted rounded-lg p-4">
          <audio controls src={videoData.audioUrl} className="w-full" />
        </div>
      )}

      <div className="flex justify-end">
        <Button onClick={handleNext} disabled={!videoData.audioId || uploading}>
          Next: Add Lyrics
        </Button>
      </div>
    </div>
  );
}
