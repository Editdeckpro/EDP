"use client";

import { cn } from "@/lib/utils";
import { Plan, PlanInterval, getPrice } from "@/lib/plans";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  interval: PlanInterval;
  selected: boolean;
  onSelect: (planId: Plan["id"]) => void;
}

export function PlanCard({ plan, interval, selected, onSelect }: PlanCardProps) {
  const price = getPrice(plan, interval);
  const intervalLabel = interval === "yearly" ? "yr" : "mo";

  return (
    <button
      type="button"
      onClick={() => onSelect(plan.id)}
      aria-pressed={selected}
      className={cn(
        "relative flex h-full w-full flex-col rounded-2xl border p-6 text-left transition-all",
        selected
          ? "border-amber-500 bg-amber-500/5 ring-2 ring-amber-500/40"
          : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]"
      )}
    >
      {plan.isPopular ? (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-500 to-red-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow">
          Most Popular
        </span>
      ) : null}

      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-lg font-semibold">{plan.name}</h3>
        <span
          className={cn(
            "flex h-5 w-5 items-center justify-center rounded-full border",
            selected
              ? "border-amber-500 bg-amber-500"
              : "border-white/30 bg-transparent"
          )}
          aria-hidden="true"
        >
          {selected ? <Check className="h-3 w-3 text-[#0a0a0a]" strokeWidth={3} /> : null}
        </span>
      </div>

      <p className="mb-4 text-sm text-white/60">{plan.tagline}</p>

      <div className="mb-5">
        <span className="text-4xl font-bold tracking-tight">${price}</span>
        <span className="ml-1 text-sm text-white/60">/{intervalLabel}</span>
      </div>

      <ul className="space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-white/80">
            <Check
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                selected ? "text-amber-400" : "text-white/50"
              )}
              strokeWidth={2.5}
            />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}
