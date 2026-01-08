"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GIcon from "@/components/g-icon";
import { OnboardingData } from "@/schemas/onboarding-schema";

interface UserTypeStepProps {
  selectedValue?: OnboardingData["userType"];
  onNext: (value: OnboardingData["userType"]) => void;
  onBack: () => void;
}

const options = [
  {
    value: "myself" as const,
    title: "Myself (Independent Artist)",
    description: "Creating visuals for my own music releases",
    icon: "edit",
  },
  {
    value: "multiple-artists" as const,
    title: "Multiple Artists (Manager / Label)",
    description: "Managing releases for various artists",
    icon: "group",
  },
  {
    value: "team" as const,
    title: "Team / Studio / Agency",
    description: "Working on projects for multiple clients",
    icon: "headphones",
  },
];

export default function UserTypeStep({ selectedValue, onNext, onBack }: UserTypeStepProps) {
  const [localSelection, setLocalSelection] = useState<OnboardingData["userType"] | undefined>(selectedValue);

  useEffect(() => {
    setLocalSelection(selectedValue);
  }, [selectedValue]);

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Who are you creating for?</h1>
        <p className="text-muted-foreground">This helps us personalize your experience</p>
      </div>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => setLocalSelection(option.value)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:border-primary/50 ${
              localSelection === option.value
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:bg-accent/50"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <GIcon name={option.icon} size={24} className="text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-1">{option.title}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${
                  localSelection === option.value
                    ? "border-primary bg-primary"
                    : "border-muted-foreground"
                }`}
              >
                {localSelection === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="flex gap-3 justify-between">
        <Button variant="outline" onClick={onBack}>
          <GIcon name="arrow_back" />
          Back
        </Button>
        <Button onClick={() => localSelection && onNext(localSelection)} disabled={!localSelection} className="ml-auto">
          Continue
          <GIcon name="arrow_forward" />
        </Button>
      </div>
    </div>
  );
}
