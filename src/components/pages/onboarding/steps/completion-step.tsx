"use client";
import { Button } from "@/components/ui/button";
import GIcon from "@/components/g-icon";

interface CompletionStepProps {
  isSubmitting: boolean;
  onGenerateClick: () => void;
}

export default function CompletionStep({ isSubmitting, onGenerateClick }: CompletionStepProps) {
  return (
    <div className="space-y-8 text-center">
      <div className="flex justify-center">
        <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
          <GIcon name="check" size={48} className="text-primary-foreground" />
        </div>
      </div>

      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          You&apos;re All Set
          <span className="ml-2">
            <GIcon name="music_note" size={32} className="inline text-primary" />
            <GIcon name="music_note" size={28} className="inline text-primary -ml-2" />
          </span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Let&apos;s create your first cover and get your release moving.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="p-4 rounded-lg border border-border bg-card">
          <GIcon name="auto_awesome" size={32} className="text-primary mb-2" />
          <p className="font-semibold text-foreground">AI-Powered</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <GIcon name="check_circle" size={32} className="text-primary mb-2" />
          <p className="font-semibold text-foreground">Streaming-Ready</p>
        </div>
        <div className="p-4 rounded-lg border border-border bg-card">
          <GIcon name="download" size={32} className="text-primary mb-2" />
          <p className="font-semibold text-foreground">Instant Export</p>
        </div>
      </div>

      {isSubmitting ? (
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <GIcon name="hourglass_empty" className="animate-spin" />
          <span>Saving your preferences...</span>
        </div>
      ) : (
        <div className="flex justify-center mt-6">
          <Button onClick={onGenerateClick} size="lg" className="px-8">
            Generate Your First Image
            <GIcon name="arrow_forward" />
          </Button>
        </div>
      )}

      <div className="text-sm text-muted-foreground mt-8">
        © {new Date().getFullYear()} Edit Deck Pro. All rights reserved.
      </div>
    </div>
  );
}
