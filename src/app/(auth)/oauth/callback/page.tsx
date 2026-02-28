"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { getSession, signIn } from "@/lib/auth-client";
import { Loader2Icon } from "lucide-react";
import { SubscriptionRequiredModal } from "@/components/pages/auth/subscription-required-modal";
import { getOnboardingStatus } from "@/components/pages/onboarding/request";
import { setOnboardingCompleteInStorage } from "@/lib/onboarding-storage";

const VALIDATION_TIMEOUT_MS = 20_000;

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
  const [timedOut, setTimedOut] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

    // If validation takes too long (e.g. server stuck after 20–30 min), let user escape
    timeoutRef.current = setTimeout(() => {
      if (!cancelled) setTimedOut(true);
    }, VALIDATION_TIMEOUT_MS);

    (async () => {
      try {
        const result = await signIn({ token });

        if (cancelled) return;
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        console.log("[EditDeck] OAuth callback: signIn result", { ok: result?.ok, error: result?.error });

        if (result?.ok) {
          if (subscriptionRequired) {
            console.log("[EditDeck] OAuth callback: showing subscription required modal");
            setShowSubscriptionModal(true);
            // Optionally fetch onboarding in background (non-blocking)
            getSession().then((session) => {
              const accessToken = session?.accessToken as string | undefined;
              if (accessToken) {
                getOnboardingStatus(accessToken).then((s) => setOnboardingCompleteInStorage(s.isComplete)).catch(() => setOnboardingCompleteInStorage(false));
              }
            }).catch(() => {});
          } else {
            // Always go to /onboarding from this page; never use result.url – it can be the current URL (oauth/callback) and cause a reload loop
            const target = "/onboarding";
            console.log("[EditDeck] OAuth callback: redirecting (full page)", target);
            window.location.href = target;
          }
        } else {
          console.warn("[EditDeck] OAuth callback: sign-in failed, redirecting to login");
          router.push("/login");
        }
      } catch (error) {
        console.error("[EditDeck] OAuth callback: Sign in error:", error);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        if (!cancelled) router.push("/login");
      }
    })();

    return () => {
      cancelled = true;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [token, subscriptionRequired, router]);

  if (timedOut) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4 px-4">
        <p className="text-center text-gray-700">
          Session validation is taking too long. The server may be busy. Please try again in a moment.
        </p>
        <Link
          href="/login"
          className="text-primary hover:underline font-medium"
        >
          Go to login
        </Link>
      </div>
    );
  }

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
