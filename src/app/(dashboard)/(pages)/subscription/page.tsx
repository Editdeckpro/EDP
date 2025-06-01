"use client";
import SubscriptionPage from "@/components/pages/subscription";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  return (
    <Suspense>
      <SubscriptionStatusNotifier />
    </Suspense>
  );
}

function SubscriptionStatusNotifier() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const status = searchParams.get("status");
    if (status !== null) {
      if (status === "true") {
        toast.success("Subscription successful!");
      } else if (status === "false") {
        toast.error("Subscription failed!");
      }
      // Remove the status param from the URL
      const params = new URLSearchParams(searchParams.toString());
      params.delete("status");
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, router]);

  return <SubscriptionPage />;
}
