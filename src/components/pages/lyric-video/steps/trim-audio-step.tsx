"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Scissors, Play, Pause, Loader2 } from "lucide-react";
import { uploadAudioClient } from "@/components/pages/lyric-video/api";

type LyricVideoWizardData = {
  audioId?: string;
  audioUrl?: string;
  audioDuration?: number;
  trimStart?: number;
  trimEnd?: number;
};

interface TrimAudioStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: Partial<LyricVideoWizardData>) => void;
  videoData: LyricVideoWizardData;
}

const MIN_DURATION = 15;
const MAX_DURATION = 30;

export default function TrimAudioStep({ onNext, onPrev, onDataUpdate, videoData }: TrimAudioStepProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(videoData.trimStart ?? 0);
  const [trimEnd, setTrimEnd] = useState(
    videoData.trimEnd ?? Math.min(30, videoData.audioDuration ?? 30)
  );
  const [uploading, setUploading] = useState(false);
  const duration = videoData.audioDuration ?? 0;

  const trimDuration = trimEnd - trimStart;
  const isValid = trimDuration >= MIN_DURATION && trimDuration <= MAX_DURATION;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying && currentTime >= trimEnd) {
      audio.pause();
      audio.currentTime = trimStart;
      setIsPlaying(false);
    }
  }, [currentTime, trimEnd, trimStart, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.currentTime = trimStart;
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const maxStart = trimEnd - MIN_DURATION;
    const newStart = Math.min(val, maxStart);
    setTrimStart(newStart);
    if (audioRef.current) audioRef.current.currentTime = newStart;
  };

  const handleEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    const minEnd = trimStart + MIN_DURATION;
    const maxEnd = Math.min(trimStart + MAX_DURATION, duration);
    const newEnd = Math.max(minEnd, Math.min(val, maxEnd));
    setTrimEnd(newEnd);
  };

  const handleTrimAndUpload = useCallback(async () => {
    if (!videoData.audioUrl) {
      toast.error("No audio file found");
      return;
    }
    if (!isValid) {
      toast.error(`Selection must be between ${MIN_DURATION} and ${MAX_DURATION} seconds`);
      return;
    }

    setUploading(true);
    try {
      const response = await fetch(videoData.audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioCtx = new AudioContext();
      const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

      const sampleRate = audioBuffer.sampleRate;
      const startSample = Math.floor(trimStart * sampleRate);
      const endSample = Math.floor(trimEnd * sampleRate);
      const frameCount = endSample - startSample;

      const trimmedBuffer = audioCtx.createBuffer(
        audioBuffer.numberOfChannels,
        frameCount,
        sampleRate
      );

      for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
        const channelData = audioBuffer.getChannelData(ch).slice(startSample, endSample);
        trimmedBuffer.copyToChannel(channelData, ch);
      }

      const wavBlob = audioBufferToWav(trimmedBuffer);
      const trimmedFile = new File([wavBlob], "trimmed-audio.wav", { type: "audio/wav" });

      const result = await uploadAudioClient(trimmedFile);

      onDataUpdate({
        audioId: result.audioId,
        audioUrl: result.audioUrl,
        audioDuration: result.duration,
        trimStart,
        trimEnd,
      });

      toast.success("Audio trimmed and uploaded successfully");
      onNext();
    } catch (err) {
      console.error("Trim error:", err);
      toast.error("Failed to trim audio. Please try again.");
    } finally {
      setUploading(false);
    }
  }, [videoData.audioUrl, isValid, trimStart, trimEnd, onDataUpdate, onNext]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const startPercent = duration > 0 ? (trimStart / duration) * 100 : 0;
  const endPercent = duration > 0 ? (trimEnd / duration) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Trim Audio</h2>
        <p className="text-muted-foreground">
          Select a 15–30 second section of your audio for the lyric video.
        </p>
      </div>

      {videoData.audioUrl && (
        <audio ref={audioRef} src={videoData.audioUrl} preload="auto" />
      )}

      <div className="space-y-3">
        <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
          <div
            className="absolute top-0 h-full bg-primary/20 border-l-2 border-r-2 border-primary"
            style={{ left: `${startPercent}%`, width: `${endPercent - startPercent}%` }}
          />
          <div
            className="absolute top-0 h-full w-0.5 bg-red-500 transition-all"
            style={{ left: `${progressPercent}%` }}
          />
          <div className="absolute bottom-1 left-1 text-xs text-muted-foreground">0s</div>
          <div className="absolute bottom-1 right-1 text-xs text-muted-foreground">
            {duration.toFixed(0)}s
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <label className="font-medium">Start: {trimStart.toFixed(1)}s</label>
            <span className="text-muted-foreground">Drag to set start point</span>
          </div>
          <input
            type="range"
            min={0}
            max={duration - MIN_DURATION}
            step={0.1}
            value={trimStart}
            onChange={handleStartChange}
            className="w-full accent-primary"
          />
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <label className="font-medium">End: {trimEnd.toFixed(1)}s</label>
            <span className={`text-sm font-medium ${isValid ? "text-green-500" : "text-destructive"}`}>
              {trimDuration.toFixed(1)}s selected {isValid ? "✓" : `(need ${MIN_DURATION}–${MAX_DURATION}s)`}
            </span>
          </div>
          <input
            type="range"
            min={trimStart + MIN_DURATION}
            max={Math.min(trimStart + MAX_DURATION, duration)}
            step={0.1}
            value={trimEnd}
            onChange={handleEndChange}
            className="w-full accent-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={togglePlay} disabled={!videoData.audioUrl || uploading}>
          {isPlaying ? (
            <><Pause className="h-4 w-4 mr-2" /> Pause Preview</>
          ) : (
            <><Play className="h-4 w-4 mr-2" /> Preview Selection</>
          )}
        </Button>
        <span className="text-sm text-muted-foreground">
          Plays from {trimStart.toFixed(1)}s to {trimEnd.toFixed(1)}s
        </span>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} disabled={uploading}>
          Previous
        </Button>
        <Button onClick={handleTrimAndUpload} disabled={!isValid || uploading}>
          {uploading ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Trimming...</>
          ) : (
            <><Scissors className="h-4 w-4 mr-2" /> Trim & Continue</>
          )}
        </Button>
      </div>
    </div>
  );
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataLength = buffer.length * blockAlign;
  const wavBuffer = new ArrayBuffer(44 + dataLength);
  const view = new DataView(wavBuffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataLength, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const sample = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
  }

  return wavBuffer;
}
