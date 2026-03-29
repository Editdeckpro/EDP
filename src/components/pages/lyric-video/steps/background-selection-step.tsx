"use client";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  updateLyricVideoClient,
  uploadBackgroundImageClient,
  generateBackgroundImageClient,
} from "@/components/pages/lyric-video/api";
import { toast } from "sonner";
import { Upload, Sparkles, Loader2, Check, Palette, ImageIcon } from "lucide-react";
import Image from "next/image";

type LyricVideoWizardData = {
  lyricVideoId?: number;
  backgroundColor?: string;
  backgroundImage?: string;
};

interface BackgroundSelectionStepProps {
  onNext: () => void;
  onPrev: () => void;
  onDataUpdate: (data: Partial<LyricVideoWizardData>) => void;
  videoData: LyricVideoWizardData;
}

type BgMode = "solid" | "image" | "ai";

const SOLID_COLORS = [
  { value: "#000000", label: "Black" },
  { value: "#0f0f1a", label: "Midnight" },
  { value: "#1a0a2e", label: "Deep Purple" },
  { value: "#0a1628", label: "Navy" },
  { value: "#1a1a1a", label: "Dark Gray" },
  { value: "#2d1b69", label: "Violet" },
  { value: "#1f2937", label: "Slate" },
  { value: "#7c3aed", label: "Purple" },
];

