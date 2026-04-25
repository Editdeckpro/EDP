import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShieldCheck, Check, X, ChevronRight } from "lucide-react";

const withoutCards = [
  { time: "3w ago", body: "My last cover took 3 weeks. Release got pushed. Again 😡" },
  { time: "2w ago", body: "Hiring on Fiverr. 4 rounds of revisions. Still not right." },
  { time: "1w ago", body: "$200 for covers, $50 for Canva Pro, still hiring out 🤦" },
  { time: "Yesterday", body: "Dropped the single without finished artwork. Again." },
];

const withCards = [
  { time: "5 min", body: "Ready in 5 minutes. Uploaded to DSPs same day ✅" },
  { time: "Today", body: "Unlimited revisions. My vision, no middleman." },
  { time: "This month", body: "One subscription. Replaced 3 tools + the freelancer." },
  { time: "This quarter", body: "Dropped 4 singles this quarter. All on schedule 🚀" },
  { time: "Last quarter", body: "Dropped a song every week last quarter, all on schedule. Gained 11,000+ Instagram followers." },
];

const stats = [
  { value: "Minutes", label: "from idea to finished cover vs. weeks of revisions" },
  { value: "100%", label: "streaming-platform ready, formatted for every DSP" },
  { value: "1,000+", label: "covers delivered for artists, managers, and labels" },
  { value: "11", label: "live events validated the workflow" },
];

type Feature = {
  eyebrow: string;
  headline: string;
  body: string;
  bullets: string[];
  reverse: boolean;
  image?: { src: string; alt: string };
  aspectRatio?: "square" | "video";
  placeholder?: string;
  subtitle?: string;
  gradient?: string;
};

const features: Feature[] = [
  {
    eyebrow: "Cover Art Studio",
    headline: "Describe it. Get it. Done.",
    body: "Our tool turns a short prompt into a professional album cover in minutes. No mood boards, no freelance chaos, no waiting three weeks for revisions.",
    bullets: ["Prompt-based generation", "Unlimited revisions", "High-resolution output"],
    image: {
      src: "/marketing/all-in-cover.png",
      alt: "ALL IN by Ella — album cover generated with EditDeckPro",
    },
    subtitle: "Album art that actually sells streams",
    reverse: false,
  },
  {
    eyebrow: "Remix Wizard",
    headline: "Refresh old artwork. Instantly.",
    body: "Already have a cover but want a new version for a single, remix, or deluxe edition? Upload, tweak the style, ship it the same day.",
    bullets: ["Transform any existing cover", "Style variations on demand", "Batch-friendly for remix packs"],
    image: {
      src: "/marketing/remix-wizard-flow.png",
      alt: "Remix Wizard process: upload photo, AI generates variations, download finished album cover",
    },
    aspectRatio: "video",
    subtitle: "One upload. Infinite variations.",
    reverse: true,
  },
  {
    eyebrow: "Streaming-Ready Output",
    headline: "Formatted for every platform. Automatically.",
    body: "Every cover exports at the exact specs Spotify, Apple Music, YouTube Music, and SoundCloud require. No rejected uploads, no scrambling the night before a drop.",
    bullets: ["3000×3000 high-res masters", "DSP-compliant by default", "One click, every size"],
    image: {
      src: "/marketing/streaming-ready-flow.png",
      alt: "MIDNIGHT SIGNALS cover shown across Spotify, Apple Music, and TikTok — one cover, every platform",
    },
    aspectRatio: "video",
    subtitle: "Ready for every DSP, automatically.",
    reverse: false,
  },
];

const steps = [
  { title: "Describe", body: "Tell EditDeckPro what the cover should feel like. Genre, mood, style. In plain language." },
  { title: "Generate", body: "In under a minute, get multiple cover options to choose from." },
  { title: "Refine", body: "Revise, tweak, or regenerate until it matches your vision exactly." },
  { title: "Release", body: "Export streaming-ready files. Upload to every DSP the same day." },
];

const differentiators = [
  { title: "Fast", body: "Describe your cover. Get it in minutes. Not weeks of back-and-forth with freelancers." },
  { title: "Smart", body: "Trained on thousands of album covers so results actually look like industry-standard artwork. Not generic AI art." },
  { title: "Complete", body: "Cover art, remix variations, streaming exports. From idea to DSP upload in one tool instead of five." },
  { title: "Flexible", body: "Revise as much as you want. Adjust style, swap elements, generate variations. The system adapts to your vision." },
  { title: "Branded", body: "Keep a consistent visual identity across a whole release campaign or a label's entire roster." },
  { title: "Yours", body: "100% ownership. Full commercial rights. Download at full resolution. No watermarks, no catches." },
];

