"use client";
import { useState, useRef, useEffect } from "react";
import { GetAxiosWithAuth } from "@/lib/axios-instance";

// ── Types ──────────────────────────────────────────────────────────────────────

interface NoteEvent  { note: string; step: number; duration: string; }
interface ChordEvent { notes: string[]; step: number; duration: string; }

interface Beat {
  id: string;
  name: string;
  bpm: number;
  key: string;
  genre: string;
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

// ── Hardcoded drum patterns (mirrors backend — never trust API drum data) ──────

const DRUM_PATTERNS: Record<string, { kick: number[]; snare: number[]; hihat: number[]; openHat: number[] }> = {
  trap: {
    kick:    [1,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0],
    snare:   [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    hihat:   [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    openHat: [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  },
  rb: {
    kick:    [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
    snare:   [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    hihat:   [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0],
    openHat: [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
  },
  pop: {
    kick:    [1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
    snare:   [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
    hihat:   [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    openHat: [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
  },
};

// ── WAV encoder (16-bit PCM) ──────────────────────────────────────────────────

function audioBufferToWav(buffer: AudioBuffer): ArrayBuffer {
  const numCh = buffer.numberOfChannels;
  const sr    = buffer.sampleRate;
  const len   = buffer.length * numCh * 2;
  const ab    = new ArrayBuffer(44 + len);
  const view  = new DataView(ab);
  const ws    = (off: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(off + i, s.charCodeAt(i));
  };
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

// ── Synth factory ─────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildSynths(Tone: any) {
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.08,
    octaves: 10,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 },
  }).toDestination();
  kick.volume.value = -2;

  const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.01 },
  }).toDestination();
  snare.volume.value = -6;

  const hihat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.03, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();
  hihat.volume.value = -22;

  const openHat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
    harmonicity: 5.1,
    modulationIndex: 32,
    resonance: 4000,
    octaves: 1.5,
  }).toDestination();
  openHat.volume.value = -20;

  const bass = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.8, release: 2.0 },
  }).toDestination();
  bass.volume.value = -6;

  const chordSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.2, decay: 0.5, sustain: 0.6, release: 2.0 },
  }).toDestination();
  chordSynth.volume.value = -16;

  const melodySynth = new Tone.Synth({
    oscillator: { type: "sine" },
    envelope: { attack: 0.02, decay: 0.2, sustain: 0.4, release: 0.8 },
  }).toDestination();
  melodySynth.volume.value = -12;

  return { kick, snare, hihat, openHat, bass, chordSynth, melodySynth };
}

// ── Sequencer grid (visual only — uses API data which mirrors DRUM_PATTERNS) ──

const ROW_LABELS = ["Kick", "Snare", "Hi-Hat", "Open"];
const ROW_COLORS = ["bg-violet-500", "bg-blue-500", "bg-cyan-400", "bg-teal-400"];

