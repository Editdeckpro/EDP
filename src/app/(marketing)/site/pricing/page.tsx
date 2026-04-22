"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Minus } from "lucide-react";

type Billing = "monthly" | "yearly";

const plans = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Ideal for independent artists taking their first steps",
    monthly: 27,
    yearly: 219,
    features: [
      "Generate 5 covers per month",
      "Standard-resolution outputs",
      "Basic customization tools",
      "Full ownership of downloaded designs",
      "Mobile access",
      "Dedicated email support",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    id: "next-level",
    name: "Next Level",
    tagline: "Designed for serious artists ready to grow",
    monthly: 67,
    yearly: 539,
    features: [
      "Unlimited AI-powered cover designs",
      "Custom text tools for enhanced branding",
      "High-resolution outputs",
      "Priority email support (24-hour response)",
      "Promotional tips + monthly strategy emails",
      "Premium fonts",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    id: "pro-studio",
    name: "Pro Studio",
    tagline: "Designed for businesses and teams",
    monthly: 119,
    yearly: 971,
    features: [
      "Everything in Next Level",
      "Up to 5 team members",
      "Centralized dashboard for projects & users",
      "Priority queue for cover generation",
      "Team-based folders",
      "Early access to beta features",
    ],
    cta: "Start Free Trial",
    popular: false,
  },
];

const compareRows: Array<{
  feature: string;
  starter: string | boolean;
  nextLevel: string | boolean;
  proStudio: string | boolean;
}> = [
  { feature: "AI cover designs",     starter: "5 / month",  nextLevel: "Unlimited",                     proStudio: "Unlimited" },
  { feature: "Output quality",       starter: "Standard",   nextLevel: "High-resolution",               proStudio: "High-resolution" },
  { feature: "Text customization",   starter: "Basic",      nextLevel: "Advanced (custom text tools)",  proStudio: "Advanced (custom text tools)" },
  { feature: "Design ownership",     starter: true,         nextLevel: true,                            proStudio: true },
  { feature: "Mobile access",        starter: true,         nextLevel: true,                            proStudio: true },
  { feature: "Support",              starter: "Dedicated email", nextLevel: "Priority email (48-hr)",  proStudio: "Priority email (24-hr)" },
  { feature: "Promotional tips + monthly strategy emails", starter: false, nextLevel: true, proStudio: true },
  { feature: "Premium fonts",        starter: false,        nextLevel: true,                            proStudio: true },
  { feature: "Team members",         starter: false,        nextLevel: false,                           proStudio: "Up to 5 users" },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<Billing>("yearly");

  return (
    <main className="relative min-h-screen bg-[#0a0a0a] text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.12),transparent_60%)]"
      />

      <section className="relative mx-auto max-w-7xl px-6 pt-20 pb-10 md:pt-28">
        <div className="text-center">
          <h1 className="[font-family:var(--font-display)] text-5xl tracking-wide md:text-7xl">
            Simple, transparent pricing
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Try EditDeckPro free for 3 days. Pick the plan that matches how fast you release.
            Cancel anytime — no credit card required to start.
          </p>
        </div>

        <div className="mt-10 flex items-center justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
            <button
              type="button"
              onClick={() => setBilling("monthly")}
              className={`relative rounded-full px-5 py-2 text-sm font-medium transition ${
                billing === "monthly"
                  ? "bg-white text-black"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling("yearly")}
              className={`relative rounded-full px-5 py-2 text-sm font-medium transition ${
                billing === "yearly"
                  ? "bg-gradient-to-r from-amber-500 to-red-500 text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              Yearly
              <span
                className={`ml-2 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  billing === "yearly"
                    ? "bg-white/20 text-white"
                    : "bg-amber-500/20 text-amber-300"
                }`}
              >
                Save ~32%
              </span>
            </button>
          </div>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => {
            const perMonth =
              billing === "yearly" ? (plan.yearly / 12).toFixed(0) : plan.monthly;
            const savings = plan.monthly * 12 - plan.yearly;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl border p-8 transition ${
                  plan.popular
                    ? "border-amber-500/40 bg-gradient-to-b from-amber-500/5 to-red-500/5 shadow-[0_0_60px_-15px_rgba(245,158,11,0.35)]"
                    : "border-white/10 bg-white/[0.03]"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-gradient-to-r from-amber-500 to-red-500 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="[font-family:var(--font-display)] text-3xl tracking-wide">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-white/65">{plan.tagline}</p>

                <div className="mt-6">
                  {billing === "yearly" ? (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold tracking-tight">
                          ${perMonth}
                        </span>
                        <span className="text-white/65">/mo</span>
                      </div>
                      <p className="mt-1 text-sm text-white/65">
                        Billed ${plan.yearly}/year · save ${savings}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold tracking-tight">
                          ${plan.monthly}
                        </span>
                        <span className="text-white/65">/mo</span>
                      </div>
                      <p className="mt-1 text-sm text-white/65">Billed monthly</p>
                    </>
                  )}
                </div>

                <Link
                  href={`/signup?plan=${plan.id}&billing=${billing}`}
                  className={`mt-6 block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                    plan.popular
                      ? "bg-gradient-to-r from-amber-500 to-red-500 text-white hover:brightness-110"
                      : "bg-white/10 text-white hover:bg-white/15"
                  }`}
                >
                  {plan.cta}
                </Link>

                <ul className="mt-8 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                      <span className="text-white/80">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <p className="mt-10 text-center text-sm text-white/65">
          3-day free trial · Cancel anytime · No credit card required to start
        </p>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-20">
        <h2 className="[font-family:var(--font-display)] text-center text-4xl tracking-wide md:text-5xl">
          Compare Plans
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-white/65">
          Every feature, side by side.
        </p>

        <div className="mt-10 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 font-medium text-white/65">Feature</th>
                <th className="px-6 py-4 font-semibold">Starter</th>
                <th className="px-6 py-4 font-semibold">
                  Next Level
                  <span className="ml-2 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                    Popular
                  </span>
                </th>
                <th className="px-6 py-4 font-semibold">Pro Studio</th>
              </tr>
            </thead>
            <tbody>
              {compareRows.map((row, i) => (
                <tr
                  key={row.feature}
                  className={i % 2 === 0 ? "bg-white/[0.015]" : ""}
                >
                  <td className="px-6 py-4 text-white/80">{row.feature}</td>
                  <Cell value={row.starter} />
                  <Cell value={row.nextLevel} />
                  <Cell value={row.proStudio} />
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="relative mx-auto max-w-4xl px-6 pb-24 text-center">
        <h2 className="[font-family:var(--font-display)] text-4xl tracking-wide md:text-5xl">
          Still have questions?
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-white/80">
          We&apos;re real humans in Cleveland, Ohio. Reach out and we&apos;ll get back fast.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-xl bg-gradient-to-r from-amber-500 to-red-500 px-6 py-3 text-sm font-semibold text-white hover:brightness-110"
          >
            Contact us
          </Link>
          <Link
            href="/faq"
            className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
          >
            Read the FAQ
          </Link>
        </div>
      </section>
    </main>
  );
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <td className="px-6 py-4">
        <Check className="h-4 w-4 text-amber-400" />
      </td>
    );
  }
  if (value === false) {
    return (
      <td className="px-6 py-4">
        <Minus className="h-4 w-4 text-white/25" />
      </td>
    );
  }
  return <td className="px-6 py-4 text-white/80">{value}</td>;
}
