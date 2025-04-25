"use client";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import SubscriptionHistory from "./subscription-history";
import SubscriptionPricing from "./subscription-pricing";

export type billingPeriod = "monthly" | "yearly";

export default function SubscriptionPage() {
  const [tabRef, setTabRef] = useState<"pricing" | "history">("pricing");

  return (
    <>
      <section className="space-y-5 hidden sm:block">
        <SubscriptionPricing />
        <SubscriptionHistory />
      </section>
      <Tabs
        defaultValue="pricing"
        className="block sm:hidden"
        onValueChange={(val) => setTabRef(val as "pricing" | "history")}
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
                tabRef == "pricing" ? "bg-primary" : "bg-muted"
              }`}
            />
            <Separator
              className={`!h-[2px] max-w-1/2 ${
                tabRef == "history" ? "bg-primary" : "bg-muted"
              }`}
            />
          </div>
        </div>
        <TabsContent value="pricing">
          <SubscriptionPricing />
        </TabsContent>
        <TabsContent value="history">
          <SubscriptionHistory />
        </TabsContent>
      </Tabs>
    </>
  );
}
