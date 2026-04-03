"use client";
import { useState, useRef, useEffect } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface NoteEvent   { note: string; step: number; duration: string; }
interface ChordEvent  { notes: string[]; step: number; duration: string; }

interface Beat {
  id: string;
  name: string;
  bpm: number;
  key: string;
  timeSignature: string;
  description: string;
  kick:    number[];
  snare:   number[];
  hihat:   number[];
  openHat: number[];
  bass:    NoteEvent[];
  chords:  ChordEvent[];
  melody:  NoteEvent[];
}

// ── WAV encoder ───────────────────────────────────────────────────────────────

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numCh = buffer.numberOfChannels;
  const sr    = buffer.sampleRate;
  const len   = buffer.length * numCh * 2;
  const ab    = new ArrayBuffer(44 + len);
  const view  = new DataView(ab);
  const ws    = (off: number, s: string) => { for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i)); };

  ws(0, "RIFF"); view.setUint32(4, 36 + len, true);
  ws(8, "WAVE"); ws(12, "fmt "); view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); view.setUint16(22, numCh, true);
  view.setUint32(24, sr, true); view.setUint32(28, sr * numCh * 2, true);
  view.setUint16(32, numCh * 2, true); view.setUint16(34, 16, true);
  ws(36, "data"); view.setUint32(40, len, true);

  let off = 44;
  for (let i = 0; i < buffer.length; i++) {
    for (let ch = 0; ch < numCh; ch++) {
      const s = Math.max(-1, Math.min(1, buffer.getChannelData(ch)[i]));
      view.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      off += 2;
    }
  }
  return ab;
}

// ── Sequencer grid ─────────────────────────────────────────────────────────────

const ROW_LABELS = ["Kick", "Snare", "Hi-Hat", "Open"];
const ROW_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-cyan-400",
  "bg-teal-400",
];

