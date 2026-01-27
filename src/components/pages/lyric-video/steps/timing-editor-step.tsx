"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { getLyricVideoByIdClient, regenerateTimingClient } from "@/components/pages/lyric-video/api";

type LyricVideoWizardData = {
  lyricVideoId?: number;
  timingData?: unknown;
};

interface TimingEditorStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: Partial<LyricVideoWizardData>) => void;
  videoData: LyricVideoWizardData;
}

export default function TimingEditorStep({ onNext, onPrev, onDataUpdate, videoData }: TimingEditorStepProps) {
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [timingData, setTimingData] = useState<unknown>(null);
  const [audioUrl, setAudioUrl] = useState<string>("");

  useEffect(() => {
    loadTimingData();
  }, [videoData.lyricVideoId]);

  const loadTimingData = async () => {
    if (!videoData.lyricVideoId) {
      setLoading(false);
      return;
    }

    const lyricVideoId = videoData.lyricVideoId;

    try {
      const result = await getLyricVideoByIdClient(lyricVideoId);
      setTimingData(result.lyricsData || { words: [], lines: [] });
      setAudioUrl(result.audioUrl || "");
      setLoading(false);
    } catch {
      console.error("Error loading timing data");
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!videoData.lyricVideoId) return;

    const lyricVideoId = videoData.lyricVideoId;

    setRegenerating(true);
    try {
      const result = await regenerateTimingClient(lyricVideoId);
      setTimingData(result);
      toast.success("Timing regenerated successfully");
    } catch {
      toast.error("Failed to regenerate timing");
    } finally {
      setRegenerating(false);
    }
  };

  const handleNext = () => {
    const td = timingData as { words?: unknown[] } | null;
    if (!td || !Array.isArray(td.words) || td.words.length === 0) {
      toast.error("Please wait for timing alignment to complete");
      return;
    }
    onDataUpdate({ timingData });
    onNext();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading timing data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-semibold">Edit Timing</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRegenerate}
            disabled={regenerating}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${regenerating ? "animate-spin" : ""}`} />
            Regenerate Timing
          </Button>
        </div>
        <p className="text-muted-foreground">
          AI has automatically aligned your lyrics to the audio. You can manually adjust timing if needed.
        </p>
      </div>

      {audioUrl && (
        <div className="bg-muted rounded-lg p-4">
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}

      {(() => {
        const td = timingData as { lines?: Array<{ text: string; startTime: number; endTime: number; words: Array<{ word: string; startTime: number; endTime: number }> }> } | null;
        if (td && Array.isArray(td.lines) && td.lines.length > 0) {
          return (
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4 max-h-[400px] overflow-y-auto">
            {td.lines.map((line, lineIndex: number) => (
              <div key={lineIndex} className="mb-4 pb-4 border-b last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    Line {lineIndex + 1}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {line.startTime.toFixed(2)}s - {line.endTime.toFixed(2)}s
                  </span>
                </div>
                <p className="text-lg">{line.text}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {line.words.map((word, wordIndex: number) => (
                    <span
                      key={wordIndex}
                      className="text-sm px-2 py-1 bg-background rounded border"
                      title={`${word.startTime.toFixed(2)}s - ${word.endTime.toFixed(2)}s`}
                    >
                      {word.word}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Timing alignment complete. You can proceed to customize the style.
          </p>
        </div>
          );
        }
        return (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Timing alignment is in progress. Please wait...
          </p>
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
        </div>
        );
      })()}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={!Array.isArray((timingData as { words?: unknown[] } | null)?.words) || ((timingData as { words?: unknown[] } | null)?.words?.length ?? 0) === 0}
        >
          Next: Choose Style
        </Button>
      </div>
    </div>
  );
}
