"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type LyricVideoWizardData = {
  style?: string;
};

interface StyleSelectionStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: Partial<LyricVideoWizardData>) => void;
  videoData: LyricVideoWizardData;
}

const STYLES = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean and simple text with solid background",
    preview: "🎨",
  },
  {
    id: "animated_text",
    name: "Animated Text",
    description: "Dynamic text with slide animations and gradient background",
    preview: "✨",
  },
  {
    id: "album_cover",
    name: "Album Cover",
    description: "Text overlay on album cover image",
    preview: "🖼️",
  },
  {
    id: "abstract_visuals",
    name: "Abstract Visuals",
    description: "Fade animations with abstract background",
    preview: "🌌",
  },
];

export default function StyleSelectionStep({ onNext, onPrev, onDataUpdate, videoData }: StyleSelectionStepProps) {
  const [selectedStyle, setSelectedStyle] = useState(videoData.style || "minimal");

  const handleNext = () => {
    onDataUpdate({ style: selectedStyle });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Choose Style</h2>
        <p className="text-muted-foreground">
          Select a preset style for your lyric video. You can customize it further in the next step.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STYLES.map((style) => (
          <div
            key={style.id}
            className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
              selectedStyle === style.id
                ? "border-primary bg-primary/5 shadow-lg"
                : "border-muted hover:border-primary/50"
            }`}
            onClick={() => setSelectedStyle(style.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-4xl">{style.preview}</span>
              <div>
                <h3 className="font-semibold text-lg">{style.name}</h3>
                <p className="text-sm text-muted-foreground">{style.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext}>Next: Customize</Button>
      </div>
    </div>
  );
}
