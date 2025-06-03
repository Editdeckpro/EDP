// types/next-auth.d.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    accessToken: string;
    username: string; // Add username here
  }

  interface JWT {
    accessToken: string;
    username: string;
  }

  interface Session {
    accessToken: string;
    user: SessionUser;
  }
}

export interface SessionUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  profileImage?: string;
  subscription: {
    planType: string;
    status: string;
    interval: "monthly" | "yearly";
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    features: string[];
  };
}
