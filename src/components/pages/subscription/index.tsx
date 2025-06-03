"use client";
// import { Separator } from "@/components/ui/separator";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useState } from "react";
// import SubscriptionHistory from "./subscription-history";
import SubscriptionPricing from "./subscription-pricing";

export type billingPeriod = "monthly" | "yearly";

export default function SubscriptionPage() {
  // const [tabRef, setTabRef] = useState<"pricing" | "history">("pricing");

  return (
    <>
      {/* <section className="space-y-5 hidden sm:block"> */}
      <section className="space-y-5">
        <SubscriptionPricing />
        {/* <SubscriptionHistory /> */}
      </section>

      {/* <Tabs
        defaultValue="pricing"
        value={tabRef}
        onValueChange={(val) => setTabRef(val as "pricing" | "history")}
        className="block sm:hidden"
      >
        <div className="mb-10">
          <TabsList className="w-full bg-transparent">
            <TabsTrigger
              value="pricing"
              className="peer/pricing-tab data-[state=active]:bg-transparent data-[state=active]:shadow-none font-normal text-gray-700 data-[state=active]:text-primary data-[state=active]:font-bold"
            >
              Plans
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="peer/history-tab data-[state=active]:bg-transparent data-[state=active]:shadow-none font-normal text-gray-700 data-[state=active]:text-primary data-[state=active]:font-bold"
            >
              Subscription History
            </TabsTrigger>
          </TabsList>

          <div className="flex overflow-hidden">
            <Separator
              className={`!h-[2px] max-w-1/2 ${
                tabRef === "pricing" ? "bg-primary" : "bg-muted"
              }`}
            />
            <Separator
              className={`!h-[2px] max-w-1/2 ${
                tabRef === "history" ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>
        </div>
      </Tabs> */}

      {/* <div className="block sm:hidden">
        <div className={tabRef === "pricing" ? "block" : "hidden"}>
          <SubscriptionPricing />
        </div>
        <div className={tabRef === "history" ? "block" : "hidden"}>
          <SubscriptionHistory />
        </div>
      </div> */}
    </>
  );
}
