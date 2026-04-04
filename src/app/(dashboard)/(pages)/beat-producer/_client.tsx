"use client";
import { useState, useRef, useEffect, useCallback } from "react";
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

interface Instruments {
  triggerKick:    (time: number) => void;
  triggerSnare:   (time: number) => void;
  triggerHihat:   (time: number) => void;
  triggerOpenHat: (time: number) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bass: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  chordSynth: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  melodySynth: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  limiter: any;
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

const SAMPLE_URLS = {
  kick:    "https://sampleswap.org/samples-ghost/DRUMS+%28FULL+KITS%29/808+DRUM+MACHINE/50%5Bkb%5D808-kick.wav.mp3",
  snare:   "https://sampleswap.org/samples-ghost/DRUMS+%28FULL+KITS%29/808+DRUM+MACHINE/11%5Bkb%5D808-snare.wav.mp3",
  hihat:   "https://sampleswap.org/samples-ghost/DRUMS+%28FULL+KITS%29/808+DRUM+MACHINE/3%5Bkb%5D808-hihat-closed.wav.mp3",
  openHat: "https://sampleswap.org/samples-ghost/DRUMS+%28FULL+KITS%29/808+DRUM+MACHINE/8%5Bkb%5D808-hihat-open.wav.mp3",
};

const ROW_LABELS = ["Kick", "Snare", "Hi-Hat", "Open"];
const ROW_COLORS = ["bg-violet-500", "bg-blue-500", "bg-cyan-400", "bg-teal-400"];

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

// ── Instrument loader — real 808 samples with synthetic fallback ──────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function loadInstruments(Tone: any, onStatus: (s: string) => void): Promise<Instruments> {
  onStatus("loading");

  const limiter = new Tone.Limiter(-3).toDestination();

  // Bass: sawtooth → lowpass 200 Hz → limiter
  const bassFilter = new Tone.Filter(200, "lowpass").connect(limiter);
  const bass = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.6, release: 1.0 },
  }).connect(bassFilter);
  bass.volume.value = -8;

  // Chords: PolySynth triangle → chorus → reverb → limiter
  const chordReverb = new Tone.Reverb({ decay: 2.0, wet: 0.3 }).connect(limiter);
  const chordChorus = new Tone.Chorus(4, 2.5, 0.5).connect(chordReverb);
  chordChorus.start();
  const chordSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.2, decay: 0.5, sustain: 0.6, release: 2.0 },
  }).connect(chordChorus);
  chordSynth.volume.value = -18;

  // Melody: triangle → chorus → reverb → limiter
  const melReverb = new Tone.Reverb({ decay: 1.5, wet: 0.25 }).connect(limiter);
  const melChorus = new Tone.Chorus(5, 2.0, 0.4).connect(melReverb);
  melChorus.start();
  const melodySynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.2, sustain: 0.4, release: 0.8 },
  }).connect(melChorus);
  melodySynth.volume.value = -14;

  // Drums: try real 808 samples, fall back to synthetic
  let triggerKick:    (time: number) => void;
  let triggerSnare:   (time: number) => void;
  let triggerHihat:   (time: number) => void;
  let triggerOpenHat: (time: number) => void;

  try {
    const kickFilter  = new Tone.Filter(200, "lowpass").connect(limiter);
    const snareReverb = new Tone.Reverb({ decay: 0.8, wet: 0.2 }).connect(limiter);

    const kickSampler    = new Tone.Sampler({ C1: SAMPLE_URLS.kick    }).connect(kickFilter);
    const snareSampler   = new Tone.Sampler({ C1: SAMPLE_URLS.snare   }).connect(snareReverb);
    const hihatSampler   = new Tone.Sampler({ C1: SAMPLE_URLS.hihat   }).connect(limiter);
    const openHatSampler = new Tone.Sampler({ C1: SAMPLE_URLS.openHat }).connect(limiter);

    kickSampler.volume.value    =  0;
    snareSampler.volume.value   = -2;
    hihatSampler.volume.value   = -10;
    openHatSampler.volume.value = -8;

    // Wait for samples (8s timeout)
    await Promise.race([
      Tone.loaded(),
      new Promise((_res, rej) => setTimeout(() => rej(new Error("Sample load timeout")), 8000)),
    ]);

    triggerKick    = (t) => kickSampler.triggerAttackRelease("C1", "8n", t);
    triggerSnare   = (t) => snareSampler.triggerAttackRelease("C1", "8n", t);
    triggerHihat   = (t) => hihatSampler.triggerAttackRelease("C1", "32n", t);
    triggerOpenHat = (t) => openHatSampler.triggerAttackRelease("C1", "8n", t);

    console.log("[BeatProducer] Real 808 samples loaded");
    onStatus("loaded");
  } catch (e) {
    console.warn("[BeatProducer] 808 samples unavailable, using synthetic drums:", e);

    // Synthetic drums
    const kickFilt = new Tone.Filter(200, "lowpass").connect(limiter);
    const kickSyn  = new Tone.MembraneSynth({
      pitchDecay: 0.08, octaves: 10,
      envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 },
    }).connect(kickFilt);
    kickSyn.volume.value = 0;

    const snareRev = new Tone.Reverb({ decay: 0.8, wet: 0.2 }).connect(limiter);
    const snareSyn = new Tone.NoiseSynth({
      noise: { type: "white" },
      envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.01 },
    }).connect(snareRev);
    snareSyn.volume.value = -4;

    const hihatSyn = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.03, release: 0.01 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
    }).connect(limiter);
    hihatSyn.volume.value = -20;

    const openHatSyn = new Tone.MetalSynth({
      envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
      harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
    }).connect(limiter);
    openHatSyn.volume.value = -18;

    triggerKick    = (t) => kickSyn.triggerAttackRelease("C1", "8n", t);
    triggerSnare   = (t) => snareSyn.triggerAttackRelease("8n", t);          // NoiseSynth: no note
    triggerHihat   = (t) => hihatSyn.triggerAttackRelease("C6", "32n", t);
    triggerOpenHat = (t) => openHatSyn.triggerAttackRelease("C6", "8n", t);

    onStatus("synth");
  }

  // Small pause for reverb impulse generation
  await new Promise(r => setTimeout(r, 300));

  return { triggerKick, triggerSnare, triggerHihat, triggerOpenHat, bass, chordSynth, melodySynth, limiter };
}

