import { Layers2Icon, Layers3Icon, StickyNoteIcon } from "lucide-react";
import PricingCard, { PricingCardProps } from "./pricing-card";
import SubscriptionHeader from "./subscription-header";
import { useState } from "react";
import { billingPeriod } from ".";

export default function SubscriptionPricing() {
  const [billingPeriod, setBillingPeriod] = useState<billingPeriod>("monthly");

  return (
    <>
      <SubscriptionHeader
        billingPeriod={billingPeriod}
        setPeriod={setBillingPeriod}
      />

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pricingPlansDetails.map((card) => (
          <PricingCard
            {...card}
            key={card.title}
            billingPeriod={billingPeriod}
          />
        ))}
      </div>
    </>
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
