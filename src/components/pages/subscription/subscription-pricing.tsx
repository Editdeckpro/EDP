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
      <SubscriptionHeader
        billingPeriod={billingPeriod}
        setPeriod={setBillingPeriod}
      />

      {/* Pricing Cards */}
      {/* <div className="flex items-center flex-wrap justify-center gap-6"> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {pricingPlansDetails.map((card) => (
          <PricingCard
            {...card}
            key={card.title}
            billingPeriod={billingPeriod}
            isLoading={status != "authenticated"}
            isCurrentPlan={
              data?.user.subscription.planType === card.id &&
              data?.user.subscription.interval === billingPeriod
            }
          />
        ))}
      </div>
    </>
  );
}

const pricingPlansDetails: Omit<
  PricingCardProps,
  "billingPeriod" | "isCurrentPlan" | "isLoading"
>[] = [
  {
    id: "STARTER",
    title: "Starter",
    price: 27,
    price_annual: 219,
    features: [
      "5 image generations per month",
      "Standard resolution",
      "Basic support",
    ],
    color: "secondary",
    icon: <StickyNoteIcon color="white" />,
  },
  {
    id: "NEXT_LEVEL",
    title: "Next level",
    price: 67,
    price_annual: 539,
    features: [
      "Unlimited image generations",
      "High resolution output",
      "Advanced customization options",
    ],
    color: "blue",
    icon: <Layers2Icon color="white" />,
  },
  {
    id: "PRO_STUDIO",
    title: "Pro Studio",
    price: 119,
    price_annual: 971,
    features: [
      "Unlimited HD Image Generations",
      "Priority Support & Account Manager",
      "Team Collaboration & User Management",
    ],
    color: "primary",
    icon: <Layers3Icon color="white" />,
  },
];
