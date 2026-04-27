export type PlanId = "STARTER" | "NEXT_LEVEL" | "PRO_STUDIO";
export type PlanInterval = "monthly" | "yearly";

export interface Plan {
  id: PlanId;
  slug: string;
  name: string;
  tagline: string;
  isPopular?: boolean;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "STARTER",
    slug: "starter",
    name: "Starter",
    tagline: "Ideal for independent artists taking their first steps",
    monthlyPrice: 27,
    yearlyPrice: 219,
    features: [
      "Generate 5 covers per month",
      "Standard-resolution outputs",
      "Basic customization tools",
      "Full ownership of downloaded designs",
      "Mobile access",
      "Dedicated email support",
    ],
  },
  {
    id: "NEXT_LEVEL",
    slug: "next-level",
    name: "Next Level",
    tagline: "Designed for serious artists ready to grow",
    isPopular: true,
    monthlyPrice: 67,
    yearlyPrice: 539,
    features: [
      "Unlimited AI-powered cover designs",
      "Custom text tools for enhanced branding",
      "High-resolution outputs",
      "Priority email support (24-hour response)",
      "Promotional tips + monthly strategy emails",
      "Premium fonts",
    ],
  },
  {
    id: "PRO_STUDIO",
    slug: "pro-studio",
    name: "Pro Studio",
    tagline: "Designed for businesses and teams",
    monthlyPrice: 119,
    yearlyPrice: 971,
    features: [
      "Everything in Next Level",
      "Up to 5 team members",
      "Centralized dashboard for projects & users",
      "Priority queue for cover generation",
      "Team-based folders",
      "Early access to beta features",
    ],
  },
];

export function getPlan(id: PlanId): Plan {
  const plan = PLANS.find((p) => p.id === id);
  if (!plan) throw new Error(`Unknown plan id: ${id}`);
  return plan;
}

export function getPrice(plan: Plan, interval: PlanInterval): number {
  return interval === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
}

export function getIntervalLabel(interval: PlanInterval): string {
  return interval === "yearly" ? "year" : "month";
}

export function getYearlySavingsPercent(plan: Plan): number {
  const annualIfMonthly = plan.monthlyPrice * 12;
  if (annualIfMonthly === 0) return 0;
  const saved = annualIfMonthly - plan.yearlyPrice;
  return Math.round((saved / annualIfMonthly) * 100);
}