type Cell = "yes" | "no" | string;
const comparisonRows: { feature: string; cells: [Cell, Cell, Cell, Cell] }[] = [
  { feature: "AI-powered generation", cells: ["yes", "no", "no", "no"] },
  { feature: "Minutes to finished cover", cells: ["yes", "no", "no", "yes"] },
  { feature: "Unlimited revisions", cells: ["yes", "Paid per round", "yes", "no"] },
  { feature: "DSP-compliant specs", cells: ["yes", "Depends", "Manual", "no"] },
  { feature: "Full commercial rights", cells: ["yes", "yes", "yes", "Varies"] },
  { feature: "No designer experience needed", cells: ["yes", "n/a", "Manual", "yes"] },
  { feature: "Music-industry context", cells: ["yes", "yes", "no", "no"] },
  { feature: "Starting price", cells: ["$", "$$$", "$", "$"] },
];

const roadmap = [
  { title: "Lyric Videos", body: "Auto-synced lyric videos for every release, timed to your audio automatically.", tag: "COMING SOON" },
  { title: "Promo Graphics", body: "Instagram posts, press kits, and playlist banners generated from your cover in one click.", tag: "IN PLANNING" },
  { title: "Catalog Refresh", body: "Rework an entire back catalog with a unified visual identity in minutes.", tag: "IN PLANNING" },
];

const shipMore = [
  { title: "One-Click Exports", body: "Every cover, formatted for every platform, in one click. Spotify, Apple Music, TikTok, everywhere.", link: "See How" },
  { title: "Release Calendar Ready", body: "Stay on release schedule without design delays. Ship finished covers the same day a track is ready.", link: "Learn More" },
  { title: "Scale With Your Roster", body: "Generate covers at any volume. Single releases or full-catalog refreshes. No bottleneck.", link: "See Examples" },
];

const faqs = [
  {
    q: "Does it really take only minutes?",
    a: "Yes. Generating a cover takes under a minute. Most artists have their final cover ready in about 5 minutes, including quick text tweaks and color adjustments. The hard part, the design itself, is done in seconds instead of weeks.",
  },
  {
    q: "Will the covers look AI-generated?",
    a: "No. EditDeckPro is trained specifically on professional album artwork, so the output matches what you'd expect from a pro designer in your genre. Not generic AI art.",
  },
  {
    q: "How is this different from using ChatGPT or Midjourney?",
    a: "General AI tools don't understand album cover specs, DSP requirements, or music-industry context. EditDeckPro is purpose-built for releases: correct resolution, compliant formatting, and styles that actually fit the music industry.",
  },
  {
    q: "Can I edit the AI output?",
    a: "Absolutely. Revise as much as you want. Regenerate, adjust style, change elements. You stay in control.",
  },
  {
    q: "Do I own my covers?",
    a: "100%. Full commercial rights. Download at full resolution. Upload to DSPs, print them, merchandise them. They're yours.",
  },
  {
    q: "What if my genre is niche?",
    a: "The system adapts. It's been tested across hip-hop, R&B, indie, electronic, gospel, country, and more. If you can describe it, you can generate it.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. No contracts, no long-term commitments. Cancel anytime from your dashboard.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs uppercase tracking-[0.2em] text-amber-400 font-semibold mb-4">
      {children}
    </div>
  );
}

function DisplayHeading({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`[font-family:var(--font-display)] text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[0.95] ${className}`}
    >
      {children}
    </h2>
  );
}

function Cell({ value }: { value: Cell }) {
  if (value === "yes")
    return (
      <Check className="w-5 h-5 text-amber-400 mx-auto" strokeWidth={3} />
    );
  if (value === "no")
    return <X className="w-5 h-5 text-white/25 mx-auto" strokeWidth={2.5} />;
  return <span className="text-sm text-white/60">{value}</span>;
}

