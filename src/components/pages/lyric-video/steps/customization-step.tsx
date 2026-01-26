"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface CustomizationStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: any) => void;
  videoData: any;
}

const FONTS = [
  { value: "Inter", label: "Inter" },
  { value: "Poppins", label: "Poppins" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
];

const BRAND_COLORS = [
  { value: "#FFFFFF", label: "White" },
  { value: "#000000", label: "Black" },
  { value: "#FF6B6B", label: "Primary Red" },
  { value: "#4ECDC4", label: "Secondary Teal" },
  { value: "#FFD700", label: "Accent Gold" },
];

export default function CustomizationStep({ onNext, onPrev, onDataUpdate, videoData }: CustomizationStepProps) {
  const [font, setFont] = useState(videoData.font || "Inter");
  const [textColor, setTextColor] = useState(videoData.textColor || "#FFFFFF");
  const [highlightColor, setHighlightColor] = useState(videoData.highlightColor || "#FFD700");
  const [backgroundColor, setBackgroundColor] = useState(videoData.backgroundColor || "#000000");

  const handleNext = () => {
    onDataUpdate({
      font,
      textColor,
      highlightColor,
      backgroundColor,
    });
    onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Customize</h2>
        <p className="text-muted-foreground">
          Customize the appearance of your lyric video. You can adjust fonts and colors.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="font">Font</Label>
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger id="font">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="textColor">Text Color</Label>
          <div className="flex gap-2">
            <Select value={textColor} onValueChange={setTextColor}>
              <SelectTrigger id="textColor" className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRAND_COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="w-16 h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="highlightColor">Highlight Color</Label>
          <div className="flex gap-2">
            <Select value={highlightColor} onValueChange={setHighlightColor}>
              <SelectTrigger id="highlightColor" className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRAND_COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="color"
              value={highlightColor}
              onChange={(e) => setHighlightColor(e.target.value)}
              className="w-16 h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="backgroundColor">Background Color</Label>
          <div className="flex gap-2">
            <Select value={backgroundColor} onValueChange={setBackgroundColor}>
              <SelectTrigger id="backgroundColor" className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BRAND_COLORS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-16 h-10"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button onClick={handleNext}>Next: Preview</Button>
      </div>
    </div>
  );
}
