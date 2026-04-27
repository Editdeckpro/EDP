"use client";

import { cn } from "@/lib/utils";
import { PlanInterval } from "@/lib/plans";

interface BillingToggleProps {
  value: PlanInterval;
  onChange: (interval: PlanInterval) => void;
  yearlySavingsPercent?: number;
}

export function BillingToggle({ value, onChange, yearlySavingsPercent }: BillingToggleProps) {
  return (
    <div className="inline-flex items-center rounded-full border border-white/15 bg-white/5 p-1">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={cn(
          "rounded-full px-5 py-2 text-sm font-medium transition-colors",
          value === "monthly"
            ? "bg-white text-[#0a0a0a]"
            : "text-white/70 hover:text-white"
        )}
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("yearly")}
        className={cn(
          "rounded-full px-5 py-2 text-sm font-medium transition-colors flex items-center gap-2",
          value === "yearly"
            ? "bg-white text-[#0a0a0a]"
            : "text-white/70 hover:text-white"
        )}
      >
        Yearly
        {yearlySavingsPercent && yearlySavingsPercent > 0 ? (
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              value === "yearly"
                ? "bg-[#0a0a0a] text-white"
                : "bg-amber-500/20 text-amber-300"
            )}
          >
            Save {yearlySavingsPercent}%
          </span>
        ) : null}
      </button>
    </div>
  );
}
