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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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
  const [cancelOpen, setCancelOpen] = React.useState(false);
  const [reason, setReason] = React.useState("");
  const [improvementSuggestion, setImprovementSuggestion] = React.useState("");
  const [cancelError, setCancelError] = React.useState<string | null>(null);

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
    if (!reason.trim() || !improvementSuggestion.trim()) return;

    topLoader.start();
    setLoading(true);
    setCancelError(null);

    try {
      const axios = await GetAxiosWithAuth();
      const res = await axios.post<CancelSubscriptionResponse>("subscription/cancel", {
        reason: reason.trim(),
        improvementSuggestion: improvementSuggestion.trim(),
      });

      toast.success("Plan Canceled successfully!", {
        description: res.data.message,
      });
      setCancelOpen(false);
      setReason("");
      setImprovementSuggestion("");
      setLoading(false);
      topLoader.done();
      router.refresh();
    } catch (e) {
      const error = e as AxiosError<{ error?: string }>;
      setCancelError(error.response?.data.error || "Error canceling plan");
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
          <Dialog
            open={cancelOpen}
            onOpenChange={(open) => {
              if (loading) return;
              setCancelOpen(open);
              if (!open) setCancelError(null);
            }}
          >
            <DialogTrigger asChild>
              <Button
                variant={"destructive"}
                className="cursor-pointer"
                isLoading={loading}
                disabled={loading || isLoading}
              >
                Cancel Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>We&apos;re sorry to see you go</DialogTitle>
                <DialogDescription>Help us understand why so we can improve.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label htmlFor="cancel-reason" className="text-sm font-medium">
                    Why are you canceling? <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="cancel-reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tell us what's prompting this..."
                    rows={3}
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="cancel-suggestion" className="text-sm font-medium">
                    What could we do better? <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="cancel-suggestion"
                    value={improvementSuggestion}
                    onChange={(e) => setImprovementSuggestion(e.target.value)}
                    placeholder="Suggestions, missing features, anything..."
                    rows={3}
                    disabled={loading}
                  />
                </div>

                {cancelError ? (
                  <p className="text-sm text-destructive">{cancelError}</p>
                ) : null}
              </div>

              <DialogFooter className="gap-2 sm:gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCancelOpen(false)}
                  disabled={loading}
                >
                  Nevermind, keep my subscription
                </Button>
                <Button
                  variant="destructive"
                  onClick={cancelPlan}
                  isLoading={loading}
                  disabled={loading || !reason.trim() || !improvementSuggestion.trim()}
                >
                  Cancel my subscription
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
