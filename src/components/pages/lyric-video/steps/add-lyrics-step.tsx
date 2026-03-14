"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Loader2, Upload } from "lucide-react";
import { createLyricVideoClient, transcribeAudioClient } from "@/components/pages/lyric-video/api";

type LyricVideoWizardData = {
  audioId?: string;
  lyrics?: string;
  lyricVideoId?: number;
  timingData?: unknown;
};

interface AddLyricsStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: Partial<LyricVideoWizardData>) => void;
  videoData: LyricVideoWizardData;
}

export default function AddLyricsStep({ onNext, onPrev, onDataUpdate, videoData }: AddLyricsStepProps) {
  const [lyrics, setLyrics] = useState<string>(videoData.lyrics || "");
  const [loading, setLoading] = useState(false);
  const [transcribing, setTranscribing] = useState(false);

  useEffect(() => {
    if (!videoData.audioId || videoData.lyrics) return;

    setTranscribing(true);
    transcribeAudioClient(videoData.audioId)
      .then(({ transcript }) => {
        if (transcript) setLyrics(transcript);
      })
      .catch(() => {
        toast.error("Auto-transcription failed — you can type your lyrics manually");
      })
      .finally(() => setTranscribing(false));
  }, [videoData.audioId, videoData.lyrics]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setLyrics(text);
    };
    reader.readAsText(file);
  };

  const handleNext = async () => {
    if (!lyrics.trim()) {
      toast.error("Please enter lyrics");
      return;
    }

    if (!videoData.audioId) {
      toast.error("Audio file is required");
      return;
    }

    setLoading(true);

    try {
      // Create lyric video project
      const createResult = await createLyricVideoClient({
        audioId: videoData.audioId,
        lyrics: lyrics.trim(),
      });

      if (!createResult || !createResult.lyricVideoId) {
        toast.error("Failed to create lyric video project");
        setLoading(false);
        return;
      }

      onDataUpdate({
        lyrics: lyrics.trim(),
        lyricVideoId: createResult.lyricVideoId,
        timingData: null,
      });

      toast.success("Lyrics added successfully");
      setLoading(false);
      onNext();
    } catch (error: unknown) {
      console.error("Error creating lyric video:", error);
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to process lyrics";
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Add Lyrics</h2>
        <p className="text-muted-foreground">
          Paste your lyrics or upload a text file. Each line will be treated as a separate line in the video.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="lyrics">
            {transcribing ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Transcribing lyrics...
              </span>
            ) : (
              "Lyrics"
            )}
          </Label>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="file-upload"
              className="cursor-pointer flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Upload className="h-4 w-4" />
              Upload .txt file
            </Label>
            <input
              id="file-upload"
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        <Textarea
          id="lyrics"
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          disabled={transcribing}
          placeholder={transcribing ? "Transcribing your audio..." : "Enter your lyrics here...\nEach line will be displayed separately\n\nExample:\nHello world\nThis is a test\nOf lyric videos"}
          className="min-h-[300px] font-mono text-sm"
        />

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>
            {lyrics.split("\n").filter((l: string) => l.trim()).length} lines,{" "}
            {lyrics.split(/\s+/).filter((w: string) => w).length} words
          </span>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={loading}>
          Previous
        </Button>
        <Button onClick={handleNext} disabled={!lyrics.trim() || loading || transcribing}>
          {loading ? "Processing..." : "Next: Edit Timing"}
        </Button>
      </div>
    </div>
  );
}
