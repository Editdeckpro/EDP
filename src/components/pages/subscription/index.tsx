"use client";
import { Layers2Icon, Layers3Icon, StickyNoteIcon } from "lucide-react";
import { useState } from "react";
import PricingCard, { PricingCardProps } from "./pricing-card";
import SubscriptionHeader from "./subscription-header";
import SubscriptionHistory from "./subscription-history";

export type billingPeriod = "monthly" | "yearly";

export default function SubscriptionPage() {
  const [billingPeriod, setBillingPeriod] = useState<billingPeriod>("monthly");

  return (
    <section className="space-y-5">
      <SubscriptionHeader
        billingPeriod={billingPeriod}
        setPeriod={setBillingPeriod}
      />

      {/* Pricing Cards */}
      <div className="grid grid-cols-3 gap-6">
        {pricingPlansDetails.map((card) => (
          <PricingCard
            {...card}
            key={card.title}
            billingPeriod={billingPeriod}
          />
        ))}
      </div>

      <SubscriptionHistory />
    </section>
  );
}

const pricingPlansDetails: Omit<PricingCardProps, "billingPeriod">[] = [
  {
    title: "Basic Plan",
    price: 15,
    features: ["Lorem ipsum dolore ipsum", "Lorem ipsum", "Lorem dolore ipsum"],
    isCurrentPlan: true,
    color: "primary",
    icon: <StickyNoteIcon color="white" />,
  },
  {
    title: "Professional Plan",
    price: 15,
    features: ["Lorem ipsum dolore ipsum", "Lorem ipsum", "Lorem dolore ipsum"],
    color: "secondary",
    icon: <Layers2Icon color="white" />,
  },
  {
    title: "Advanced Plan",
    price: 15,
    features: ["Lorem ipsum dolore ipsum", "Lorem ipsum", "Lorem dolore ipsum"],
    color: "blue",
    icon: <Layers3Icon color="white" />,
  },
];
