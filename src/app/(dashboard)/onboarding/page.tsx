"use client";
import OnboardingFlow from "@/components/pages/onboarding/onboarding-flow";
import { getOnboardingStatus } from "@/components/pages/onboarding/request";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getOnboardingCompleteFromStorage, setOnboardingCompleteInStorage } from "@/lib/onboarding-storage";

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAndRedirect = async () => {
      // Wait for authentication (cookie auth: session may have empty accessToken)
      if (status !== "authenticated" || !session?.user) {
        if (status === "unauthenticated") {
          router.push("/login");
        }
        return;
      }

      // Check localStorage first (set on login) to avoid unnecessary API call
      if (getOnboardingCompleteFromStorage()) {
        router.push("/");
        return;
      }

      try {
        const statusResponse = await getOnboardingStatus();

        if (statusResponse.isComplete) {
          setOnboardingCompleteInStorage(true);
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
