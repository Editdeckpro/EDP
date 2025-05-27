// Subscription Plan
export type SubscriptionPlan = {
  id: string;
  name: string;
  features: string[];
  prices: null | {
    monthly?: { interval: string };
    yearly?: { interval: string };
  };
};

// Get Available Plans Response
export type GetPlansResponse = SubscriptionPlan[];

// Get Current Subscription Response
export type GetCurrentSubscriptionResponse = {
  planType: string;
  status: string;
  interval: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  features: string[];
};

// Create Checkout Session Response
export type CreateCheckoutSessionResponse =
  | {
      type: "URL";
      url: string;
    }
  | {
      type: "DOWNGRADE";
      message: string;
      downgradeDetails: {
        fromPlan: string;
        toPlan: string;
        effectiveDate: string;
      };
    }
  | {
      type: "UPGRADE";
      url: string;
    };

// Cancel Subscription Response
export type CancelSubscriptionResponse = {
  message: string;
};