export default function BackgroundSelectionStep({
  onNext,
  onPrev,
  onDataUpdate,
  videoData,
}: BackgroundSelectionStepProps) {
  const [mode, setMode] = useState<BgMode>(videoData.backgroundImage ? "image" : "solid");
  const [solidColor, setSolidColor] = useState(videoData.backgroundColor || "#000000");
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(videoData.backgroundImage || null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiImageUrl, setAiImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleImageUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image must be under 10MB");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadBackgroundImageClient(file);
      setUploadedImageUrl(result.imageUrl);
      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }, []);

  const handleGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Enter a description first");
      return;
    }
    if (!videoData.lyricVideoId) {
      toast.error("No project found");
      return;
    }
    setGenerating(true);
    try {
      const result = await generateBackgroundImageClient(videoData.lyricVideoId, aiPrompt.trim());
      setAiImageUrl(result.imageUrl);
      toast.success("Background generated");
    } catch {
      toast.error("Generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleNext = async () => {
    let bgColor: string | undefined;
    let bgImage: string | null | undefined;

    if (mode === "solid") {
      bgColor = solidColor;
      bgImage = null;
    } else if (mode === "image") {
      bgImage = uploadedImageUrl;
    } else {
      bgImage = aiImageUrl;
    }

    try {
      if (videoData.lyricVideoId) {
        setSaving(true);
        await updateLyricVideoClient(videoData.lyricVideoId, {
          backgroundColor: bgColor,
          backgroundImage: bgImage,
        });
      }
      onDataUpdate({ backgroundColor: bgColor, backgroundImage: bgImage ?? undefined });
      onNext();
    } catch {
      toast.error("Failed to save background.");
    } finally {
      setSaving(false);
    }
  };

  const canProceed =
    mode === "solid" ||
    (mode === "image" && Boolean(uploadedImageUrl)) ||
    (mode === "ai" && Boolean(aiImageUrl));

  const previewImage = mode === "image" ? uploadedImageUrl : mode === "ai" ? aiImageUrl : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Background</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Choose what appears behind your lyrics.
        </p>
      </div>

      {/* Mode tabs */}
      <div className="grid grid-cols-3 gap-3">
        {(
          [
            { id: "solid" as BgMode, icon: <Palette className="w-4 h-4" />, label: "Solid Color" },
            { id: "image" as BgMode, icon: <ImageIcon className="w-4 h-4" />, label: "Album Cover" },
            { id: "ai" as BgMode, icon: <Sparkles className="w-4 h-4" />, label: "AI Generated" },
          ] as { id: BgMode; icon: React.ReactNode; label: string }[]
        ).map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={`flex flex-col items-center gap-2 py-4 px-3 rounded-xl border-2 transition-all ${
              mode === id
                ? "border-primary bg-primary/5"
                : "border-border hover:border-primary/40 hover:bg-accent/20"
            }`}
          >
            <div className={mode === id ? "text-primary" : "text-muted-foreground"}>{icon}</div>
            <span
              className={`text-sm font-medium leading-none ${
                mode === id ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
          </button>
        ))}
      </div>

      {/* Solid color */}
      {mode === "solid" && (
        <div className="space-y-4">
          <Label className="text-sm font-medium">Color</Label>
          <div className="flex flex-wrap gap-2">
            {SOLID_COLORS.map((c) => (
              <button
                key={c.value}
                onClick={() => setSolidColor(c.value)}
                title={c.label}
                className={`w-10 h-10 rounded-lg border-2 transition-all hover:scale-105 ${
                  solidColor === c.value ? "border-primary shadow-md scale-105" : "border-border"
                }`}
                style={{ backgroundColor: c.value }}
              />
            ))}
            <Input
              type="color"
              value={solidColor}
              onChange={(e) => setSolidColor(e.target.value)}
              className="w-10 h-10 p-1 rounded-lg border-2 border-border cursor-pointer"
              title="Custom color"
            />
          </div>
          <div
            className="w-full h-20 rounded-xl border border-border transition-colors"
            style={{ backgroundColor: solidColor }}
          />
        </div>
      )}

      {/* Image upload */}
      {mode === "image" && (
        <div className="space-y-3">
          <Label className="text-sm font-medium">Upload Image</Label>
          {previewImage ? (
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src={previewImage}
                alt="Background"
                width={800}
                height={200}
                className="w-full h-48 object-cover"
                unoptimized
              />
              <div className="absolute top-2.5 right-2.5 flex gap-2">
                <span className="bg-green-500/90 text-white text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Check className="w-3 h-3" /> Uploaded
                </span>
                <label className="bg-black/60 hover:bg-black/80 text-white text-xs px-2.5 py-1 rounded-full cursor-pointer transition-colors">
                  Replace
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          ) : (
            <label
              className={`flex flex-col items-center justify-center h-40 rounded-xl border-2 border-dashed cursor-pointer transition-colors ${
                uploading
                  ? "opacity-50 pointer-events-none"
                  : "border-border hover:border-primary/40 hover:bg-accent/20"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">Uploading...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-7 h-7 text-muted-foreground" />
                  <span className="text-sm font-medium">Upload album cover or image</span>
                  <span className="text-xs text-muted-foreground">JPG, PNG, WebP · Max 10MB</span>
                </div>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          )}
        </div>
      )}

      {/* AI generated */}
      {mode === "ai" && (
        <div className="space-y-4">
          <Label className="text-sm font-medium">Describe your background</Label>
          <Textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="e.g. cosmic nebula with purple and blue hues, abstract neon city at night, misty forest with golden rays..."
            className="resize-none"
            rows={3}
          />
          <Button
            onClick={handleGenerate}
            disabled={!aiPrompt.trim() || generating}
            variant="outline"
            className="w-full"
          >
            {generating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Generating...</>
            ) : (
              <><Sparkles className="w-4 h-4 mr-2" />Generate Background</>
            )}
          </Button>
          {aiImageUrl && (
            <div className="relative rounded-xl overflow-hidden">
              <Image
                src={aiImageUrl}
                alt="AI generated background"
                width={800}
                height={200}
                className="w-full h-48 object-cover"
                unoptimized
              />
              <span className="absolute top-2.5 right-2.5 bg-primary/90 text-primary-foreground text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Generated
              </span>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-1">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={!canProceed || saving}>
          {saving ? "Saving..." : "Next: Preview"}
        </Button>
      </div>
    </div>
  );
}