function SequencerGrid({ beat }: { beat: Beat }) {
  const rows = [beat.kick, beat.snare, beat.hihat, beat.openHat ?? Array(16).fill(0)];
  return (
    <div className="space-y-1.5 mt-4">
      {rows.map((row, ri) => (
        <div key={ri} className="flex items-center gap-2">
          <span className="text-[10px] text-white/40 w-10 text-right shrink-0">
            {ROW_LABELS[ri]}
          </span>
          <div className="flex gap-[3px] flex-1">
            {row.map((on, si) => (
              <div
                key={si}
                className={[
                  "flex-1 h-5 rounded-sm transition-colors",
                  on ? ROW_COLORS[ri] : "bg-white/10",
                  si === 4 || si === 8 || si === 12 ? "ml-1" : "",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Beat card ─────────────────────────────────────────────────────────────────

function BeatCard({
  beat, isPlaying, onPlay, onStop, onExport, exporting,
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

// ── Main component ────────────────────────────────────────────────────────────

export default function BeatProducerClient() {
  const [genre, setGenre]             = useState("");
  const [mood, setMood]               = useState("");
  const [tempo, setTempo]             = useState("");
  const [beats, setBeats]             = useState<Beat[]>([]);
  const [loading, setLoading]         = useState(false);
  const [playingId, setPlayingId]     = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [error, setError]             = useState("");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const synthsRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seqRef    = useRef<any>(null);

  // ── Stop all audio ────────────────────────────────────────────────────────
  const stopAll = () => {
    import("tone").then(({ getTransport }) => {
      try { getTransport().stop(); getTransport().cancel(); } catch { /* ignore */ }
    }).catch(() => {});
    if (seqRef.current) {
      try { seqRef.current.stop(); seqRef.current.dispose(); } catch { /* ignore */ }
      seqRef.current = null;
    }
    synthsRef.current.forEach(s => { try { s.dispose(); } catch { /* ignore */ } });
    synthsRef.current = [];
    setPlayingId(null);
  };

  useEffect(() => () => stopAll(), []);

  // ── Generate ──────────────────────────────────────────────────────────────
  const generate = async () => {
    setLoading(true);
    setError("");
    stopAll();
    setBeats([]);
    try {
      const axios = await GetAxiosWithAuth();
      const { data } = await axios.post<{ beats: Beat[] }>("beat/generate", { genre, mood, tempo });
      console.log("[BeatProducer] raw API response:", JSON.stringify(data, null, 2));
      setBeats(data.beats.slice(0, 2));
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (e instanceof Error ? e.message : "Generation failed");
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // ── Live playback ─────────────────────────────────────────────────────────
  const playBeat = async (beat: Beat) => {
    stopAll();
    const Tone = await import("tone");
    await Tone.start();

    Tone.getTransport().bpm.value = beat.bpm;

    const { kick, snare, hihat, openHat, bass, chordSynth, melodySynth } = buildSynths(Tone);
    synthsRef.current = [kick, snare, hihat, openHat, bass, chordSynth, melodySynth];

    // Use hardcoded drum patterns — never trust API drum arrays for audio
    const drums = DRUM_PATTERNS[beat.genre] || DRUM_PATTERNS.trap;

    // Bass notes in order (steps 0,4,8,12)
    const bassNotes  = beat.bass.map(n => n.note);
    const chordNotes = beat.chords.map(n => n.notes);
    const melNotes   = beat.melody.filter(n => n.step < 8).map(n => n.note); // 4 unique melody notes

    const seq = new Tone.Sequence(
      (time: number, step: number) => {
        // Drums: hardcoded patterns, rock solid timing
        if (drums.kick[step])     kick.triggerAttackRelease("C1", "8n", time);
        if (drums.snare[step])    snare.triggerAttackRelease("8n", time);
        if (drums.hihat[step])    hihat.triggerAttackRelease("C6", "32n", time);
        if (drums.openHat[step])  openHat.triggerAttackRelease("C6", "8n", time);

        // Bass + chords: one per beat (steps 0, 4, 8, 12)
        if (step % 4 === 0) {
          const ci = step / 4; // 0,1,2,3
          const bn = bassNotes[ci]  || "C2";
          const cn = chordNotes[ci] || ["C3","E3","G3"];
          bass.triggerAttackRelease(bn, "4n", time);
          chordSynth.triggerAttackRelease(cn, "1n", time);
        }

        // Melody: 4-note sequence, triggers every 2 steps (0,2,4,6 → repeat 8,10,12,14)
        if (step % 2 === 0) {
          const mi = (step / 2) % 4;
          const mn = melNotes[mi] || "C4";
          melodySynth.triggerAttackRelease(mn, "8n", time);
        }
      },
      [...Array(16).keys()],
      "16n"
    );

    seqRef.current = seq;
    seq.start(0);
    Tone.getTransport().start();
    setPlayingId(beat.id);
  };

  // ── WAV export via Tone.Offline ───────────────────────────────────────────
  const exportWav = async (beat: Beat) => {
    if (exportingId) return;
    setExportingId(beat.id);
    try {
      const Tone = await import("tone");

      const BARS     = 8;
      const stepSec  = 60 / beat.bpm / 4;  // duration of one 16th note
      const barSec   = stepSec * 16;
      const totalSec = BARS * barSec + 2;   // +2s for long release tails

      const toneBuffer = await Tone.Offline(async () => {
        const { kick, snare, hihat, openHat, bass, chordSynth, melodySynth } = buildSynths(Tone);

        const drums     = DRUM_PATTERNS[beat.genre] || DRUM_PATTERNS.trap;
        const bassNotes  = beat.bass.map(n => n.note);
        const chordNotes = beat.chords.map(n => n.notes);
        const melNotes   = beat.melody.filter(n => n.step < 8).map(n => n.note);

        for (let bar = 0; bar < BARS; bar++) {
          for (let s = 0; s < 16; s++) {
            const t = bar * barSec + s * stepSec;

            if (drums.kick[s])    kick.triggerAttackRelease("C1", "8n", t);
            if (drums.snare[s])   snare.triggerAttackRelease("8n", t);
            if (drums.hihat[s])   hihat.triggerAttackRelease("C6", "32n", t);
            if (drums.openHat[s]) openHat.triggerAttackRelease("C6", "8n", t);

            if (s % 4 === 0) {
              const ci = s / 4;
              bass.triggerAttackRelease(bassNotes[ci] || "C2", "4n", t);
              chordSynth.triggerAttackRelease(chordNotes[ci] || ["C3","E3","G3"], "1n", t);
            }

            if (s % 2 === 0) {
              const mi = (s / 2) % 4;
              melodySynth.triggerAttackRelease(melNotes[mi] || "C4", "8n", t);
            }
          }
        }
      }, totalSec);

      const audioBuffer = toneBuffer.get();
      if (!audioBuffer) throw new Error("Offline render produced no audio");

      const wav  = audioBufferToWav(audioBuffer);
      const blob = new Blob([wav], { type: "audio/wav" });
      const url  = URL.createObjectURL(blob);

      const safeName = beat.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `editdeck-${safeName}.wav`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (e) {
      console.error("[BeatProducer] WAV export failed:", e);
    } finally {
      setExportingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen px-4 py-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xl">
            🎛️
          </div>
          <h1 className="text-2xl font-bold">AI Beat Producer</h1>
        </div>
        <p className="text-muted-foreground text-sm">
          Describe the vibe and get two fully playable beats — melody, chords, and drums.
        </p>
      </div>

      <div className="rounded-2xl border bg-card p-5 mb-6 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Genre</label>
            <input
              value={genre}
              onChange={e => setGenre(e.target.value)}
              placeholder="e.g. Trap, R&B, Pop"
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

        {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>}
      </div>

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

      {beats.length === 0 && !loading && (
        <div className="text-center py-16 text-muted-foreground">
          <div className="text-5xl mb-4">🎚️</div>
          <p className="text-sm">Fill in your preferences above and hit Generate.</p>
          <p className="text-xs mt-1 opacity-60">All fields are optional — leave blank for a surprise.</p>
        </div>
      )}
    </div>
  );
}
