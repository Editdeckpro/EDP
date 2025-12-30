"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import GIcon from "@/components/g-icon";

interface OAuthErrorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorType: string | null;
  message: string | null;
}

export function OAuthErrorModal({ open, onOpenChange, errorType, message }: OAuthErrorModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !errorType) return null;

  const errorConfig = getErrorConfig(errorType, message);

  const handleViewPricing = () => {
    window.open("https://editdeckpro.com/pricing-plans/", "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden">
        {/* Icon Header */}
        <div className={`flex items-center justify-center pt-8 pb-4 ${errorConfig.iconBgColor}`}>
          <div className={`rounded-full p-4 ${errorConfig.iconContainerBg}`}>
            <GIcon name={errorConfig.icon} size={48} className={errorConfig.iconColor} />
          </div>
        </div>

        <DialogHeader className="px-6 pt-4 pb-2 text-center space-y-2">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {errorConfig.title}
          </DialogTitle>
          <p className="text-base text-gray-600 leading-relaxed">
            {errorConfig.description}
          </p>
        </DialogHeader>

        {errorConfig.details && (
          <div className="px-6 pb-4">
            <p className="text-sm text-gray-500 text-center leading-relaxed">
              {errorConfig.details}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3 px-6 pb-6 pt-2">
          {errorConfig.showPricingButton && (
            <Button 
              onClick={handleViewPricing} 
              className="w-full h-11 text-base font-semibold shadow-sm hover:shadow-md transition-shadow" 
              size="lg"
            >
              <GIcon name="store" size={20} className="mr-2" />
              View Pricing Plans
            </Button>
          )}
          <button
            onClick={() => onOpenChange(false)}
            className="w-full h-10 rounded-md border border-gray-200 bg-white text-gray-700 font-medium hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 active:bg-gray-200 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getErrorConfig(errorType: string, customMessage: string | null) {
  const configs: Record<string, {
    title: string;
    description: string;
    details?: string;
    showPricingButton: boolean;
    icon: string;
    iconBgColor: string;
    iconContainerBg: string;
    iconColor: string;
  }> = {
    user_not_found: {
      title: "Account Not Found",
      description: customMessage || "Account not found. Please create an account first, then you can use OAuth login to access your account.",
      details: "Visit the pricing page to register and subscribe to access all features.",
      showPricingButton: true,
      icon: "person_add",
      iconBgColor: "bg-blue-50",
      iconContainerBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    subscription_required: {
      title: "Subscription Required",
      description: customMessage || "Subscription required. Please purchase a subscription to access the platform.",
      details: "Visit our pricing page to view available subscription plans and choose the one that best fits your needs.",
      showPricingButton: true,
      icon: "workspace_premium",
      iconBgColor: "bg-amber-50",
      iconContainerBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    subscription_expired: {
      title: "Subscription Expired",
      description: customMessage || "Your subscription has expired. Please renew your subscription to continue accessing the platform.",
      details: "Visit our pricing page to renew your subscription and regain access to all features.",
      showPricingButton: true,
      icon: "event_busy",
      iconBgColor: "bg-red-50",
      iconContainerBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    email_required: {
      title: "Email Required",
      description: customMessage || "Email is required for Apple OAuth login.",
      details: "Please try again or use a different login method.",
      showPricingButton: false,
      icon: "mail_outline",
      iconBgColor: "bg-gray-50",
      iconContainerBg: "bg-gray-100",
      iconColor: "text-gray-600",
    },
    oauth_failed: {
      title: "Authentication Failed",
      description: customMessage || "OAuth authentication failed. Please try again.",
      details: "If the issue persists, please contact our support team.",
      showPricingButton: false,
      icon: "error_outline",
      iconBgColor: "bg-red-50",
      iconContainerBg: "bg-red-100",
      iconColor: "text-red-600",
    },
    oauth_error: {
      title: "Authentication Error",
      description: customMessage || "An error occurred during authentication. Please try again.",
      details: "If the issue persists, please contact our support team at editdeckpro@gmail.com",
      showPricingButton: false,
      icon: "error_outline",
      iconBgColor: "bg-red-50",
      iconContainerBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  };

  return configs[errorType] || {
    title: "Error",
    description: customMessage || "An error occurred. Please try again.",
    showPricingButton: false,
    icon: "error_outline",
    iconBgColor: "bg-gray-50",
    iconContainerBg: "bg-gray-100",
    iconColor: "text-gray-600",
  };
}

