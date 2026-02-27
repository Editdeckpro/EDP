"use client";
import { Layers2Icon, Layers3Icon, StickyNoteIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useState } from "react";
import { billingPeriod } from ".";
import PricingCard, { PricingCardProps } from "./pricing-card";
import SubscriptionHeader from "./subscription-header";

export default function SubscriptionPricing() {
  const { data, status } = useSession();

  const [billingPeriod, setBillingPeriod] = useState<billingPeriod>("monthly");
  // const [currentPlan, setCurrentPlan] = useState<{
  //   id: PlanID;
  //   interval: billingPeriod;
  // }>({
  //   id: "FREE",
  //   interval: billingPeriod,
  // });

  // const fetchCurrentPlan = useCallback(async () => {
  //   try {
  //     const axios = await GetAxiosWithAuth();
  //     const data = await axios.get<GetCurrentSubscriptionResponse>(
  //       "/subscription"
  //     );
  //     setCurrentPlan({
  //       id: data.data.planType as PlanID,
  //       interval: data.data.interval as billingPeriod,
  //     });
  //     setBillingPeriod(data.data.interval as billingPeriod);
  //   } catch (error) {
  //     toast.error("Error fetching current plan");
  //     console.info("Error fetching current plan", error);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchCurrentPlan();
  // }, [fetchCurrentPlan]);

  return (
    <>
      <SubscriptionHeader billingPeriod={billingPeriod} setPeriod={setBillingPeriod} />

      {/* Plan generations summary */}
      <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4 mb-6">
        <h3 className="font-semibold text-sm text-gray-700 mb-3">Generations per plan (per month)</h3>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6a6c7b]">
          <span><strong className="text-foreground">Starter:</strong> 5 generations</span>
          <span><strong className="text-foreground">Next Level:</strong> 25 generations</span>
          <span><strong className="text-foreground">Pro Studio:</strong> Unlimited</span>
        </div>
        <p className="text-xs text-[#6a6c7b] mt-2">Each image generation or final lyric video export counts as 1 generation.</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pricingPlansDetails.map((card) => (
          <PricingCard
            {...card}
            key={card.title}
            billingPeriod={billingPeriod}
            currentPlanId={data?.user?.subscription?.planType || "FREE"}
            isLoading={status != "authenticated"}
            isCurrentPlan={
              data?.user?.subscription?.planType === card.id && data?.user?.subscription?.interval === billingPeriod
            }
          />
        ))}
      </div>
    </>
  );
}

export type PlanActionType = "PURCHASE" | "UPGRADE" | "DOWNGRADE" | "SAME_PLAN";

export const tierPriority = {
  FREE: 0,
  STARTER: 1,
  NEXT_LEVEL: 2,
  PRO_STUDIO: 3,
} as const;

export type PlanID = keyof typeof tierPriority;

/** Image generations per month per plan (matches backend generationLimitUtils). */
export const PLAN_GENERATIONS: Record<PlanID, number | null> = {
  FREE: 0,
  STARTER: 5,
  NEXT_LEVEL: 25,
  PRO_STUDIO: null, // unlimited
};

export function getPlanGenerationsLabel(planId: PlanID): string {
  const n = PLAN_GENERATIONS[planId];
  if (n === null) return "Unlimited generations per month";
  if (n === 0) return "No generations (upgrade to a plan)";
  return `${n} generations per month`;
}

export const messageMap = {
  upgrade: {
    title: "Ready to Upgrade?",
    description:
      "You're about to upgrade your current plan for more powerful features and higher limits. Proceed with the upgrade?",
    action: "Confirm, Upgrade",
  },
  downgrade: {
    title: "Confirm Downgrade",
    description: "Downgrading your plan may remove access to certain features. Are you sure you want to continue?",
    action: "Confirm, Downgrade",
  },
  purchase: {
    title: "Confirm Plan Purchase",
    description: "You're about to purchase this subscription plan. Please confirm to proceed with payment.",
    action: "Confirm, Purchase",
  },
};

export const getPlanActionType = (currentPlan: PlanID | null, newPlan: PlanID): keyof typeof messageMap => {
  if (!currentPlan || currentPlan === "FREE") {
    return newPlan === "FREE" ? "purchase" : "purchase";
  }

  if (tierPriority[newPlan] > tierPriority[currentPlan]) return "upgrade";
  if (tierPriority[newPlan] < tierPriority[currentPlan]) return "downgrade";
  return "purchase";
};

export const pricingPlansDetails: Omit<PricingCardProps, "billingPeriod" | "isCurrentPlan" | "isLoading">[] = [
  {
    id: "STARTER",
    title: "Starter",
    description: "Ideal for Independent Artists",
    badge: "Most Popular",
    price: 27,
    price_annual: 219,
    features: [
      "5 image generations per month",
      "Standard-resolution outputs",
      "Access to basic customization tools",
      "Full ownership of downloaded designs",
      "Mobile access for convenience",
      "Dedicated email support",
    ],
    color: "secondary",
    icon: <StickyNoteIcon color="white" />,
  },
  {
    id: "NEXT_LEVEL",
    title: "Next Level",
    description: "Designed for Serious Artists Ready to Grow",
    badge: "Supercharged from Starter",
    price: 67,
    price_annual: 539,
    features: [
      "25 image generations per month",
      "Custom text tools for enhanced branding",
      "High-resolution outputs for pro-quality results",
      "Lyric video feature (up to 20 seconds)",
      "Priority email support (24-hour response time)",
    ],
    color: "blue",
    icon: <Layers2Icon color="white" />,
  },
  {
    id: "PRO_STUDIO",
    title: "Pro Studio",
    description: "Designed for Businesses",
    badge: "Level Up from Next Level",
    price: 119,
    price_annual: 971,
    features: [
      "Unlimited image generations per month",
      "Add up to 5 team members for collaborative access",
      "Centralized dashboard to manage projects, users, and downloads",
      "Lyric video feature (up to 5 minutes)",
      "Priority queue & early access to beta features",
    ],
    color: "primary",
    icon: <Layers3Icon color="white" />,
  },
];
