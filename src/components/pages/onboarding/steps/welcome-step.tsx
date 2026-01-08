"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import GIcon from "@/components/g-icon";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-center">
        <Image src="/images/logo.jpg" alt="Edit Deck Pro Logo" width={150} height={150} priority />
      </div>
      
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">Let&apos;s Get Started</h1>
        <p className="text-muted-foreground text-lg">
          Answer a few quick questions so we can tailor Edit Deck Pro to your workflow
        </p>
      </div>

      <Button onClick={onNext} size="lg" className="w-full sm:w-auto px-8">
        Start
        <GIcon name="arrow_forward" />
      </Button>
    </div>
  );
}
