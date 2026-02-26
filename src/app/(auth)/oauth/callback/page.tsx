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
    if (!token) {
      console.log("[EditDeck] OAuth callback: no token, redirecting to login");
      router.push("/login");
      return;
    }

    let cancelled = false;
    console.log("[EditDeck] OAuth callback: token present, signing in...", { subscriptionRequired });

    (async () => {
      try {
        const result = await signIn("credentials", {
          token,
          redirect: false,
        });

        if (cancelled) return;

        console.log("[EditDeck] OAuth callback: signIn result", { ok: result?.ok, error: result?.error });

        if (result?.ok || result?.error === undefined) {
          // Fetch onboarding status and store in localStorage
          try {
            const session = await getSession();
            const accessToken = session?.accessToken as string | undefined;
            console.log("[EditDeck] OAuth callback: session fetched", { hasToken: !!accessToken, hasUser: !!session?.user });
            if (accessToken) {
              const onboardingStatus = await getOnboardingStatus(accessToken);
              setOnboardingCompleteInStorage(onboardingStatus.isComplete);
              console.log("[EditDeck] OAuth callback: onboarding status", { isComplete: onboardingStatus.isComplete });
            }
          } catch (e) {
            console.warn("[EditDeck] OAuth callback: onboarding fetch failed", e);
            setOnboardingCompleteInStorage(false);
          }
          if (cancelled) return;

          if (subscriptionRequired) {
            console.log("[EditDeck] OAuth callback: showing subscription required modal");
            setShowSubscriptionModal(true);
          } else {
            console.log("[EditDeck] OAuth callback: redirecting to /onboarding (full page)");
            window.location.href = "/onboarding";
          }
        } else {
          console.warn("[EditDeck] OAuth callback: sign-in failed, redirecting to login");
          router.push("/login");
        }
      } catch (error) {
        console.error("[EditDeck] OAuth callback: Sign in error:", error);
        if (!cancelled) router.push("/login");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token, subscriptionRequired, router]);


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
            console.log("[EditDeck] OAuth callback: subscription modal closed, redirecting to / (full page)");
            window.location.href = "/";
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
