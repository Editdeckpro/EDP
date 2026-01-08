"use client";
import OnboardingFlow from "@/components/pages/onboarding/onboarding-flow";
import { getOnboardingStatus } from "@/components/pages/onboarding/request";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ONBOARDING_COMPLETE_KEY = "signup-onboarding-complete";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Wait for authentication
      if (status !== "authenticated" || !session?.accessToken) {
        if (status === "unauthenticated") {
          router.push("/login");
        }
        return;
      }

      // Check localStorage first to avoid unnecessary API call
      if (typeof window !== "undefined") {
        const isCompleteInStorage = localStorage.getItem(ONBOARDING_COMPLETE_KEY) === "true";
        if (isCompleteInStorage) {
          // Redirect to dashboard if already completed (from localStorage)
          router.push("/");
          return;
        }
      }

      try {
        // Check if onboarding is already complete
        const statusResponse = await getOnboardingStatus(session.accessToken);

        if (statusResponse.isComplete) {
          // Store in localStorage for future checks
          if (typeof window !== "undefined") {
            localStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
          }
          // Redirect to dashboard if already completed
          router.push("/");
        } else {
          // Show onboarding flow if not completed
          setIsChecking(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        // If error, show onboarding flow anyway
        setIsChecking(false);
      }
    };

    checkAndRedirect();
  }, [session, status, router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Checking onboarding status...</p>
        </div>
      </div>
    );
  }

  return <OnboardingFlow />;
}
