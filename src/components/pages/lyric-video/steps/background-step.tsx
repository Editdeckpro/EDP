"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

/**
 * Mirror of services/lyricVideoPresets.js on the backend.
 * Keep the `id` values byte-identical — the backend validates against them
 * and falls back to the default if an unknown id is sent.
 *
 * `thumbnailColor` is a representative hex for the tile; the actual rendered
 * background may be an animated gradient or pattern, not a solid.
 */
const PRESETS = [
  { id: "midnight_blue", label: "Midnight Blue", thumbnailColor: "#3a1a6a" },
  { id: "deep_space",    label: "Deep Space",    thumbnailColor: "#05070f" },
  { id: "warm_gradient", label: "Warm Ember",    thumbnailColor: "#5a2010" },
  { id: "sunset_fade",   label: "Sunset Fade",   thumbnailColor: "#2a0a1a" },
  { id: "neon_grid",     label: "Neon Grid",     thumbnailColor: "#1a1540" },
] as const;

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

interface BackgroundStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: {
    backgroundPreset?: string;
    backgroundColor?: string;
  }) => void;
  videoData: {
    backgroundPreset?: string;
    backgroundColor?: string;
  };
}

export default function BackgroundStep({ onNext, onPrev, onDataUpdate, videoData }: BackgroundStepProps) {
  const selectedPreset = videoData.backgroundPreset;
  const customColor = videoData.backgroundColor;
  const customActive = !selectedPreset && typeof customColor === "string" && HEX_RE.test(customColor);

  const pickPreset = (id: string) => {
    onDataUpdate({ backgroundPreset: id, backgroundColor: undefined });
  };

  const pickCustom = () => {
    const starting = HEX_RE.test(customColor || "") ? (customColor as string) : "#1a1a1a";
    onDataUpdate({ backgroundPreset: undefined, backgroundColor: starting });
  };

  const setCustomColor = (hex: string) => {
    onDataUpdate({ backgroundPreset: undefined, backgroundColor: hex });
  };

  const canAdvance = useMemo(() => {
    // Every case is valid: a preset, a well-formed hex, or nothing (backend
    // falls back to the default preset). "Next" is never blocked here.
    return true;
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Pick a background</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose one of the curated looks, or drop in your own color.
        </p>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Presets</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PRESETS.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => pickPreset(p.id)}
                className={`group relative rounded-lg overflow-hidden border-2 transition-all text-left ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <div
                  className="aspect-video w-full"
                  style={{ backgroundColor: p.thumbnailColor }}
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between px-3 py-2 bg-card">
                  <span className="text-sm font-medium">{p.label}</span>
                  {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Or use a custom color</h3>
        <button
          type="button"
          onClick={pickCustom}
          className={`w-full rounded-lg border-2 p-4 flex items-center gap-4 transition-all text-left ${
            customActive
              ? "border-primary ring-2 ring-primary/30"
              : "border-border hover:border-primary/40"
          }`}
        >
          <div
            className="w-12 h-12 rounded-md border border-border shrink-0"
            style={{ backgroundColor: customActive ? customColor : "#1a1a1a" }}
            aria-hidden="true"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">
              {customActive ? "Custom color" : "Use a custom color"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {customActive ? (customColor as string).toUpperCase() : "Solid hex (e.g. #1a1a1a)"}
            </p>
          </div>
          {customActive && <Check className="w-4 h-4 text-primary shrink-0" />}
        </button>

        {customActive && (
          <div className="mt-3 flex items-center gap-3">
            <input
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-12 h-10 rounded cursor-pointer border border-border bg-transparent"
              aria-label="Pick background color"
            />
            <input
              type="text"
              value={customColor}
              onChange={(e) => {
                const v = e.target.value.trim();
                if (HEX_RE.test(v)) setCustomColor(v);
                else if (v.length <= 7) setCustomColor(v);
              }}
              placeholder="#1a1a1a"
              maxLength={7}
              className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm font-mono"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!canAdvance} className="px-6">
          Next: Style
        </Button>
      </div>
    </div>
  );
}
