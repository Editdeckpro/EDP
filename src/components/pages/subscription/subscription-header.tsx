import React, { Dispatch, FC, SetStateAction } from "react";
import { billingPeriod } from ".";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

interface SubscriptionHeaderProps {
  setPeriod: Dispatch<SetStateAction<billingPeriod>>;
  billingPeriod: billingPeriod;
}
const SubscriptionHeader: FC<SubscriptionHeaderProps> = ({
  setPeriod,
  billingPeriod,
}) => {
  return (
    <div className="flex md:justify-between items-center md:flex-row flex-col text-center justify-center md:text-left">
      <div>
        <h2 className="text-3xl font-bold mb-2">Choose the Perfect Plan.</h2>
        <p className="text-[#6a6c7b] mb-6">
          Select a plan that suits your needs and unlock exclusive features.
        </p>
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
              billingPeriod === "monthly"
                ? "!bg-primary !text-white"
                : "text-[#6a6c7b]"
            )}
          >
            Monthly
          </ToggleGroupItem>
          <ToggleGroupItem
            value="yearly"
            className={cn(
              "px-6 py-2 !rounded-full cursor-pointer",
              billingPeriod === "yearly"
                ? "!bg-primary !text-white"
                : "text-[#6a6c7b]"
            )}
          >
            Yearly
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};
export default SubscriptionHeader;
