"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { FileText, Upload } from "lucide-react";
import { createLyricVideoClient, alignTimingClient } from "@/components/pages/lyric-video/api";

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

      // Wait a bit for AI timing alignment to start
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Get timing data (it might still be processing)
      let timingResult = null;
      try {
        timingResult = await alignTimingClient(videoData.audioId, lyrics.trim());
      } catch (timingError: unknown) {
        console.warn("Timing alignment may still be processing:", timingError);
        // Continue even if timing isn't ready yet - user can regenerate later
      }

      onDataUpdate({
        lyrics: lyrics.trim(),
        lyricVideoId: createResult.lyricVideoId,
        timingData: timingResult || null,
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
          <Label htmlFor="lyrics">Lyrics</Label>
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
          placeholder="Enter your lyrics here...&#10;Each line will be displayed separately&#10;&#10;Example:&#10;Hello world&#10;This is a test&#10;Of lyric videos"
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
        <Button onClick={handleNext} disabled={!lyrics.trim() || loading}>
          {loading ? "Processing..." : "Next: Edit Timing"}
        </Button>
      </div>
    </div>
  );
}
