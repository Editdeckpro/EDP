import GIcon from "@/components/g-icon";
import { Button } from "@/components/ui/button";
import React, { FC } from "react";
import { billingPeriod } from ".";
import { cn } from "@/lib/utils";

export interface PricingCardProps {
  title: string;
  price: number;
  billingPeriod: billingPeriod;
  features: string[];
  isCurrentPlan?: boolean;
  color: "primary" | "secondary" | "blue";
  icon: React.ReactNode;
}

const PricingCard: FC<PricingCardProps> = ({
  billingPeriod,
  features,
  price,
  title,
  isCurrentPlan,
  icon: Icon,
  color,
}) => {
  const yearlyPrice = price * 12;

  const cardBg =
    color === "primary"
      ? "bg-primary"
      : color === "secondary"
      ? "bg-secondary"
      : "bg-[#4092dd]";

  return (
    <div className="bg-white rounded-xl p-3 border border-[#dedede]">
      <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-gray-200/50">
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center",
            cardBg
          )}
        >
          {/* <StickyNoteIcon color="white" /> */}
          {Icon}
        </div>
        <span className="font-semibold text-lg">{title}</span>
      </div>

      <div className="mb-6">
        <span className="text-4xl font-bold">
          ${billingPeriod === "monthly" ? price : yearlyPrice}
        </span>
        <span className="text-[#6a6c7b]">
          /{billingPeriod === "monthly" ? "Month" : "Year"}
        </span>
      </div>

      <div className="mb-8">
        <h4 className="font-semibold mb-4">Features Included:</h4>
        <ul className="space-y-3">
          {features.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-[#6a6c7b]"
            >
              <GIcon name="send" className={"text-primary"} size={20} />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {isCurrentPlan ? (
        <div className="grid grid-cols-2 gap-3">
          <Button>Cancel Plan</Button>
          <Button variant={"secondary"}>Renew Plan</Button>
        </div>
      ) : (
        <Button size={"full"}>Upgrade Plan</Button>
      )}
    </div>
  );
};
export default PricingCard;
