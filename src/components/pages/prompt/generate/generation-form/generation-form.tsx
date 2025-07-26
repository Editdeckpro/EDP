"use client";
import { GenerateFormSchemaType } from "@/schemas/generate-schema";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { FormControl, FormDescription, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, CircleDot, Drama, Info, SquareMousePointer, UserRound } from "lucide-react";
import ColorPaletteModal from "../modals/colors-modal";
import MoodModal from "../modals/mood-modal";
import VisualStyleModal from "../modals/visual-modal";

const genreSuggestions = ["Synthwave", "Lo-fi", "Jazz", "Cyberpunk", "Dark Fantasy", "Vaporwave", "Classical", "Retro"];

const elementSuggestions = [
  "Neon lights",
  "City skyline",
  "Spaceship",
  "Mountains",
  "Abstract shapes",
  "Galaxy",
  "Forest",
  "Street art",
];

export default function GenerationForm() {
  const { control, setValue, trigger } = useFormContext<GenerateFormSchemaType>();
  const [customStyles, setCustomStyles] = useState<string[]>([]);
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

  const handleVisualStyleSelect = (styleNames: string[]) => {
    setValue("visualStyles", styleNames);
    trigger("visualStyles");
  };

  const handleColorSelect = (color: string[]) => {
    setValue("colorPalette", color);
    trigger("colorPalette");
  };

  const handleMoodSelect = (mood: string[]) => {
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
            {sectionsOpen.generalSetting ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>

        {sectionsOpen.generalSetting && (
          <div className="space-y-3">
            <FormField
              control={control}
              name="albumSongName"
              render={({ field }) => (
                <FormItem>
                  <div className="relative w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Album Song Name"
                        icon={<CircleDot className="text-muted-foreground" />}
                        className="pr-10"
                      />
                    </FormControl>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-64 w-[calc(100%)] text-center" side="right">
                          {'The name of your music project or album (e.g., "Neon Dreams").'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Artist Name */}
            <FormField
              control={control}
              name="artistName"
              render={({ field }) => (
                <FormItem>
                  <div className="relative w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Artist Name"
                        icon={<UserRound className="text-muted-foreground" />}
                        className="pr-10"
                      />
                    </FormControl>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-64 w-[calc(100%)] text-center" side="right">
                          {'Name of the artist or band (e.g., "The Synth Lords").'}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Genre */}
            <FormField
              control={control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <div className="relative w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Genre"
                        icon={<Drama className="text-muted-foreground" />}
                        className="pr-10"
                      />
                    </FormControl>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-64 w-[calc(100%)] text-center" side="right">
                          Enter the music genre (e.g., Synthwave, Jazz, Hip-Hop).
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Suggested Genre Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {genreSuggestions.map((g) => (
                      <Button
                        key={g}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          field.onChange(g);
                          trigger("genre");
                        }}
                      >
                        {g}
                      </Button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Elements */}
            <FormField
              control={control}
              name="elements"
              render={({ field }) => (
                <FormItem>
                  <div className="relative w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Elements"
                        icon={<SquareMousePointer className="text-muted-foreground" />}
                        className="pr-10"
                      />
                    </FormControl>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-64 w-[calc(100%)] text-center" side="right">
                          Describe specific visual elements to include (e.g., neon lights, desert, spaceship).
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Suggested Element Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {elementSuggestions.map((el) => (
                      <Button
                        key={el}
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                          field.onChange(el);
                          trigger("elements");
                        }}
                      >
                        {el}
                      </Button>
                    ))}
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
      </div>

      {/* Style settings */}
      <div className="space-y-3">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleSection("style")}>
          <h3 className="text-lg font-medium">Style</h3>
          <Button variant="link" size="icon" type="button">
            {sectionsOpen.style ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
                      customStyles={customStyles}
                      setCustomStyles={setCustomStyles}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="font-normal text-xs">
                    Choose a visual style (e.g. photo, poster).
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="mood"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <MoodModal onSelect={handleMoodSelect} value={field.value} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="font-normal text-xs">
                    Select the mood/emotion (e.g., Whimsical, Serene).
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="colorPalette"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ColorPaletteModal onSelect={handleColorSelect} value={field.value} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription className="font-normal text-xs">Choose a dominant color scheme.</FormDescription>
                </FormItem>
              )}
            />
          </div>
        )}
      </div>
    </>
  );
}
