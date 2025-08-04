"use client";
import React, { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { billingPeriod } from ".";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { GetAxiosWithAuth } from "@/lib/axios-instance";
import { GetCurrentSubscriptionResponse } from "./types";
import { formatLongDate } from "@/helper/helper-functions";
import { Skeleton } from "@/components/ui/skeleton";

interface SubscriptionHeaderProps {
  setPeriod: Dispatch<SetStateAction<billingPeriod>>;
  billingPeriod: billingPeriod;
}
const SubscriptionHeader: FC<SubscriptionHeaderProps> = ({ setPeriod, billingPeriod }) => {
  const [subscriptionData, setSubscriptionData] = useState<GetCurrentSubscriptionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expireDate, setExpireDate] = useState<string>("");

  useEffect(() => {
    switch (subscriptionData?.messageMetadata.type) {
      case "CANCEL_AT_PERIOD_END":
        setExpireDate(subscriptionData?.messageMetadata?.endDate);
        break;
      case "TRIAL_END":
        setExpireDate(subscriptionData?.messageMetadata?.trialEndDate);
        break;
      case "EXPIRED":
      case "CANCELED":
        setExpireDate(subscriptionData?.messageMetadata?.expireDate);
        break;
      case "SCHEDULED_DOWNGRADE":
        setExpireDate(subscriptionData?.messageMetadata?.downgradeDetails?.effectiveDate);
        break;
    }
  }, [subscriptionData]);

  useEffect(() => {
    const fetchSubscription = async () => {
      setIsLoading(true);
      try {
        const axios = await GetAxiosWithAuth();
        const res = await axios.get<GetCurrentSubscriptionResponse>(`subscription`);
        setSubscriptionData(res.data);
      } catch (err) {
        console.error("Failed to fetch subscription info:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  return (
    <div className="flex md:justify-between items-center md:flex-row flex-col text-center justify-center md:text-left">
      <div>
        <h2 className="text-3xl font-bold mb-2">Choose the Perfect Plan.</h2>
        <p className="text-[#6a6c7b]">Select a plan that suits your needs and unlock exclusive features.</p>
        {isLoading ? (
          <Skeleton className="w-80 h-5 my-1 mx-auto md:mx-0" />
        ) : (
          subscriptionData?.messageMetadata?.message && (
            <p className="text-primary mb-2 font-medium">
              {subscriptionData?.messageMetadata?.type === "FREE_PLAN"
                ? subscriptionData?.messageMetadata?.message
                : `${subscriptionData?.messageMetadata?.message} ${formatLongDate(expireDate)}`}
            </p>
          )
        )}
      </div>
      <div className="mb-6">
        <ToggleGroup
          type="single"
          value={billingPeriod}
          onValueChange={(value) => value && setPeriod(value as billingPeriod)}
          className="bg-gray-200/50 p-2 rounded-full py-1"
        >
          <ToggleGroupItem
            value="monthly"
            className={cn(
              "px-6 py-2 !rounded-full cursor-pointer",
              billingPeriod === "monthly" ? "!bg-primary !text-white" : "text-[#6a6c7b]"
            )}
          >
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem
            value="yearly"
            className={cn(
              "px-6 py-2 !rounded-full cursor-pointer",
              billingPeriod === "yearly" ? "!bg-primary !text-white" : "text-[#6a6c7b]"
            )}
          >
            Yearly
            {/* <span className="text-xs">(Save 33%)</span> */}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default SubscriptionHeader;
