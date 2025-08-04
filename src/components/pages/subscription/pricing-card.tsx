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
import { CancelSubscriptionResponse, CreateCheckoutSessionResponse } from "./types";
import { AxiosError } from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getPlanActionType, messageMap } from "./subscription-pricing";

export type PlanID = "FREE" | "STARTER" | "NEXT_LEVEL" | "PRO_STUDIO";
export interface PricingCardProps {
  id: PlanID;
  title: string;
  badge: string;
  description: string;
  price: number;
  price_annual: number;
  features: string[];
  billingPeriod: billingPeriod;
  color: "primary" | "secondary" | "blue";
  icon: React.ReactNode;
  isLoading: boolean;
  isCurrentPlan: boolean;
  currentPlanId?: PlanID;
}

const PricingCard: FC<PricingCardProps> = ({
  id,
  billingPeriod,
  features,
  price,
  price_annual,
  title,
  description,
  isCurrentPlan,
  icon: Icon,
  color,
  isLoading,
  currentPlanId = "FREE",
}) => {
  const cardBg = color === "primary" ? "bg-primary/20" : color === "secondary" ? "bg-secondary/20" : "bg-accent/20";

  const cardIconBg = color === "primary" ? "bg-primary" : color === "secondary" ? "bg-secondary" : "bg-accent";

  const cardBorder =
    color === "primary" ? "border-primary" : color === "secondary" ? "border-secondary" : "border-accent";

  const router = useRouter();
  const topLoader = useTopLoader();
  const [loading, setLoading] = React.useState(false);

  const actionType = getPlanActionType(currentPlanId, id);

  async function upgradePlan() {
    topLoader.start();
    setLoading(true);
    try {
      const axios = await GetAxiosWithAuth();
      const res = await axios.post<CreateCheckoutSessionResponse>("subscription/create-checkout-session", {
        planType: id,
        interval: billingPeriod,
      });

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
      const res = await axios.post<CancelSubscriptionResponse>("subscription/cancel");

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
    <div
      className={cn(
        `bg-white rounded-xl p-4 border flex flex-col justify-between`,
        isCurrentPlan && cardBorder,
        cardBg
      )}
    >
      <div>
        <div>
          <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-white">
            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", cardIconBg)}>
              {/* <StickyNoteIcon color="white" /> */}
              {Icon}
            </div>
            <h2 className="font-semibold text-lg">{title}</h2>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-bold">${billingPeriod === "monthly" ? price : price_annual}</span>
            <span className="text-[#6a6c7b]">/{billingPeriod === "monthly" ? "Month" : "Year"}</span>
          </div>
        </div>

        {features.length > 0 && (
          <div className="mb-8">
            <h4 className="font-semibold mb-4">{description}</h4>
            <ul className="space-y-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-[#6a6c7b]">
                  <GIcon name="send" className={"text-primary"} size={20} />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {id !== "FREE" &&
        (isCurrentPlan ? (
          // <div className="grid grid-cols-2 gap-3">
          //<Button variant={"secondary"}>Renew Plan</Button>
          // </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={"destructive"}
                className="cursor-pointer"
                isLoading={loading}
                disabled={loading || isLoading}
              >
                Cancel Plan
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
                <AlertDialogDescription>
                  {
                    "Are you sure you want to cancel your subscription? You’ll lose access to premium features at the end of your billing cycle."
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={cancelPlan}>Yes, Cancel Subscription</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size={"full"} isLoading={loading}>
                Get Started Now
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{messageMap[actionType].title}</AlertDialogTitle>
                <AlertDialogDescription>{messageMap[actionType].description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={upgradePlan}>{messageMap[actionType].action}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
    </div>
  );
};
export default PricingCard;
