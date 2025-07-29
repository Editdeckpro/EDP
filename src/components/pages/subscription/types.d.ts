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

type MessageMetadata =
  | {
      type: "FREE_PLAN";
      message: string;
    }
  | {
      type: "CANCEL_AT_PERIOD_END";
      message: string;
      endDate: string;
    }
  | {
      type: "TRIAL_END";
      message: string;
      trialEndDate: string;
    }
  | {
      type: "EXPIRED" | "CANCELED";
      message: string;
      expireDate: string;
    }
  | {
      type: "SCHEDULED_DOWNGRADE";
      message: string;
      downgradeDetails: {
        fromPlan: PlanType;
        toPlan: PlanType;
        effectiveDate: string;
      };
    };

// Get Current Subscription Response
export type GetCurrentSubscriptionResponse = {
  planType: string;
  status: string;
  interval?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  features: string[];
  messageMetadata: MessageMetadata;
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
