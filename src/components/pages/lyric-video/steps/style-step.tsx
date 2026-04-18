"use client";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

/**
 * Mirror of the FONTS whitelist in services/lyricVideoPresets.js.
 * `id` MUST match backend ids byte-for-byte. `css` is a best-effort web stack
 * that approximates how the font will look once libass renders it server-side;
 * exact matching isn't possible (the render host's installed font is what
 * actually ships in the MP4), so this is preview-only.
 */
const FONTS = [
  { id: "dejavu_sans",      label: "DejaVu Sans",      css: '"DejaVu Sans", "Liberation Sans", Arial, sans-serif' },
  { id: "dejavu_serif",     label: "DejaVu Serif",     css: '"DejaVu Serif", "Liberation Serif", "Times New Roman", serif' },
  { id: "liberation_sans",  label: "Liberation Sans",  css: '"Liberation Sans", Arial, sans-serif' },
  { id: "liberation_serif", label: "Liberation Serif", css: '"Liberation Serif", "Times New Roman", serif' },
  { id: "noto_sans",        label: "Noto Sans",        css: '"Noto Sans", sans-serif' },
] as const;

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

// Backend defaults — keep these in sync with services/lyricRenderer.js.
const DEFAULT_FONT_ID = "dejavu_sans";
const DEFAULT_TEXT_COLOR = "#FFFFFF";
const DEFAULT_HIGHLIGHT_COLOR = "#FFD700";

const SAMPLE_LINE = "Sample lyric text";

interface StyleStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: {
    textColor?: string;
    highlightColor?: string;
    font?: string;
  }) => void;
  videoData: {
    textColor?: string;
    highlightColor?: string;
    font?: string;
  };
}

export default function StyleStep({ onNext, onPrev, onDataUpdate, videoData }: StyleStepProps) {
  const fontId = videoData.font || DEFAULT_FONT_ID;
  const textColor = HEX_RE.test(videoData.textColor || "") ? (videoData.textColor as string) : DEFAULT_TEXT_COLOR;
  const highlightColor = HEX_RE.test(videoData.highlightColor || "")
    ? (videoData.highlightColor as string)
    : DEFAULT_HIGHLIGHT_COLOR;

  const selectedFontCss = useMemo(() => {
    const match = FONTS.find((f) => f.id === fontId);
    return match ? match.css : FONTS[0].css;
  }, [fontId]);

  const previewStyle = useMemo<React.CSSProperties>(() => ({
    fontFamily: selectedFontCss,
    color: textColor,
    // Layered text-shadow approximates libass's 4px outline around the glyphs.
    textShadow: [
      `-2px -2px 0 ${highlightColor}`,
      ` 2px -2px 0 ${highlightColor}`,
      `-2px  2px 0 ${highlightColor}`,
      ` 2px  2px 0 ${highlightColor}`,
    ].join(", "),
  }), [selectedFontCss, textColor, highlightColor]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Style the text</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Pick the font and colors. A preview updates as you go.
        </p>
      </div>

      {/* Live preview */}
      <div className="rounded-lg border border-border bg-[#0a0a0f] overflow-hidden">
        <div className="py-10 px-6 flex items-center justify-center">
          <div
            className="text-3xl sm:text-4xl font-bold text-center leading-tight break-words"
            style={previewStyle}
          >
            {SAMPLE_LINE}
          </div>
        </div>
      </div>

      {/* Font picker */}
      <div>
        <h3 className="text-sm font-medium mb-3">Font</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {FONTS.map((f) => {
            const isSelected = fontId === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onDataUpdate({ font: f.id })}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <span className="text-base" style={{ fontFamily: f.css }}>
                  {f.label}
                </span>
                {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Text color */}
      <div>
        <h3 className="text-sm font-medium mb-3">Text color</h3>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={textColor}
            onChange={(e) => onDataUpdate({ textColor: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer border border-border bg-transparent"
            aria-label="Pick text color"
          />
          <input
            type="text"
            value={videoData.textColor ?? ""}
            onChange={(e) => {
              const v = e.target.value.trim();
              if (v === "") onDataUpdate({ textColor: undefined });
              else if (v.length <= 7) onDataUpdate({ textColor: v });
            }}
            placeholder={DEFAULT_TEXT_COLOR}
            maxLength={7}
            className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm font-mono"
          />
        </div>
      </div>

      {/* Outline color (backend field: highlightColor) */}
      <div>
        <h3 className="text-sm font-medium mb-1">Outline color</h3>
        <p className="text-xs text-muted-foreground mb-3">
          Draws a border around every letter — high contrast makes lyrics legible on any background.
        </p>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={highlightColor}
            onChange={(e) => onDataUpdate({ highlightColor: e.target.value })}
            className="w-12 h-10 rounded cursor-pointer border border-border bg-transparent"
            aria-label="Pick outline color"
          />
          <input
            type="text"
            value={videoData.highlightColor ?? ""}
            onChange={(e) => {
              const v = e.target.value.trim();
              if (v === "") onDataUpdate({ highlightColor: undefined });
              else if (v.length <= 7) onDataUpdate({ highlightColor: v });
            }}
            placeholder={DEFAULT_HIGHLIGHT_COLOR}
            maxLength={7}
            className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm font-mono"
          />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <Button variant="ghost" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} className="px-6">
          Next: Preview
        </Button>
      </div>
    </div>
  );
}
