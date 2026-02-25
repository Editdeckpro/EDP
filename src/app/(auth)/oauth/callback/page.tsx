"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn } from "next-auth/react";
import { Loader2Icon } from "lucide-react";
import { SubscriptionRequiredModal } from "@/components/pages/auth/subscription-required-modal";
import { getOnboardingStatus } from "@/components/pages/onboarding/request";
import { setOnboardingCompleteInStorage } from "@/lib/onboarding-storage";

function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const subscriptionRequired = searchParams.get("subscriptionRequired") === "true";
  const detailsParam = searchParams.get("details");
  
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionDetails, setSubscriptionDetails] = useState<{
    title?: string;
    message?: string;
    description?: string;
    pricingPageUrl?: string;
    actionText?: string;
    supportMessage?: string;
  } | null>(null);

  useEffect(() => {
    // Parse subscription details if provided
    if (detailsParam) {
      try {
        const decoded = decodeURIComponent(detailsParam);
        const details = JSON.parse(decoded);
        setSubscriptionDetails(details);
      } catch (error) {
        console.error("Error parsing subscription details:", error);
      }
    }
  }, [detailsParam]);

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const result = await signIn("credentials", {
            token,
            redirect: false,
          });

          if (result?.ok || result?.error === undefined) {
            // Sign in successful: fetch onboarding status and store in localStorage
            try {
              const session = await getSession();
              const accessToken = session?.accessToken as string | undefined;
              if (accessToken) {
                const onboardingStatus = await getOnboardingStatus(accessToken);
                setOnboardingCompleteInStorage(onboardingStatus.isComplete);
              }
            } catch {
              setOnboardingCompleteInStorage(false);
            }
            if (subscriptionRequired) {
              // Show subscription modal
              setShowSubscriptionModal(true);
            } else {
              // Normal flow - redirect to onboarding
              router.push("/onboarding");
            }
          } else {
            // Sign in failed, redirect to login
            router.push("/login");
          }
        } catch (error) {
          console.error("Sign in error:", error);
          router.push("/login");
        }
      })();
    } else {
      // Invalid redirect
      router.push("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, subscriptionRequired]);


  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div>
          <Loader2Icon className="animate-spin" />
        </div>
        <div>Validating session, please wait...</div>
      </div>
      
      <SubscriptionRequiredModal
        open={showSubscriptionModal}
        onOpenChange={(open) => {
          setShowSubscriptionModal(open);
          if (!open) {
            // Redirect to dashboard after closing modal
            router.push("/");
          }
        }}
        details={subscriptionDetails || undefined}
      />
    </>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthCallback />
    </Suspense>
  );
}
