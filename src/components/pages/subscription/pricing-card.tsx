"use client";
import GIcon from "@/components/g-icon";
import { Button } from "@/components/ui/button";
import React, { FC } from "react";
import { billingPeriod } from ".";
import { cn } from "@/lib/utils";
import { GetAxiosWithAuth } from "@/lib/axios-instance";
import { useRouter } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";
import { toast } from "sonner";
import {
  CancelSubscriptionResponse,
  CreateCheckoutSessionResponse,
} from "./types";
import { AxiosError } from "axios";

export type PlanID = "FREE" | "STARTER" | "NEXT_LEVEL";
export interface PricingCardProps {
  id: PlanID;
  title: string;
  price: number;
  billingPeriod: billingPeriod;
  features: string[];
  isCurrentPlan?: boolean;
  color: "primary" | "secondary" | "blue";
  icon: React.ReactNode;
}

const PricingCard: FC<PricingCardProps> = ({
  id,
  billingPeriod,
  features,
  price,
  title,
  isCurrentPlan,
  icon: Icon,
  color,
}) => {
  const yearlyPrice = price * 12;

  const cardBg =
    color === "primary"
      ? "bg-primary"
      : color === "secondary"
      ? "bg-secondary"
      : "bg-accent";

  const router = useRouter();
  const topLoader = useTopLoader();
  const [loading, setLoading] = React.useState(false);

  async function upgradePlan() {
    topLoader.start();
    setLoading(true);
    try {
      const axios = await GetAxiosWithAuth();
      const res = await axios.post<CreateCheckoutSessionResponse>(
        "subscription/create-checkout-session",
        {
          planType: id,
          interval: billingPeriod,
        }
      );

      if (res.data.type === "URL" || res.data.type === "UPGRADE") {
        router.push(res.data.url);
        toast.success("Redirecting to checkout page");
      } else {
        toast.success(res.data.message, {
          description: `You are downgrading from ${res.data.downgradeDetails.fromPlan} to ${res.data.downgradeDetails.toPlan}. Effective from ${res.data.downgradeDetails.effectiveDate}.`,
        });
        setLoading(false);
        topLoader.done();
      }
      router.refresh();
    } catch (e) {
      const error = e as AxiosError<{ error?: string }>;
      toast.error(error.response?.data.error || "Error changing plan");
      // // console.info("Error upgrading plan", error);
      setLoading(false);
      topLoader.done();
    }
  }

  async function cancelPlan() {
    topLoader.start();
    setLoading(true);

    try {
      const axios = await GetAxiosWithAuth();
      const res = await axios.post<CancelSubscriptionResponse>(
        "subscription/cancel"
      );

      toast.success("Plan Canceled successfully!", {
        description: res.data.message,
      });
      setLoading(false);
      topLoader.done();
      router.refresh();
    } catch (e) {
      const error = e as AxiosError<{ error?: string }>;
      toast.error(error.response?.data.error || "Error canceling plan");
      // // console.info("Error canceling plan", error);
      setLoading(false);
      topLoader.done();
    }
  }

  return (
    <div className="bg-white rounded-xl p-3 border border-[#dedede] flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-gray-200/50">
          <div
            className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              cardBg
            )}
          >
            {/* <StickyNoteIcon color="white" /> */}
            {Icon}
          </div>
          <span className="font-semibold text-lg">{title}</span>
        </div>

        <div className="mb-6">
          <span className="text-4xl font-bold">
            ${billingPeriod === "monthly" ? price : yearlyPrice}
          </span>
          <span className="text-[#6a6c7b]">
            /{billingPeriod === "monthly" ? "Month" : "Year"}
          </span>
        </div>
      </div>

      {features.length > 0 && (
        <div className="mb-8">
          <h4 className="font-semibold mb-4">Features Included:</h4>
          <ul className="space-y-3">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-[#6a6c7b]"
              >
                <GIcon name="send" className={"text-primary"} size={20} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

      {id !== "FREE" &&
        (isCurrentPlan ? (
          // <div className="grid grid-cols-2 gap-3">
          //<Button variant={"secondary"}>Renew Plan</Button>
          // </div>
          <Button
            variant={"destructive"}
            className="cursor-pointer"
            onClick={cancelPlan}
            isLoading={loading}
          >
            Cancel Plan
          </Button>
        ) : (
          <Button size={"full"} onClick={upgradePlan} isLoading={loading}>
            Choose Plan
          </Button>
        ))}
    </div>
  );
};
export default PricingCard;
