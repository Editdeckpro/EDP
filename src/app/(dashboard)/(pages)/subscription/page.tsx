"use client";
import SubscriptionPage from "@/components/pages/subscription";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[40vh] flex items-center justify-center text-muted-foreground">Loading...</div>}>
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
        toast.success("Subscription successful!", { duration: 5000 });
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
