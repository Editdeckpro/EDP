"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { pricingPlansDetails } from "@/components/pages/subscription/subscription-pricing";
import { cn } from "@/lib/utils";
import { memo, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface NoActiveSubscriptionModalProps {
  credits?: number;
}

function NoActiveSubscriptionModalComponent({ credits }: NoActiveSubscriptionModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      // Check subscription status from session
      const subscription = session?.user?.subscription;
      const planType = subscription?.planType;
      const status = subscription?.status;
      
      // Show modal if:
      // 1. User has FREE plan, OR
      // 2. Subscription status is not active (expired, canceled, etc.), OR
      // 3. Credits are 0 (fallback check)
      const hasNoActiveSubscription = 
        planType === "FREE" || 
        (status && status !== "active" && status !== "trialing") ||
        credits === 0;

      if (hasNoActiveSubscription) {
        setShowDialog(true);
      }
    }, 2000); // after 2 seconds show no subscription dialog

    return () => clearTimeout(timeout);
  }, [credits, session]);
  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent>
        <DialogHeader className="mb-4 text-center">
          <DialogTitle className="text-2xl">No Active Plan</DialogTitle>
          <p className="text-sm text-muted-foreground">
            You need an active subscription plan to access this feature. Subscribe now to get started with our
            AI-powered tools.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 z-10">
          {pricingPlansDetails.map((plan) => {
            const color = plan.color;
            const cardBg =
              color === "primary" ? "bg-primary/20" : color === "secondary" ? "bg-secondary/20" : "bg-accent/20";

            const cardBorder =
              color === "primary" ? "border-primary" : color === "secondary" ? "border-secondary" : "border-accent";
            return (
              <div
                key={plan.title}
                className={cn(
                  "rounded-2xl border hover:shadow-md flex justify-center items-center flex-col p-2",
                  cardBg,
                  cardBorder
                )}
              >
                <Badge variant="outline" className={cn(cardBorder, "bg-accent-foreground py-1")}>
                  {plan.badge}
                </Badge>
                <h3 className="text-xl font-semibold text-center mt-2">{plan.title}</h3>
                <p className="text-sm text-[#6a6c7b] my-2 text-center">{plan.description}</p>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={() => router.push("/subscription")}>View Pricing & Subscribe</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ✅ Use memo to avoid unnecessary re-renders from parent
export const NoActiveSubscriptionModal = memo(NoActiveSubscriptionModalComponent);