function SequencerGrid({ beat }: { beat: Beat }) {
  const rows = [beat.kick, beat.snare, beat.hihat, beat.openHat ?? Array(16).fill(0)];
  return (
    <div className="space-y-1.5 mt-4">
      {rows.map((row, ri) => (
        <div key={ri} className="flex items-center gap-2">
          <span className="text-[10px] text-white/40 w-10 text-right shrink-0">{ROW_LABELS[ri]}</span>
          <div className="flex gap-[3px] flex-1">
            {row.map((on, si) => (
              <div
                key={si}
                className={`flex-1 h-5 rounded-sm transition-colors ${
                  on ? ROW_COLORS[ri] : "bg-white/10"
                } ${si === 4 || si === 8 || si === 12 ? "ml-1" : ""}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Beat card ──────────────────────────────────────────────────────────────────

function BeatCard({
  beat,
  isPlaying,
  onPlay,
  onStop,
  onExport,
  exporting,
}: {
  beat: Beat;
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onExport: () => void;
  exporting: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 flex flex-col gap-3">
      <div>
        <h3 className="text-white font-bold text-lg leading-tight">{beat.name}</h3>
        <p className="text-white/50 text-sm mt-0.5">{beat.description}</p>
      </div>

      <div className="flex gap-3 text-xs text-white/60">
        <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{beat.bpm} BPM</span>
        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">{beat.key}</span>
        <span className="px-2 py-0.5 rounded-full bg-white/10">{beat.timeSignature}</span>
      </div>

      <SequencerGrid beat={beat} />

      <div className="flex gap-2 mt-1">
        <button
          onClick={isPlaying ? onStop : onPlay}
          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
        >
          {isPlaying ? (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <rect x="5" y="4" width="3" height="12" rx="1" />
                <rect x="12" y="4" width="3" height="12" rx="1" />
              </svg>
              Stop
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
              </svg>
              Play
            </>
          )}
        </button>

        <button
          onClick={onExport}
          disabled={exporting}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-white/20 hover:bg-white/10 text-white/70 hover:text-white text-sm font-semibold transition-colors disabled:opacity-50"
        >
          {exporting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
          WAV
        </button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function BeatProducerPage() {
  const [genre, setGenre] = useState("");
  const [mood, setMood] = useState("");
  const [tempo, setTempo] = useState("");
  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const synthsRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seqRef    = useRef<any>(null);

  const stopAll = () => {
    import("tone").then(({ getTransport }) => {
      getTransport().stop();
      getTransport().cancel();
    }).catch(() => {});
    if (seqRef.current) { try { seqRef.current.dispose(); } catch {} seqRef.current = null; }
    synthsRef.current.forEach(s => { try { s.dispose(); } catch {} });
    synthsRef.current = [];
    setPlayingId(null);
  };

  useEffect(() => () => stopAll(), []);

  const generate = async () => {
    setLoading(true);
    setError("");
    stopAll();
    setBeats([]);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BE_URL}/api/beat/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ genre, mood, tempo }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || `Server error ${res.status}`);
      }
      const data = (await res.json()) as { beats: Beat[] };
      setBeats(data.beats.slice(0, 2));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const playBeat = async (beat: Beat) => {
    stopAll();
    const Tone = await import("tone");
    await Tone.start();

    Tone.getTransport().bpm.value = beat.bpm;

    const kick    = new Tone.MembraneSynth({ pitchDecay: 0.08, octaves: 6 }).toDestination();
    const snare   = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.01 } }).toDestination();
    const hihat   = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
    const openHat = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.3, release: 0.1 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
    const bass    = new Tone.MonoSynth({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.3 }, filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.2, baseFrequency: 200, octaves: 2 } }).toDestination();
    const chordsSynth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" }, envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 1.2 } }).toDestination();
    const melodySynth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.15, sustain: 0.3, release: 0.5 } }).toDestination();

    // Lower volume so mix isn't harsh
    kick.volume.value    = -6;
    snare.volume.value   = -8;
    hihat.volume.value   = -14;
    openHat.volume.value = -14;
    bass.volume.value    = -10;
    chordsSynth.volume.value = -12;
    melodySynth.volume.value = -10;

    synthsRef.current = [kick, snare, hihat, openHat, bass, chordsSynth, melodySynth];

    const steps = [...Array(16).keys()];
    const seq = new Tone.Sequence(
      (time: number, step: number) => {
        if (beat.kick[step])       kick.triggerAttackRelease("C1", "8n", time);
        if (beat.snare[step])      snare.triggerAttackRelease("8n", time);
        if (beat.hihat[step])      hihat.triggerAttackRelease("C6", "32n", time);
        if (beat.openHat?.[step])  openHat.triggerAttackRelease("C6", "8n", time);
        beat.bass.filter(n => n.step === step).forEach(n =>
          bass.triggerAttackRelease(n.note, n.duration, time)
        );
        beat.chords.filter(n => n.step === step).forEach(n =>
          chordsSynth.triggerAttackRelease(n.notes, n.duration, time)
        );
        beat.melody.filter(n => n.step === step).forEach(n =>
          melodySynth.triggerAttackRelease(n.note, n.duration, time)
        );
      },
      steps,
      "16n"
    );
    seqRef.current = seq;
    seq.start(0);
    Tone.getTransport().start();
    setPlayingId(beat.id);
  };

  const exportWav = async (beat: Beat) => {
    if (exportingId) return;
    setExportingId(beat.id);
    try {
      const Tone = await import("tone");
      const bars = 4;
      const durationSec = (60 / beat.bpm) * 4 * bars + 0.5; // 4 bars + 0.5s tail

      const toneBuffer = await Tone.Offline(async () => {
        Tone.getTransport().bpm.value = beat.bpm;

        const kick    = new Tone.MembraneSynth({ pitchDecay: 0.08, octaves: 6 }).toDestination();
        const snare   = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.01 } }).toDestination();
        const hihat   = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.05, release: 0.01 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
        const openHat = new Tone.MetalSynth({ envelope: { attack: 0.001, decay: 0.3, release: 0.1 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination();
        const bass    = new Tone.MonoSynth({ oscillator: { type: "sawtooth" }, envelope: { attack: 0.01, decay: 0.1, sustain: 0.7, release: 0.3 }, filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.5, release: 0.2, baseFrequency: 200, octaves: 2 } }).toDestination();
        const chordsSynth = new Tone.PolySynth(Tone.Synth, { oscillator: { type: "triangle" }, envelope: { attack: 0.05, decay: 0.3, sustain: 0.4, release: 1.2 } }).toDestination();
        const melodySynth = new Tone.Synth({ oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.15, sustain: 0.3, release: 0.5 } }).toDestination();

        kick.volume.value = -6; snare.volume.value = -8; hihat.volume.value = -14;
        openHat.volume.value = -14; bass.volume.value = -10;
        chordsSynth.volume.value = -12; melodySynth.volume.value = -10;

        const seq = new Tone.Sequence(
          (time: number, step: number) => {
            if (beat.kick[step])      kick.triggerAttackRelease("C1", "8n", time);
            if (beat.snare[step])     snare.triggerAttackRelease("8n", time);
            if (beat.hihat[step])     hihat.triggerAttackRelease("C6", "32n", time);
            if (beat.openHat?.[step]) openHat.triggerAttackRelease("C6", "8n", time);
            beat.bass.filter(n => n.step === step).forEach(n =>
              bass.triggerAttackRelease(n.note, n.duration, time)
            );
            beat.chords.filter(n => n.step === step).forEach(n =>
              chordsSynth.triggerAttackRelease(n.notes, n.duration, time)
            );
            beat.melody.filter(n => n.step === step).forEach(n =>
              melodySynth.triggerAttackRelease(n.note, n.duration, time)
            );
          },
          [...Array(16).keys()],
          "16n"
        );
        seq.loop = bars;
        seq.start(0);
        Tone.getTransport().start(0);
      }, durationSec);

      const audioBuffer = toneBuffer.get();
      if (!audioBuffer) throw new Error("Offline render failed");

      const wav  = audioBufferToWav(audioBuffer);
      const blob = new Blob([wav], { type: "audio/wav" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${beat.name.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "")}.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("WAV export failed:", e);
    } finally {
      setExportingId(null);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xl">
            🎛️
          </div>
          <h1 className="text-2xl font-bold">AI Beat Producer</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Describe the vibe and get two fully playable beats — with melody, chords, and drums.
        </p>
      </div>

      {/* Generation form */}
      <div className="rounded-2xl border bg-card p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Genre</label>
            <input
              value={genre}
              onChange={e => setGenre(e.target.value)}
              placeholder="e.g. Trap, Lo-fi, Afrobeats"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Mood</label>
            <input
              value={mood}
              onChange={e => setMood(e.target.value)}
              placeholder="e.g. Dark, Uplifting, Chill"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Tempo</label>
            <input
              value={tempo}
              onChange={e => setTempo(e.target.value)}
              placeholder="e.g. Fast, Slow, 140 BPM"
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Producing beats...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Generate Beats
            </>
          )}
        </button>

        {error && (
          <p className="mt-3 text-sm text-red-400 text-center">{error}</p>
        )}
      </div>

      {/* Beat cards */}
      {beats.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground text-center">
            Click Play to hear your beat. Export as WAV to use in your DAW.
          </p>
          {beats.map(beat => (
            <BeatCard
              key={beat.id}
              beat={beat}
              isPlaying={playingId === beat.id}
              onPlay={() => playBeat(beat)}
              onStop={stopAll}
              onExport={() => exportWav(beat)}
              exporting={exportingId === beat.id}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {beats.length === 0 && !loading && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-4">🎚️</div>
          <p className="text-sm">Fill in your preferences above and hit Generate.</p>
          <p className="text-xs mt-1 opacity-60">All fields are optional — leave them blank for a surprise.</p>
        </div>
      )}
    </div>
  );
}
