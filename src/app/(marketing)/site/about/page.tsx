import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      {/* Subtle radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.12),transparent_60%)]"
      />

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-6 pt-20 pb-12 md:pt-28">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            Our Story
          </p>
          <h1 className="mt-4 font-[family-name:var(--font-display)] text-5xl tracking-wide md:text-7xl">
            Built by artists,{" "}
            <span className="bg-gradient-to-r from-amber-500 to-red-500 bg-clip-text text-transparent">
              for artists
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            EditDeckPro closes the budget gap between independent artists and
            the visuals their music deserves.
          </p>
        </div>
      </section>

      {/* Founder story */}
      <section className="relative mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-6 text-lg leading-relaxed text-white/80">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            Meet the founder
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-wide text-white md:text-5xl">
            20 years in the industry. On the road, in the studio, and behind the boards
          </h2>

          <p>
            I&apos;m <span className="font-semibold text-white">Tae</span>.
            Recording artist{" "}
            <span className="font-semibold text-white">Big KyLy</span>, producer,
            songwriter, engineer, and the founder of EditDeckPro. For over two
            decades I&apos;ve been in the music industry as a touring artist,
            producer, songwriter, and engineer, sharing stages and buses with{" "}
            <span className="font-semibold text-white">Snoop Dogg</span>,{" "}
            <span className="font-semibold text-white">Wiz Khalifa</span>, and{" "}
            <span className="font-semibold text-white">Machine Gun Kelly</span>.
          </p>

          <p>
            Along the way I met hundreds of unbelievably talented artists, in
            green rooms, studios, and sessions most people never see. Real
            voices. Real songs. Real stories worth hearing.
          </p>

          <p>
            And one thing kept showing up, over and over again: the talent
            wasn&apos;t the problem. The drive wasn&apos;t the problem. What
            was missing was <span className="text-white">budget</span>.
          </p>

          <p>
            Budget for album covers. Budget for production. Budget for
            promotional tools. Budget for the kind of creative direction that
            makes a release feel like an event instead of a post. The artists
            who broke through didn&apos;t always have more talent than the ones
            who didn&apos;t. They had more resources.
          </p>

          <p>
            EditDeckPro is my answer to that. A way to put pro-level visual
            tools in the hands of serious artists, independent labels, and
            managers who are already doing the work, and shouldn&apos;t have
            to spend thousands just to look the part.
          </p>
        </div>
      </section>

      {/* The gap / what we're building */}
      <section className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              The gap we saw
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-wide">
              Talent everywhere. Budget nowhere.
            </h3>
            <p className="mt-4 text-white/75 leading-relaxed">
              Great artists releasing great music. With covers that don&apos;t
              match the quality of the track. A $500 designer quote on a $50
              promo run. A release day spent fighting Canva instead of shipping
              the song. It&apos;s the wrong trade-off, and it&apos;s everywhere.
            </p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-red-500/5 p-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              What we&apos;re building
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-wide">
              Pro tools. Indie prices.
            </h3>
            <p className="mt-4 text-white/75 leading-relaxed">
              AI-powered covers, lyric videos, and release visuals that match
              what the music deserves. At a price that lets you keep shipping.
              Designed for the serious artist, the small label, and the manager
              doing it all.
            </p>
          </div>
        </div>
      </section>

      {/* Who we serve */}
      <section className="relative mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            Who we build for
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-4xl tracking-wide md:text-5xl">
            Serious artists. Indie labels. Managers doing it all.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-white/75 leading-relaxed">
            You&apos;re already doing the hard part. The writing, the recording,
            the promo. You don&apos;t need another tool that gets in your way.
            You need one that helps you ship.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h4 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
              Independent artists
            </h4>
            <p className="mt-3 text-white/75 leading-relaxed">
              Build a cohesive visual brand across every release without hiring
              out every cover. Drop singles weekly if that&apos;s your pace.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h4 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
              Independent labels
            </h4>
            <p className="mt-3 text-white/75 leading-relaxed">
              Scale creative output across your whole roster. Keep the budget
              focused on marketing spend, not design invoices.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h4 className="font-[family-name:var(--font-display)] text-2xl tracking-wide">
              Managers & teams
            </h4>
            <p className="mt-3 text-white/75 leading-relaxed">
              Handle covers, lyric videos, and promo visuals for multiple
              artists from one dashboard. Stop being the bottleneck.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="relative mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-wide md:text-5xl">
          Our mission
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
          Help thousands of serious artists, independent labels, and managers
          ship releases that look as good as they sound, and leave our stamp
          on the music industry doing it.
        </p>
      </section>

      {/* Built in Ohio */}
      <section className="relative mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
            Where we&apos;re built
          </p>
          <h3 className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-wide">
            Proudly made in Cleveland, Ohio
          </h3>
          <p className="mt-3 max-w-2xl text-white/75 leading-relaxed">
            Not Silicon Valley. Not a coastal agency. Built in the Midwest by
            people who&apos;ve written the songs, recorded the vocals, produced
            the tracks, and toured the buses, and who want to see more artists
            win.
          </p>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative mx-auto max-w-4xl px-6 pb-24 pt-8 text-center">
        <h2 className="font-[family-name:var(--font-display)] text-4xl tracking-wide md:text-5xl">
          Ready to release faster?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          Start your 3-day free trial. Card required · Charged on day 4 · Cancel anytime.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <a
            href="https://app.editdeckpro.com/signup"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            href="/pricing"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            See pricing
          </Link>
        </div>
      </section>
    </main>
  );
}
