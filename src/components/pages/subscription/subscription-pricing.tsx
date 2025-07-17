"use client";
import { Layers2Icon, Layers3Icon, StickyNoteIcon } from "lucide-react";
import { useSession } from "next-auth/react";
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

      {/* Pricing Cards */}
      {/* <div className="flex items-center flex-wrap justify-center gap-6"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {pricingPlansDetails.map((card) => (
          <PricingCard
            {...card}
            key={card.title}
            billingPeriod={billingPeriod}
            isLoading={status != "authenticated"}
            isCurrentPlan={
              data?.user.subscription.planType === card.id && data?.user.subscription.interval === billingPeriod
            }
          />
        ))}
      </div>
    </>
  );
}

const pricingPlansDetails: Omit<PricingCardProps, "billingPeriod" | "isCurrentPlan" | "isLoading">[] = [
  {
    id: "STARTER",
    title: "Starter",
    description: "Ideal for Independent Artists",
    price: 27,
    price_annual: 219,
    features: [
      "Generate 5 covers per month",
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
    price: 67,
    price_annual: 539,
    features: [
      "Unlimited AI-powered cover designs",
      "Custom text tools for enhanced branding",
      "High-resolution outputs for pro-quality results",
      "Priority email support (24-hour response time)",
    ],
    color: "blue",
    icon: <Layers2Icon color="white" />,
  },
  {
    id: "PRO_STUDIO",
    title: "Pro Studio",
    description: "Designed for Businesses",
    price: 119,
    price_annual: 971,
    features: [
      "Add up to 5 team members for collaborative access",
      "Centralized dashboard to manage projects, users, and downloads",
      "Priority queue for cover generation (even faster processing)",
      "Team-based folders for organized content management",
      "Early access to beta features & experimental tools",
    ],
    color: "primary",
    icon: <Layers3Icon color="white" />,
  },
];
