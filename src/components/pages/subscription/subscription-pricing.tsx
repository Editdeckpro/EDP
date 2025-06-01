"use client";
import { GetAxiosWithAuth } from "@/lib/axios-instance";
import { Layers2Icon, Layers3Icon, StickyNoteIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { billingPeriod } from ".";
import PricingCard, { PlanID, PricingCardProps } from "./pricing-card";
import SubscriptionHeader from "./subscription-header";
import { toast } from "sonner";
import { GetCurrentSubscriptionResponse } from "./types";

export default function SubscriptionPricing() {
  const [billingPeriod, setBillingPeriod] = useState<billingPeriod>("monthly");
  const [currentPlan, setCurrentPlan] = useState<{
    id: PlanID;
    interval: billingPeriod;
  }>({
    id: "FREE",
    interval: billingPeriod,
  });

  useEffect(() => {
    const fetchCurrentPlan = async () => {
      try {
        const axios = await GetAxiosWithAuth();
        const data = await axios.get<GetCurrentSubscriptionResponse>(
          "/subscription"
        );
        console.log(data);
        setCurrentPlan({
          id: data.data.planType as PlanID,
          interval: data.data.interval as billingPeriod,
        });
        setBillingPeriod(data.data.interval as billingPeriod);
      } catch (error) {
        toast.error("Error fetching current plan");
        console.info("Error fetching current plan", error);
      }
    };
    fetchCurrentPlan();
  }, []);

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
            isCurrentPlan={
              currentPlan.id === card.id &&
              currentPlan.interval === billingPeriod
            }
          />
        ))}
      </div>
    </>
  );
}

const pricingPlansDetails: Omit<
  PricingCardProps,
  "billingPeriod" | "isCurrentPlan"
>[] = [
  {
    id: "FREE",
    title: "Basic Plan",
    price: 0,
    price_annual: 0,
    features: [],
    color: "primary",
    icon: <StickyNoteIcon color="white" />,
  },
  {
    id: "STARTER",
    title: "Professional Plan",
    price: 27,
    price_annual: 219,
    features: [
      "50 image generations per month",
      "Standard resolution",
      "Basic support",
    ],
    color: "secondary",
    icon: <Layers2Icon color="white" />,
  },
  {
    id: "NEXT_LEVEL",
    title: "Advanced Plan",
    price: 67,
    price_annual: 539,
    features: [
      "Unlimited image generations",
      "High resolution output",
      "Advanced customization options",
    ],
    color: "blue",
    icon: <Layers3Icon color="white" />,
  },
];
