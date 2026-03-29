"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { updateLyricVideoClient } from "@/components/pages/lyric-video/api";
import { toast } from "sonner";
import { Check } from "lucide-react";

type LyricVideoWizardData = {
  style?: string;
  font?: string;
  textColor?: string;
  highlightColor?: string;
  lyricVideoId?: number;
};

interface StyleSelectionStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: Partial<LyricVideoWizardData>) => void;
  videoData: LyricVideoWizardData;
}

const ANIMATIONS = [
  { id: "minimal", name: "Minimal", description: "Clean fade-in, no distractions", icon: "▫" },
  { id: "animated_text", name: "Slide In", description: "Text slides in with energy", icon: "▶" },
  { id: "karaoke", name: "Karaoke", description: "Highlight each word as it plays", icon: "✦" },
  { id: "abstract_visuals", name: "Fade & Blur", description: "Cinematic blur transitions", icon: "◈" },
];

const FONTS = [
  { value: "Inter", label: "Inter", sample: "Modern & clean" },
  { value: "Poppins", label: "Poppins", sample: "Friendly & rounded" },
  { value: "Montserrat", label: "Montserrat", sample: "Bold & striking" },
  { value: "Roboto", label: "Roboto", sample: "Neutral & readable" },
  { value: "Open Sans", label: "Open Sans", sample: "Versatile & clear" },
];

const COLOR_SWATCHES = [
  { value: "#FFFFFF", label: "White" },
  { value: "#000000", label: "Black" },
  { value: "#FFD700", label: "Gold" },
  { value: "#FF6B6B", label: "Coral" },
  { value: "#4ECDC4", label: "Teal" },
  { value: "#A78BFA", label: "Violet" },
  { value: "#F472B6", label: "Pink" },
  { value: "#34D399", label: "Emerald" },
];

function ColorPicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <div className="flex items-center gap-1.5 flex-wrap">
        {COLOR_SWATCHES.map((c) => (
          <button
            key={c.value}
            onClick={() => onChange(c.value)}
            title={c.label}
            className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
              value === c.value ? "border-primary scale-110 shadow-md" : "border-transparent"
            }`}
            style={{
              backgroundColor: c.value,
              boxShadow: c.value === "#FFFFFF" ? "inset 0 0 0 1px #e2e8f0" : undefined,
            }}
          />
        ))}
        <Input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-7 h-7 p-0.5 rounded-full cursor-pointer border-2 border-transparent"
          title="Custom color"
        />
      </div>
    </div>
  );
}

export default function StyleSelectionStep({ onNext, onPrev, onDataUpdate, videoData }: StyleSelectionStepProps) {
  const [style, setStyle] = useState(videoData.style || "minimal");
  const [font, setFont] = useState(videoData.font || "Inter");
  const [textColor, setTextColor] = useState(videoData.textColor || "#FFFFFF");
  const [highlightColor, setHighlightColor] = useState(videoData.highlightColor || "#FFD700");
  const [saving, setSaving] = useState(false);

  const handleNext = async () => {
    try {
      if (videoData.lyricVideoId) {
        setSaving(true);
        await updateLyricVideoClient(videoData.lyricVideoId, { style, font, textColor, highlightColor });
      }
      onDataUpdate({ style, font, textColor, highlightColor });
      onNext();
    } catch {
      toast.error("Failed to save style. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-semibold">Style</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose a text animation and customize how your lyrics look.
        </p>
      </div>

      {/* Animation presets */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Animation</Label>
        <div className="grid grid-cols-2 gap-3">
          {ANIMATIONS.map((anim) => (
            <button
              key={anim.id}
              onClick={() => setStyle(anim.id)}
              className={`relative text-left rounded-xl border-2 p-4 transition-all ${
                style === anim.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40 hover:bg-accent/20"
              }`}
            >
              {style === anim.id && (
                <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
              )}
              <div className="text-xl mb-2 text-muted-foreground">{anim.icon}</div>
              <p className="font-medium text-sm">{anim.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{anim.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Font */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Font</Label>
        <Select value={font} onValueChange={setFont}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {FONTS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                <div className="flex items-center justify-between gap-8 w-full">
                  <span style={{ fontFamily: f.value }}>{f.label}</span>
                  <span className="text-xs text-muted-foreground">{f.sample}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-5">
        <ColorPicker value={textColor} onChange={setTextColor} label="Text Color" />
        <ColorPicker value={highlightColor} onChange={setHighlightColor} label="Highlight Color" />
      </div>

      {/* Live preview */}
      <div className="rounded-xl border bg-[#0f0f1a] px-6 py-8 text-center">
        <p
          className="text-xl font-semibold leading-relaxed transition-all"
          style={{ fontFamily: font, color: textColor }}
        >
          Your lyrics will look{" "}
          <span style={{ color: highlightColor }}>like this</span>
        </p>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={saving}>
          {saving ? "Saving..." : "Next: Background"}
        </Button>
      </div>
    </div>
  );
}
