"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { FileText, Upload, Loader2, RotateCcw } from "lucide-react";
import { transcribeAudioClient } from "@/components/pages/lyric-video/api";

type LyricVideoWizardData = {
  audioId?: string;
  lyrics?: string;
};

interface AddLyricsStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: Partial<LyricVideoWizardData>) => void;
  videoData: LyricVideoWizardData;
}

export default function AddLyricsStep({ onNext, onPrev, onDataUpdate, videoData }: AddLyricsStepProps) {
  const [lyrics, setLyrics] = useState(videoData.lyrics || "");
  const [retranscribing, setRetranscribing] = useState(false);

  const lineCount = lyrics.split("\n").filter((l) => l.trim()).length;
  const wordCount = lyrics.split(/\s+/).filter((w) => w).length;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLyrics(ev.target?.result as string);
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleRetranscribe = async () => {
    if (!videoData.audioId) return;
    setRetranscribing(true);
    try {
      const { transcript } = await transcribeAudioClient(videoData.audioId);
      if (transcript?.trim()) {
        setLyrics(transcript.trim());
        toast.success("Re-transcribed successfully");
      } else {
        toast.error("No speech detected");
      }
    } catch {
      toast.error("Re-transcription failed");
    } finally {
      setRetranscribing(false);
    }
  };

  const handleNext = () => {
    if (!lyrics.trim()) {
      toast.error("Please enter lyrics before continuing");
      return;
    }
    onDataUpdate({ lyrics: lyrics.trim() });
    onNext();
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold">Review Lyrics</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Edit the transcribed lyrics or type them manually. Each line becomes a separate lyric line in the video.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <FileText className="w-3.5 h-3.5" />
            <span>{lineCount} lines · {wordCount} words</span>
          </div>
          <div className="flex items-center gap-1">
            {videoData.audioId && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRetranscribe}
                disabled={retranscribing}
                className="h-7 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
              >
                {retranscribing ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <RotateCcw className="w-3 h-3" />
                )}
                Re-transcribe
              </Button>
            )}
            <label className="h-7 px-2 text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer rounded-md hover:bg-accent">
              <Upload className="w-3 h-3" />
              Import .txt
              <input type="file" accept=".txt" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        <Textarea
          value={lyrics}
          onChange={(e) => setLyrics(e.target.value)}
          placeholder={"Enter your lyrics here...\n\nEach line will appear separately in the video.\n\nExample:\nVerse one starts here\nAnother line below it\n\nChorus here\nSing it loud"}
          className="min-h-[300px] font-mono text-sm resize-none leading-relaxed"
        />
      </div>

      <div className="flex justify-between pt-1">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!lyrics.trim()}>
          Continue to Trim
        </Button>
      </div>
    </div>
  );
}
