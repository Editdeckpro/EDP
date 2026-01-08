"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import GIcon from "@/components/g-icon";
import { OnboardingData } from "@/schemas/onboarding-schema";

interface ContentTypeStepProps {
  selectedValue?: OnboardingData["contentType"];
  onNext: (value: OnboardingData["contentType"]) => void;
  onBack: () => void;
}

const options = [
  {
    value: "album-cover" as const,
    title: "Album or Single Cover",
    description: "Streaming-ready artwork for your release",
    icon: "album",
  },
  {
    value: "promo-social" as const,
    title: "Promo / Social Media Graphic",
    description: "Eye-catching visuals for promotion",
    icon: "share",
  },
  {
    value: "playlist-banner" as const,
    title: "Playlist / Banner Artwork",
    description: "Header images and playlist covers",
    icon: "grid_view",
  },
  {
    value: "press-kit" as const,
    title: "Press Kit / Branding Assets",
    description: "Professional materials for your brand",
    icon: "description",
  },
];

export default function ContentTypeStep({ selectedValue, onNext, onBack }: ContentTypeStepProps) {
  const [localSelection, setLocalSelection] = useState<OnboardingData["contentType"] | undefined>(selectedValue);

  useEffect(() => {
    setLocalSelection(selectedValue);
  }, [selectedValue]);

  return (
    <div className="space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">What are you creating today?</h1>
        <p className="text-muted-foreground">Select the type of visual you need right now</p>
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