// ── Synthetic synths for WAV export (Tone.Offline compatible) ─────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildExportSynths(Tone: any) {
  const kick = new Tone.MembraneSynth({
    pitchDecay: 0.08, octaves: 10,
    envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.1 },
  }).toDestination();
  kick.volume.value = 0;

  const snare = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.01 },
  }).toDestination();
  snare.volume.value = -4;

  const hihat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.03, release: 0.01 },
    harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
  }).toDestination();
  hihat.volume.value = -20;

  const openHat = new Tone.MetalSynth({
    envelope: { attack: 0.001, decay: 0.3, release: 0.1 },
    harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5,
  }).toDestination();
  openHat.volume.value = -18;

  const bass = new Tone.Synth({
    oscillator: { type: "sawtooth" },
    envelope: { attack: 0.005, decay: 0.3, sustain: 0.6, release: 1.0 },
  }).toDestination();
  bass.volume.value = -8;

  const chordSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.2, decay: 0.5, sustain: 0.6, release: 2.0 },
  }).toDestination();
  chordSynth.volume.value = -18;

  const melodySynth = new Tone.Synth({
    oscillator: { type: "triangle" },
    envelope: { attack: 0.02, decay: 0.2, sustain: 0.4, release: 0.8 },
  }).toDestination();
  melodySynth.volume.value = -14;

  return { kick, snare, hihat, openHat, bass, chordSynth, melodySynth };
}

// ── SequencerGrid ─────────────────────────────────────────────────────────────

