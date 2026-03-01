import { getServerSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const SUBSCRIPTION_EXPIRED_MESSAGE =
  "Your subscription has expired. Please renew your subscription to continue accessing the platform.";

interface AuthGuardProps {
  children: ReactNode;
}

export default async function AuthGuard({ children }: AuthGuardProps) {
  const session = await getServerSession();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user?.subscriptionExpired) {
    redirect(
      `/login?error=subscription_expired&message=${encodeURIComponent(SUBSCRIPTION_EXPIRED_MESSAGE)}`
    );
  }

  return <>{children}</>;
}
