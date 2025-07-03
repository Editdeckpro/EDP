"use client";
import { GenerateFormSchemaType } from "@/schemas/generate-schema";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  CircleDot,
  Drama,
  SquareMousePointer,
  UserRound,
} from "lucide-react";
import ColorPaletteModal from "../modals/colors-modal";
import MoodModal from "../modals/mood-modal";
import VisualStyleModal from "../modals/visual-modal";

export default function GenerationForm() {
  const { control, setValue, trigger } =
    useFormContext<GenerateFormSchemaType>();
  const [sectionsOpen, setSectionsOpen] = useState({
    generalSetting: true,
    otherSettings: true,
    style: true,
  });

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleVisualStyleSelect = (styleName: string) => {
    setValue("visualStyles", styleName);
    trigger("visualStyles");
  };

  const handleColorSelect = (color: string) => {
    setValue("colorPalette", color);
    trigger("colorPalette");
  };

  const handleMoodSelect = (mood: string) => {
    setValue("mood", mood);
    trigger("mood");
  };

  return (
    <>
      {/* General Stings Section */}
      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("generalSetting")}
        >
          <h3 className="text-lg font-medium">General Settings</h3>
          <Button variant="link" size="icon" type="button">
            {sectionsOpen.generalSetting ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </Button>
        </div>

        {sectionsOpen.generalSetting && (
          <div className="space-y-3">
            <FormField
              control={control}
              name="albumSongName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Album Song Name"
                      {...field}
                      icon={<CircleDot className="text-muted-foreground" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="artistName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Artist Name"
                      {...field}
                      icon={<UserRound className="text-muted-foreground" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Genre"
                      {...field}
                      icon={<Drama className="text-muted-foreground" />}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="elements"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Elements"
                      {...field}
                      icon={
                        <SquareMousePointer className="text-muted-foreground" />
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Style settings */}
      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("style")}
        >
          <h3 className="text-lg font-medium">Style</h3>
          <Button variant="link" size="icon" type="button">
            {sectionsOpen.style ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </Button>
        </div>

        {sectionsOpen.style && (
          <div className="space-y-3">
            <FormField
              control={control}
              name="visualStyles"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <VisualStyleModal
                      onSelect={handleVisualStyleSelect}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MoodModal
                      onSelect={handleMoodSelect}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="colorPalette"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ColorPaletteModal
                      onSelect={handleColorSelect}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </>
  );
}
