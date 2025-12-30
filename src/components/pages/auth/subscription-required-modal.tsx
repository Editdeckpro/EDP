"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface SubscriptionRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  details?: {
    title?: string;
    message?: string;
    description?: string;
    pricingPageUrl?: string;
    actionText?: string;
    supportMessage?: string;
  };
}

export function SubscriptionRequiredModal({ open, onOpenChange, details }: SubscriptionRequiredModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const defaultDetails = {
    title: "Subscription Required",
    message: "Welcome! To access all features and start creating amazing images, you need to purchase a subscription plan.",
    description: "Please visit our pricing page to view available subscription packages and choose the plan that best fits your needs.",
    pricingPageUrl: "https://editdeckpro.com/pricing-plans/",
    actionText: "View Pricing Plans",
    supportMessage: "Need help choosing a plan? Contact our support team at editdeckpro@gmail.com for assistance.",
  };

  const finalDetails = { ...defaultDetails, ...details };

  const handleViewPricing = () => {
    window.open(finalDetails.pricingPageUrl, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="mb-4 text-center">
          <DialogTitle className="text-2xl">{finalDetails.title}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {finalDetails.message}
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-gray-600 text-center">
            {finalDetails.description}
          </p>

          {finalDetails.supportMessage && (
            <p className="text-xs text-gray-500 text-center border-t pt-4">
              {finalDetails.supportMessage}
            </p>
          )}
        </div>

        <div className="flex justify-center mt-4">
          <Button onClick={handleViewPricing} className="w-full">
            {finalDetails.actionText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

