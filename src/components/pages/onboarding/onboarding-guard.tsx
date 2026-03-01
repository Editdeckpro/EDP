"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { getOnboardingStatus } from "./request";
import { getOnboardingCompleteFromStorage, setOnboardingCompleteInStorage } from "@/lib/onboarding-storage";

interface OnboardingGuardProps {
  children: React.ReactNode;
}

export default function OnboardingGuard({ children }: OnboardingGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      // Skip check if not authenticated
      if (status !== "authenticated" || !session?.user) {
        setIsChecking(false);
        return;
      }

      // Allow access to onboarding page - it will handle its own redirect
      if (pathname === "/onboarding") {
        setIsChecking(false);
        return;
      }

      // Check localStorage first (set on login) to avoid unnecessary API call
      if (getOnboardingCompleteFromStorage()) {
        setIsChecking(false);
        return;
      }

      try {
        // Check onboarding status using the new status endpoint
        const statusResponse = await getOnboardingStatus();

        if (!statusResponse.isComplete) {
          // Redirect to onboarding if not completed
          router.push("/onboarding");
        } else {
          setOnboardingCompleteInStorage(true);
          setIsChecking(false);
        }
      } catch (error) {
        // If there's an error, allow access to avoid blocking users
        console.error("Error checking onboarding status:", error);
        setIsChecking(false);
      }
    };

    checkOnboardingStatus();
  }, [session, status, pathname, router]);

  if (isChecking && status === "authenticated" && pathname !== "/onboarding") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
