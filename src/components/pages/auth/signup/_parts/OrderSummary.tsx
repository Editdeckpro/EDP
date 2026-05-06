"use client";

import { Plan, PlanInterval, getPrice, getIntervalLabel } from "@/lib/plans";

interface OrderSummaryProps {
  plan: Plan;
  interval: PlanInterval;
  promoCode?: string;
}

export function OrderSummary({ plan, interval, promoCode }: OrderSummaryProps) {
  const price = getPrice(plan, interval);
  const intervalLabel = getIntervalLabel(interval);
  const trimmedPromo = promoCode?.trim();

  return (
    <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 lg:sticky lg:top-24">
      <h2 className="mb-4 text-base font-semibold">Order summary</h2>

      <div className="mb-4 flex items-start justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <p className="font-medium">{plan.name}</p>
          <p className="text-sm text-white/60 capitalize">{interval} billing</p>
        </div>
        <p className="font-semibold">
          ${price}
          <span className="text-sm font-normal text-white/60">/{intervalLabel}</span>
        </p>
      </div>

      {trimmedPromo ? (
        <div className="mb-4 flex items-center justify-between gap-3 text-sm">
          <span className="text-white/60">Promo code</span>
          <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 font-mono text-xs text-amber-300">
            {trimmedPromo}
          </span>
        </div>
      ) : null}

      <div className="space-y-2 border-b border-white/10 pb-4 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-white/60">Subtotal</span>
          <span>${price}</span>
        </div>
        {trimmedPromo ? (
          <div className="flex items-center justify-between text-white/60">
            <span>Discount applied at payment</span>
            <span>—</span>
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-base font-semibold">Total due today</span>
        <span className="text-2xl font-bold">${price}</span>
      </div>
      <p className="mt-2 text-xs text-white/50">
        Then ${price}/{intervalLabel}. Cancel anytime.
      </p>
    </aside>
  );
}
