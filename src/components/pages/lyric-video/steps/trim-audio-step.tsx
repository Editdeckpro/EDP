"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Play, Pause, Scissors, Loader2 } from "lucide-react";
import { uploadAudioClient, createLyricVideoClient, getLyricVideoByIdClient } from "@/components/pages/lyric-video/api";

type LyricVideoWizardData = {
  audioId?: string;
  audioUrl?: string;
  audioDuration?: number;
  lyrics?: string;
  lyricVideoId?: number;
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
const BAR_COUNT = 80;

export default function TrimAudioStep({ onNext, onPrev, onDataUpdate, videoData }: TrimAudioStepProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [trimStart, setTrimStart] = useState(videoData.trimStart ?? 0);
  const [trimEnd, setTrimEnd] = useState(
    videoData.trimEnd ?? Math.min(MAX_DURATION, videoData.audioDuration ?? MAX_DURATION)
  );
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const [dragging, setDragging] = useState<"start" | "end" | null>(null);
  const duration = videoData.audioDuration ?? 0;
  const trimDuration = trimEnd - trimStart;
  const isValid = trimDuration >= MIN_DURATION && trimDuration <= MAX_DURATION;

  // Load waveform from audio data
  useEffect(() => {
    if (!videoData.audioUrl) return;
    let cancelled = false;

    const load = async () => {
      try {
        const res = await fetch(videoData.audioUrl!);
        const buf = await res.arrayBuffer();
        const ctx = new AudioContext();
        const decoded = await ctx.decodeAudioData(buf);
        await ctx.close();
        if (cancelled) return;
        const ch = decoded.getChannelData(0);
        const samplesPerBar = Math.floor(ch.length / BAR_COUNT);
        const bars: number[] = [];
        for (let i = 0; i < BAR_COUNT; i++) {
          let sum = 0;
          for (let j = 0; j < samplesPerBar; j++) sum += Math.abs(ch[i * samplesPerBar + j]);
          bars.push(sum / samplesPerBar);
        }
        const max = Math.max(...bars, 0.001);
        setWaveformBars(bars.map((b) => b / max));
      } catch {
        if (!cancelled) {
          // Fallback: sine-wave-ish placeholder
          setWaveformBars(
            Array.from({ length: BAR_COUNT }, (_, i) =>
              0.25 + Math.abs(Math.sin(i * 0.25)) * 0.5 + Math.random() * 0.1
            )
          );
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [videoData.audioUrl]);

  // Audio playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => {
      setCurrentTime(audio.currentTime);
      if (audio.currentTime >= trimEnd) {
        audio.pause();
        audio.currentTime = trimStart;
        setIsPlaying(false);
      }
    };
    audio.addEventListener("timeupdate", onTime);
    return () => audio.removeEventListener("timeupdate", onTime);
  }, [trimEnd, trimStart]);

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

  const getTimeFromPointer = useCallback(
    (clientX: number): number => {
      if (!containerRef.current) return 0;
      const rect = containerRef.current.getBoundingClientRect();
      return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)) * duration;
    },
    [duration]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const time = getTimeFromPointer(e.clientX);
      if (dragging === "start") {
        setTrimStart(Math.max(0, Math.min(time, trimEnd - MIN_DURATION)));
      } else {
        const minEnd = trimStart + MIN_DURATION;
        const maxEnd = Math.min(duration, trimStart + MAX_DURATION);
        setTrimEnd(Math.max(minEnd, Math.min(time, maxEnd)));
      }
    },
    [dragging, trimEnd, trimStart, duration, getTimeFromPointer]
  );

  const handlePointerUp = useCallback(() => setDragging(null), []);

  const handleTrimAndUpload = useCallback(async () => {
    if (!videoData.audioUrl || !isValid) return;

    setUploading(true);
    try {
      const res = await fetch(videoData.audioUrl);
      const buf = await res.arrayBuffer();
      const ctx = new AudioContext();
      const decoded = await ctx.decodeAudioData(buf);

      const sr = decoded.sampleRate;
      const startSample = Math.floor(trimStart * sr);
      const endSample = Math.floor(trimEnd * sr);
      const frameCount = endSample - startSample;
      const trimmed = ctx.createBuffer(decoded.numberOfChannels, frameCount, sr);
      for (let ch = 0; ch < decoded.numberOfChannels; ch++) {
        trimmed.copyToChannel(decoded.getChannelData(ch).slice(startSample, endSample), ch);
      }
      await ctx.close();

      const wavBlob = audioBufferToWav(trimmed);
      const file = new File([wavBlob], "trimmed.wav", { type: "audio/wav" });
      const uploadResult = await uploadAudioClient(file);

      // Create the lyric video project now that we have trimmed audio + reviewed lyrics
      const createResult = await createLyricVideoClient({
        audioId: uploadResult.audioId,
        lyrics: videoData.lyrics || "",
      });

      if (!createResult?.lyricVideoId) {
        toast.error("Failed to create lyric video project");
        return;
      }

      onDataUpdate({
        audioId: uploadResult.audioId,
        audioUrl: uploadResult.audioUrl,
        audioDuration: uploadResult.duration,
        trimStart,
        trimEnd,
        lyricVideoId: createResult.lyricVideoId,
      });

      // Poll until lyricsData words are ready (backend runs alignLyricsToAudio async)
      setSyncing(true);
      const POLL_INTERVAL = 3000;
      const MAX_WAIT = 60000;
      const deadline = Date.now() + MAX_WAIT;
      let wordsReady = false;
      while (Date.now() < deadline) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL));
        try {
          const video = await getLyricVideoByIdClient(createResult.lyricVideoId);
          if (video.words && video.words.length > 0) {
            wordsReady = true;
            break;
          }
        } catch {
          // ignore poll errors, keep trying
        }
      }
      setSyncing(false);

      if (!wordsReady) {
        toast.warning("Lyrics sync timed out — you can adjust timing manually.");
      } else {
        toast.success("Audio trimmed");
      }
      onNext();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error(err?.response?.data?.message || err?.message || "Failed to trim audio. Please try again.");
    } finally {
      setUploading(false);
      setSyncing(false);
    }
  }, [videoData.audioUrl, videoData.lyrics, isValid, trimStart, trimEnd, onDataUpdate, onNext]);

  const startPct = duration > 0 ? (trimStart / duration) * 100 : 0;
  const endPct = duration > 0 ? (trimEnd / duration) * 100 : 0;
  const playPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Trim Audio</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Drag the handles to select a 15–30 second section for your lyric video.
        </p>
      </div>

      {videoData.audioUrl && <audio ref={audioRef} src={videoData.audioUrl} preload="auto" />}

      {/* Waveform */}
      <div className="space-y-2">
        <div
          ref={containerRef}
          className="relative h-28 rounded-xl bg-muted/40 select-none cursor-crosshair"
          style={{ touchAction: "none" }}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          {/* Waveform bars */}
          <div className="absolute inset-x-0 inset-y-0 flex items-center gap-px px-1">
            {(waveformBars.length ? waveformBars : Array(BAR_COUNT).fill(0.4)).map((h, i) => {
              const barTime = duration > 0 ? (i / BAR_COUNT) * duration : 0;
              const inSel = barTime >= trimStart && barTime <= trimEnd;
              return (
                <div
                  key={i}
                  className={`flex-1 rounded-sm transition-colors duration-75 ${
                    inSel ? "bg-primary" : "bg-muted-foreground/20"
                  }`}
                  style={{ height: `${Math.max(10, h * 85)}%` }}
                />
              );
            })}
          </div>

          {/* Dim overlay outside selection */}
          <div
            className="absolute top-0 bottom-0 left-0 bg-background/40 pointer-events-none rounded-l-xl"
            style={{ width: `${startPct}%` }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 bg-background/40 pointer-events-none rounded-r-xl"
            style={{ width: `${100 - endPct}%` }}
          />

          {/* Playhead */}
          {(isPlaying || currentTime > 0) && (
            <div
              className="absolute top-0 bottom-0 w-px bg-white/70 pointer-events-none"
              style={{ left: `${playPct}%` }}
            />
          )}

          {/* Start handle */}
          <div
            className="absolute top-0 bottom-0 flex items-center justify-center cursor-ew-resize"
            style={{ left: `calc(${startPct}% - 10px)`, width: "20px", touchAction: "none" }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setDragging("start");
            }}
          >
            <div className="w-1 h-full bg-primary/50" />
            <div className="absolute w-5 h-10 bg-primary rounded-md flex flex-col items-center justify-center gap-0.5 shadow-lg cursor-ew-resize">
              <div className="w-px h-3 bg-primary-foreground/60 rounded" />
              <div className="w-px h-3 bg-primary-foreground/60 rounded" />
            </div>
          </div>

          {/* End handle */}
          <div
            className="absolute top-0 bottom-0 flex items-center justify-center cursor-ew-resize"
            style={{ left: `calc(${endPct}% - 10px)`, width: "20px", touchAction: "none" }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              setDragging("end");
            }}
          >
            <div className="w-1 h-full bg-primary/50" />
            <div className="absolute w-5 h-10 bg-primary rounded-md flex flex-col items-center justify-center gap-0.5 shadow-lg cursor-ew-resize">
              <div className="w-px h-3 bg-primary-foreground/60 rounded" />
              <div className="w-px h-3 bg-primary-foreground/60 rounded" />
            </div>
          </div>
        </div>

        {/* Timeline labels */}
        <div className="flex justify-between text-xs text-muted-foreground px-1">
          <span>0:00</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Selection info */}
      <div className="flex items-center justify-between bg-muted/40 rounded-xl px-5 py-4">
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Selection</p>
          <p className="text-sm font-medium tabular-nums">
            {formatTime(trimStart)} → {formatTime(trimEnd)}
          </p>
        </div>
        <div className={`text-right ${isValid ? "text-green-500" : "text-amber-500"}`}>
          <p className="text-2xl font-bold tabular-nums leading-none">{trimDuration.toFixed(1)}s</p>
          <p className="text-xs mt-0.5">
            {isValid ? "Good length ✓" : `Need ${MIN_DURATION}–${MAX_DURATION}s`}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPrev} disabled={uploading || syncing}>
            Back
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={togglePlay}
            disabled={!videoData.audioUrl || uploading || syncing}
            title={isPlaying ? "Pause" : "Preview selection"}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </div>
        <Button onClick={handleTrimAndUpload} disabled={!isValid || uploading || syncing}>
          {syncing ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Syncing lyrics to audio...</>
          ) : uploading ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
          ) : (
            <><Scissors className="w-4 h-4 mr-2" />Trim & Continue</>
          )}
        </Button>
      </div>
    </div>
  );
}

function formatTime(s: number): string {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const bitDepth = 16;
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;
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
  view.setUint16(20, 1, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, "data");
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      offset += 2;
    }
  }
  return wavBuffer;
}