function SequencerGrid({ beat, activeStep }: { beat: Beat; activeStep: number }) {
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
                  "flex-1 h-5 rounded-sm transition-all duration-75",
                  si === 4 || si === 8 || si === 12 ? "ml-1" : "",
                  si === activeStep
                    ? on
                      ? `${ROW_COLORS[ri]} brightness-150`
                      : "bg-white/25"
                    : on
                      ? ROW_COLORS[ri]
                      : "bg-white/10",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── AnimatedBars (EQ visualizer) ──────────────────────────────────────────────

function AnimatedBars() {
  return (
    <div className="flex items-end gap-[2px] h-5">
      {[3, 6, 4, 8, 5, 7, 4, 6].map((h, i) => (
        <div
          key={i}
          className="w-[3px] rounded-sm bg-violet-400"
          style={{
            height: `${h * 2}px`,
            animation: `barPulse 0.${4 + (i % 4)}s ease-in-out infinite alternate`,
            animationDelay: `${i * 70}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ── BeatCard ──────────────────────────────────────────────────────────────────

function BeatCard({
  beat, isPlaying, activeStep, beat1Flash, samplesStatus,
  onPlay, onStop, onExport, exporting,
}: {
  beat: Beat;
  isPlaying: boolean;
  activeStep: number;
  beat1Flash: boolean;
  samplesStatus: string;
  onPlay: () => void;
  onStop: () => void;
  onExport: () => void;
  exporting: boolean;
}) {
  return (
    <div
      className={[
        "rounded-2xl border p-5 flex flex-col gap-3 transition-all duration-150",
        "border-white/10 bg-white/5 backdrop-blur-sm",
        beat1Flash ? "ring-1 ring-violet-400/50 shadow-[0_0_20px_0_rgba(139,92,246,0.15)]" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-lg leading-tight truncate">{beat.name}</h3>
          <p className="text-white/50 text-sm mt-0.5 line-clamp-2">{beat.description}</p>
        </div>
        {isPlaying && (
          <div className="shrink-0 mt-1">
            <AnimatedBars />
          </div>
        )}
      </div>

      <div className="flex gap-2 text-xs flex-wrap">
        <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300">{beat.bpm} BPM</span>
        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">{beat.key}</span>
        <span className="px-2 py-0.5 rounded-full bg-white/10 text-white/50">{beat.timeSignature}</span>
        {samplesStatus === "loaded" && (
          <span className="px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 text-[10px]">
            808 samples
          </span>
        )}
      </div>

      <SequencerGrid beat={beat} activeStep={isPlaying ? activeStep : -1} />

      <div className="flex gap-2 mt-1">
        <button
          onClick={isPlaying ? onStop : onPlay}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
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
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white/70 hover:text-white text-sm font-semibold transition-colors disabled:opacity-50"
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
  const [genre, setGenre]       = useState("");
  const [mood, setMood]         = useState("");
  const [tempo, setTempo]       = useState("");
  const [beats, setBeats]       = useState<Beat[]>([]);
  const [loading, setLoading]   = useState(false);
  const [playingId, setPlayingId]     = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [error, setError]       = useState("");
  const [activeStep, setActiveStep]   = useState(-1);
  const [beat1Flash, setBeat1Flash]   = useState(false);
  const [samplesStatus, setSamplesStatus] = useState<"idle" | "loading" | "loaded" | "synth">("idle");

  const instrRef    = useRef<Instruments | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const seqRef      = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const loadPromRef = useRef<Promise<Instruments> | null>(null);

  // ── Stop all audio ────────────────────────────────────────────────────────
  const stopAll = useCallback(() => {
    import("tone").then(({ getTransport }) => {
      try { getTransport().stop(); getTransport().cancel(); } catch { /* ignore */ }
    }).catch(() => {});
    if (seqRef.current) {
      try { seqRef.current.stop(); seqRef.current.dispose(); } catch { /* ignore */ }
      seqRef.current = null;
    }
    setPlayingId(null);
    setActiveStep(-1);
  }, []);

  useEffect(() => () => {
    stopAll();
    if (instrRef.current) {
      const { bass, chordSynth, melodySynth, limiter } = instrRef.current;
      [bass, chordSynth, melodySynth, limiter].forEach(n => { try { n?.dispose(); } catch { /* ignore */ } });
      instrRef.current = null;
    }
  }, [stopAll]);

  // ── Get or load instruments (loads once, reused across beats) ─────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getOrLoadInstruments = async (Tone: any): Promise<Instruments> => {
    if (instrRef.current) return instrRef.current;
    if (loadPromRef.current) return loadPromRef.current;

    const p = loadInstruments(Tone, (s) => setSamplesStatus(s as "idle" | "loading" | "loaded" | "synth"));
    loadPromRef.current = p;
    const instrs = await p;
    instrRef.current = instrs;
    loadPromRef.current = null;
    return instrs;
  };

  // ── Generate ──────────────────────────────────────────────────────────────
  const generate = async () => {
    setLoading(true);
    setError("");
    stopAll();
    setBeats([]);
    try {
      const axios = await GetAxiosWithAuth();
      const { data } = await axios.post<{ beats: Beat[] }>("beat/generate", { genre, mood, tempo });
      console.log("[BeatProducer] API response:", JSON.stringify(data, null, 2));
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

    const instrs = await getOrLoadInstruments(Tone);
    const { triggerKick, triggerSnare, triggerHihat, triggerOpenHat, bass, chordSynth, melodySynth } = instrs;

    Tone.getTransport().bpm.value = beat.bpm;

    const drums     = DRUM_PATTERNS[beat.genre] || DRUM_PATTERNS.trap;
    const bassNotes  = beat.bass.map((n: NoteEvent) => n.note);
    const chordNotes = beat.chords.map((n: ChordEvent) => n.notes);
    const melNotes   = beat.melody.filter((n: NoteEvent) => n.step < 8).map((n: NoteEvent) => n.note);

    const seq = new Tone.Sequence(
      (time: number, step: number) => {
        if (drums.kick[step])    triggerKick(time);
        if (drums.snare[step])   triggerSnare(time);
        if (drums.hihat[step])   triggerHihat(time);
        if (drums.openHat[step]) triggerOpenHat(time);

        if (step % 4 === 0) {
          const ci = step / 4;
          bass.triggerAttackRelease(bassNotes[ci] || "C2", "4n", time);
          chordSynth.triggerAttackRelease(chordNotes[ci] || ["C3","E3","G3"], "1n", time);
        }

        if (step % 2 === 0) {
          const mi = (step / 2) % 4;
          melodySynth.triggerAttackRelease(melNotes[mi] || "C4", "8n", time);
        }

        // Sync UI to audio clock
        Tone.getDraw().schedule(() => {
          setActiveStep(step);
          if (step === 0) {
            setBeat1Flash(true);
            setTimeout(() => setBeat1Flash(false), 80);
          }
        }, time);
      },
      [...Array(16).keys()],
      "16n"
    );

    seqRef.current = seq;
    seq.start(0);
    Tone.getTransport().start();
    setPlayingId(beat.id);
  };

  // ── WAV export via Tone.Offline (synthetic synths — Offline context safe) ─
  const exportWav = async (beat: Beat) => {
    if (exportingId) return;
    setExportingId(beat.id);
    try {
      const Tone = await import("tone");

      const BARS     = 8;
      const stepSec  = 60 / beat.bpm / 4;
      const barSec   = stepSec * 16;
      const totalSec = BARS * barSec + 2;

      const toneBuffer = await Tone.Offline(async () => {
        const { kick, snare, hihat, openHat, bass, chordSynth, melodySynth } = buildExportSynths(Tone);

        const drums     = DRUM_PATTERNS[beat.genre] || DRUM_PATTERNS.trap;
        const bassNotes  = beat.bass.map((n: NoteEvent) => n.note);
        const chordNotes = beat.chords.map((n: ChordEvent) => n.notes);
        const melNotes   = beat.melody.filter((n: NoteEvent) => n.step < 8).map((n: NoteEvent) => n.note);

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
      const safe = beat.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const a    = document.createElement("a");
      a.style.display = "none";
      a.href     = url;
      a.download = `editdeck-${safe}.wav`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
    } catch (e) {
      console.error("[BeatProducer] WAV export failed:", e);
    } finally {
      setExportingId(null);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen px-4 py-8 max-w-3xl mx-auto"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #130a1f 50%, #0a0a1a 100%)" }}
    >
      {/* Keyframes for animated EQ bars */}
      <style>{`
        @keyframes barPulse {
          from { transform: scaleY(0.3); opacity: 0.5; }
          to   { transform: scaleY(1);   opacity: 1;   }
        }
      `}</style>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center text-xl">
            🎛️
          </div>
          <h1 className="text-2xl font-bold text-white">AI Beat Producer</h1>
        </div>
        <p className="text-white/50 text-sm">
          Describe the vibe and get two fully playable beats — melody, chords, and drums.
        </p>
      </div>

      {/* Sample loading banner */}
      {samplesStatus === "loading" && (
        <div className="mb-4 flex items-center gap-2 text-sm text-violet-300 bg-violet-500/10 border border-violet-500/20 rounded-xl px-4 py-2.5">
          <svg className="w-4 h-4 animate-spin shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Loading 808 sounds...
        </div>
      )}

      {/* Controls */}
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-5 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Genre</label>
            <input
              value={genre}
              onChange={e => setGenre(e.target.value)}
              placeholder="e.g. Trap, R&B, Pop"
              className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Mood</label>
            <input
              value={mood}
              onChange={e => setMood(e.target.value)}
              placeholder="e.g. Dark, Uplifting, Chill"
              className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1">Tempo</label>
            <input
              value={tempo}
              onChange={e => setTempo(e.target.value)}
              placeholder="e.g. Fast, Slow, 140 BPM"
              className="w-full rounded-lg border border-white/10 bg-white/5 text-white placeholder-white/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
          </div>
        </div>

        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
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
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
              Compose 2 Beats
            </>
          )}
        </button>

        {error && <p className="mt-3 text-sm text-red-400 text-center">{error}</p>}
      </div>

      {/* Beat cards */}
      {beats.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-white/30 text-center">
            Click Play to hear your beat · Export as WAV to use in your DAW
          </p>
          {beats.map(beat => (
            <BeatCard
              key={beat.id}
              beat={beat}
              isPlaying={playingId === beat.id}
              activeStep={activeStep}
              beat1Flash={beat1Flash && playingId === beat.id}
              samplesStatus={samplesStatus}
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
        <div className="text-center py-16 text-white/30">
          <div className="text-5xl mb-4">🎚️</div>
          <p className="text-sm">Fill in your preferences above and hit Compose.</p>
          <p className="text-xs mt-1 opacity-60">All fields are optional — leave blank for a surprise.</p>
        </div>
      )}
    </div>
  );
}
