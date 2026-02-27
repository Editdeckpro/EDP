/** Plan IDs – keep in sync with backend and subscription-pricing */
export type PlanID = "FREE" | "STARTER" | "NEXT_LEVEL" | "PRO_STUDIO";

export interface SessionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string;
  subscriptionExpired?: boolean;
  generationsUsedThisMonth: number;
  monthlyLimit: number | null;
  bypassSubscription?: boolean;
  subscription: {
    planType: PlanID;
    status: string;
    interval: "monthly" | "yearly";
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    features: string[];
  };
}

export interface Session {
  user: SessionUser;
  accessToken: string;
}