export default function HomePage() {
  return (
    <>
      {/* SECTION 1 — Announcement ribbon */}
      <a
        href="https://app.editdeckpro.com/signup"
        className="block bg-[#0a0a0a] border-b border-white/10 hover:bg-white/[0.04] transition-colors"
      >
        <div className="max-w-7xl mx-auto px-6 py-2.5 text-center text-xs sm:text-sm">
          <span className="text-amber-400 font-semibold">New:</span>{" "}
          <span className="text-white/80">
            Faster renders + new cover styles.
          </span>{" "}
          <span className="text-amber-400 inline-flex items-center gap-1">
            Try free <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </a>

      {/* SECTION 2 — Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.18),transparent_55%),radial-gradient(ellipse_at_bottom,rgba(239,68,68,0.12),transparent_55%)] pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 pt-24 pb-24 text-center">
          <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/70 border border-white/15 rounded-full px-4 py-1.5 mb-8">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Trusted by 1,000+ artists, managers &amp; labels
          </div>

          <h1 className="[font-family:var(--font-display)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.9] tracking-tight">
            Pro-Quality Album Covers
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">
              That Actually Sell Streams
            </span>
          </h1>

          <p className="mt-8 text-lg lg:text-xl text-white/90 max-w-2xl mx-auto">
            Get release-ready artwork in minutes. No designers. No revisions.
            No hiring. No ten-tool setup.
          </p>

          <div className="mt-10 flex justify-center">
            <a href="https://app.editdeckpro.com/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white border-0 font-semibold h-12 px-8 text-base"
              >
                Start Free Trial <ChevronRight className="w-4 h-4" />
              </Button>
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-white/60">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              3-Day Free Trial
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Cancel Anytime
            </span>
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Built by Artists
            </span>
          </div>

          <p className="mt-16 text-sm text-white/65">
            The choice of independent artists, producers, and labels
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/30 uppercase tracking-widest">
            <span>Spotify</span>
            <span>·</span>
            <span>Apple Music</span>
            <span>·</span>
            <span>SoundCloud</span>
            <span>·</span>
            <span>TikTok</span>
            <span>·</span>
            <span>Instagram</span>
          </div>
          <div className="mt-8 text-xs sm:text-sm text-white/65">
            1,000+ covers delivered <span className="text-white/20 mx-2">|</span> 11 live events{" "}
            <span className="text-white/20 mx-2">|</span> Minutes not days
          </div>
        </div>
      </section>

      {/* SECTION 3 — With / Without comparison */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <Eyebrow>The EditDeckPro Difference</Eyebrow>
            <DisplayHeading>With &amp; Without EditDeckPro</DisplayHeading>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-red-500/20 rounded-xl p-6 bg-[#0a0a0a]/60">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <h3 className="[font-family:var(--font-display)] text-xl tracking-wider text-red-400">
                  Without EditDeckPro
                </h3>
              </div>
              <div className="space-y-3">
                {withoutCards.map((c, i) => (
                  <div
                    key={i}
                    className="border border-red-500/10 rounded-lg p-4 bg-red-500/[0.03]"
                  >
                    <div className="text-xs text-red-400/60 mb-1">{c.time}</div>
                    <div className="text-sm text-white/80">{c.body}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-amber-500/20 rounded-xl p-6 bg-[#0a0a0a]/60">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-amber-400 to-red-500" />
                <h3 className="[font-family:var(--font-display)] text-xl tracking-wider bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">
                  With EditDeckPro
                </h3>
              </div>
              <div className="space-y-3">
                {withCards.map((c, i) => (
                  <div
                    key={i}
                    className="border border-amber-500/15 rounded-lg p-4 bg-amber-500/[0.03]"
                  >
                    <div className="text-xs text-amber-400/80 mb-1">{c.time}</div>
                    <div className="text-sm text-white/80">{c.body}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — Stats grid */}
      <section className="relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.06),transparent_50%)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Eyebrow>Why it works</Eyebrow>
            <DisplayHeading>Your next release has been waiting long enough.</DisplayHeading>
            <p className="mt-5 text-lg text-white/60">
              Create, customize, and publish. All in minutes.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <div
                key={i}
                className="border border-white/10 rounded-xl p-8 bg-white/[0.02] hover:border-white/20 transition-colors"
              >
                <div className="[font-family:var(--font-display)] text-6xl lg:text-7xl bg-gradient-to-br from-amber-400 to-red-500 bg-clip-text text-transparent leading-none">
                  {s.value}
                </div>
                <p className="mt-4 text-sm text-white/70">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — Features */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <Eyebrow>Features</Eyebrow>
            <div className="text-sm uppercase tracking-widest text-white/50 font-semibold mb-4">
              Everything you need. Built for releases.
            </div>
            <DisplayHeading>One platform for every cover you ship.</DisplayHeading>
            <p className="mt-5 text-lg text-white/60">
              Create album covers, remix existing art, and get streaming-ready
              files. All with a single tool.
            </p>
          </div>

          <div className="space-y-24">
            {features.map((f, i) => {
              const aspect = f.aspectRatio === "video" ? "aspect-video" : "aspect-square";
              return (
              <div
                key={i}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${
                  f.reverse ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {f.image ? (
                  <div className={`relative ${aspect} rounded-2xl ring-1 ring-white/10 shadow-2xl shadow-black/50 overflow-hidden`}>
                    <Image
                      src={f.image.src}
                      alt={f.image.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`aspect-square rounded-2xl bg-gradient-to-br ${f.gradient} ring-1 ring-white/10 shadow-2xl shadow-black/50 flex flex-col items-center justify-center px-6 text-center`}
                  >
                    <span className="[font-family:var(--font-display)] text-white/30 text-4xl lg:text-5xl tracking-widest">
                      {f.placeholder}
                    </span>
                    {f.subtitle && (
                      <span className="mt-3 text-white/20 text-sm">
                        {f.subtitle}
                      </span>
                    )}
                  </div>
                )}
                <div>
                  <Eyebrow>{f.eyebrow}</Eyebrow>
                  <DisplayHeading>{f.headline}</DisplayHeading>
                  <p className="mt-5 text-lg text-white/80">{f.body}</p>
                  <ul className="mt-6 space-y-3">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-3 text-white/80">
                        <Check
                          className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
                          strokeWidth={3}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 6 — How it works */}
      <section className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Eyebrow>How it works</Eyebrow>
            <DisplayHeading>From concept to cover, in three steps.</DisplayHeading>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div
                key={s.title}
                className="border border-white/10 rounded-xl p-6 bg-white/[0.02] hover:border-white/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg border border-white/15 bg-black/50 flex items-center justify-center text-amber-400 [font-family:var(--font-display)] tracking-wider">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="[font-family:var(--font-display)] text-2xl tracking-wider mt-5">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm text-white/75">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 7 — Audience tabs removed pending per-audience content */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <Eyebrow>Built for</Eyebrow>
            <div className="text-sm uppercase tracking-widest text-white/50 font-semibold mb-4">
              EditDeckPro for every release
            </div>
            <DisplayHeading>Built for how musicians actually work.</DisplayHeading>
          </div>

          <div className="max-w-4xl mx-auto border border-white/10 rounded-2xl p-8 lg:p-12 bg-[#0a0a0a]/60">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="text-sm uppercase tracking-widest text-white/70 font-semibold">
                Independent Artists
              </span>
            </div>
            <DisplayHeading>Stop waiting on designers.</DisplayHeading>
            <p className="mt-5 text-lg text-white/70">
              Package your sound. Ship the visual. Keep the momentum.
            </p>
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-3 text-white/80">
                <Check
                  className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
                  strokeWidth={3}
                />
                <span>Full rights to every cover you create.</span>
              </li>
              <li className="flex items-start gap-3 text-white/80">
                <Check
                  className="w-5 h-5 text-amber-400 mt-0.5 shrink-0"
                  strokeWidth={3}
                />
                <span>Your vision, on your schedule, at your pace.</span>
              </li>
            </ul>
            <div className="mt-8">
              <a href="https://app.editdeckpro.com/signup">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white border-0 font-semibold"
                >
                  Start Trial <ChevronRight className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8 — Differentiators */}
      <section className="relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(239,68,68,0.05),transparent_50%)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Eyebrow>The EditDeckPro Difference</Eyebrow>
            <div className="text-sm uppercase tracking-widest text-white/50 font-semibold mb-4">
              Why artists choose EditDeckPro?
            </div>
            <DisplayHeading>Stop making covers the hard way.</DisplayHeading>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {differentiators.map((d) => (
              <div
                key={d.title}
                className="border border-white/10 rounded-xl p-8 bg-white/[0.02] hover:border-white/20 transition-colors"
              >
                <h3 className="[font-family:var(--font-display)] text-3xl tracking-wider bg-gradient-to-br from-amber-400 to-red-500 bg-clip-text text-transparent">
                  {d.title}
                </h3>
                <p className="mt-3 text-white/70">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — Comparison table */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Eyebrow>How we compare</Eyebrow>
            <DisplayHeading>EditDeckPro vs. the alternatives.</DisplayHeading>
            <p className="mt-5 text-lg text-white/60">
              The fastest path to pro-quality cover art. Period.
            </p>
          </div>

          <div className="border border-white/10 rounded-xl bg-[#0a0a0a]/60 overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-sm text-white/50 font-normal p-4"></th>
                  <th className="text-center p-4">
                    <div className="[font-family:var(--font-display)] text-lg tracking-wider bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">
                      EditDeckPro
                    </div>
                  </th>
                  <th className="text-center text-sm text-white/70 font-semibold p-4">
                    Freelance Designers
                  </th>
                  <th className="text-center text-sm text-white/70 font-semibold p-4">
                    Canva / DIY
                  </th>
                  <th className="text-center text-sm text-white/70 font-semibold p-4">
                    Stock Sites
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i !== comparisonRows.length - 1 ? "border-b border-white/5" : ""}
                  >
                    <td className="text-sm text-white/80 p-4">{row.feature}</td>
                    {row.cells.map((c, j) => (
                      <td key={j} className="p-4 text-center">
                        <Cell value={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 10 — What's coming */}
      <section className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Eyebrow>What&apos;s coming</Eyebrow>
            <DisplayHeading>We&apos;re just getting started.</DisplayHeading>
            <p className="mt-5 text-lg text-white/60">
              The tools you need today. And the ones you&apos;ll want tomorrow.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {roadmap.map((r) => (
              <div
                key={r.title}
                className="border border-white/10 rounded-xl p-8 bg-white/[0.02] hover:border-white/20 transition-colors"
              >
                <span className="inline-block text-[10px] uppercase tracking-widest text-amber-400 font-semibold border border-amber-400/30 rounded-full px-2.5 py-0.5">
                  {r.tag}
                </span>
                <h3 className="[font-family:var(--font-display)] text-2xl tracking-wider mt-4">
                  {r.title}
                </h3>
                <p className="mt-3 text-sm text-white/75">{r.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 11 — Ship more */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <Eyebrow>Release faster</Eyebrow>
            <DisplayHeading>Ship more. Release more. Earn more.</DisplayHeading>
            <p className="mt-5 text-lg text-white/60">
              Built-in workflow. No extra tools. No extra fees.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shipMore.map((c) => (
              <div
                key={c.title}
                className="border border-white/10 rounded-xl p-8 bg-[#0a0a0a]/60 hover:border-white/20 transition-colors"
              >
                <h3 className="[font-family:var(--font-display)] text-2xl tracking-wider">
                  {c.title}
                </h3>
                <p className="mt-3 text-sm text-white/75">{c.body}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm text-amber-400 font-semibold">
                  {c.link} <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 12 — FAQ */}
      <section className="border-t border-white/10">
        <div className="max-w-3xl mx-auto px-6 py-24">
          <div className="text-center mb-12">
            <Eyebrow>FAQs</Eyebrow>
            <div className="text-sm uppercase tracking-widest text-white/50 font-semibold mb-4">
              Get answers
            </div>
            <DisplayHeading>Frequently Asked Questions</DisplayHeading>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                value={`item-${i}`}
                className="border-white/10"
              >
                <AccordionTrigger className="text-left text-white hover:text-amber-400 hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/70 leading-relaxed">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* SECTION 13 — Final CTA */}
      <section className="relative overflow-hidden border-t border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(239,68,68,0.25),transparent_60%)] pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-6 py-32 text-center">
          <DisplayHeading className="text-5xl sm:text-6xl lg:text-7xl">
            Your next release deserves better artwork.
          </DisplayHeading>
          <p className="mt-6 text-lg text-white/80 max-w-2xl mx-auto">
            Join the artists, producers, and labels shipping release-ready
            covers in minutes.
          </p>
          <div className="mt-10">
            <a href="https://app.editdeckpro.com/signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-red-500 hover:from-amber-400 hover:to-red-400 text-white border-0 font-semibold h-12 px-10 text-base"
              >
                Start Free Trial <ChevronRight className="w-4 h-4" />
              </Button>
            </a>
          </div>
          <p className="mt-5 text-xs text-white/65">
            3-day trial · Card required · Cancel anytime
          </p>
        </div>
      </section>
    </>
  );
}
