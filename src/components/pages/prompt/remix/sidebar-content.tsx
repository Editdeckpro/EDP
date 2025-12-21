"use client";
import GIcon from "@/components/g-icon";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { apiProviderSelect, cn, fileToBase64 } from "@/lib/utils";
import { remixFormSchema, RemixFormSchemaType } from "@/schemas/remix-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronDown,
  ChevronUp,
  CircleDot,
  Drama,
  Info,
  Sparkles,
  SquareMousePointer,
  Upload,
  UserRound,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { FC, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { SetRemixResType } from ".";
import { remixFormDataSubmit } from "./request";
import { elementSuggestions, genreSuggestions } from "../generate/generation-form/generation-form";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface RemixSidebarContentProps {
  setData: SetRemixResType;
  imageUrl?: string | null;
  setPrompt: (e: string) => void;
  setPageBase64: (e: string) => void;
}

const RemixSidebarContent: FC<RemixSidebarContentProps> = ({ setData, imageUrl, setPrompt, setPageBase64 }) => {
  const hasValidUrl = imageUrl !== null;
  const [customPromptOpen, setCustomPromptOpen] = useState<boolean>(true);
  const [imageGuidancesOpen, setImageGuidanceOpen] = useState<boolean>(!hasValidUrl);
  const [generalSettingOpen, setGeneralSettingOpen] = useState<boolean>(true);
  const [imageSimilarityOpen, setImageSimilarityOpen] = useState<boolean>(true);
  const [modelOpen, setModelOpen] = useState<boolean>(true);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { status, data, update } = useSession();

  const form = useForm<RemixFormSchemaType>({
    resolver: zodResolver(remixFormSchema),
    defaultValues: {
      albumSongName: "",
      artistName: "",
      genre: "",
      elements: "",
      customPrompt: "",
      imageSimilarity: 10,
      referenceImage: undefined,
      imageUrl: imageUrl || null,
      apiProvider: "openai",
    },
  });
  const watchedValues = useWatch({
    control: form.control,
    name: ["albumSongName", "artistName", "genre", "elements"], // only watch needed fields
  });

  async function onSubmit(values: RemixFormSchemaType) {
    if (data?.user.credits === 0) {
      toast.error("Please upgrade your plan to generate images", {
        description: "You have no credits left",
      });
      return;
    }
    try {
      setIsSubmitting(true);
      setData("loading");
      setPrompt(values.customPrompt);
      const data = await remixFormDataSubmit(values);
      setIsSubmitting(false);

      if (data === "error") {
        toast.error("Something went wrong", {
          description: "Please try submitting form again",
        });
        form.reset();
        return;
      } else {
        update();
      }
      setData(data);
    } catch (err) {
      console.log(err);

      setIsSubmitting(false);
      toast.error("Something went wrong", {
        description: "Please try submitting form again",
      });
      setData(null);
      form.reset();
      return;
    }
  }

  useEffect(() => {
    const updateField = () => {
      const [albumSongName, artistName, genre, elements] = watchedValues;

      const lines: string[] = [];

      if (albumSongName && artistName) {
        lines.push(
          `Generate a visually striking music album cover for a music project named ${albumSongName} by ${artistName}.`
        );
      }
      if (genre) {
        lines.push(`The style should be ${genre}.`);
      }
      if (elements) {
        lines.push(`The scene should feature ${elements} with a focus on rich details.`);
      }

      // lines.push(`This artwork is designed for music album covers for streaming platforms and vinyl releases.`);

      const template = lines.join("\n");
      form.setValue("customPrompt", template);
    };
    updateField();
  }, [watchedValues, form]);

  return (
    <>
      <h1 className="text-lg font-bold">Remix Image</h1>
      <Separator />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* General Stings Section */}
          <div className="space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setGeneralSettingOpen((pre) => !pre)}
            >
              <h3 className="text-lg font-medium">General Settings</h3>
              <Button variant="link" size="icon" type="button">
                {generalSettingOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            </div>

            {generalSettingOpen && (
              <div className="space-y-3">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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
                              // trigger("genre");
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
                  control={form.control}
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
                              // trigger("elements");
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
          <div className="space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setImageGuidanceOpen(!imageGuidancesOpen)}
            >
              <h3 className="text-lg font-medium">Image Guidance</h3>
              <Button variant="link" size="icon" type="button">
                {imageGuidancesOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            </div>

            {imageGuidancesOpen && (
              <FormField
                control={form.control}
                name="referenceImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="outline-muted-foreground outline-dashed outline">
                      <Input
                        type="file"
                        icon={<Upload className="text-primary size-5" />}
                        accept="image/jpeg, image/webp, image/png"
                        disabled={hasValidUrl}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await fileToBase64(file);
                            setImageBase64(base64);
                            setPageBase64(base64);
                            field.onChange(file); // pass File to RHF
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-2">
            <h2 className="font-bold text-lg">Image to be Remixed</h2>
            <div className="p-2 bg-muted rounded-lg border border-primary/30 max-h-32">
              {(imageBase64 !== undefined && imageBase64 !== "" && imageUrl != "") || hasValidUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageBase64 || imageUrl || undefined}
                  width={45}
                  height={45}
                  alt={"Remix Image Preview"}
                  className="rounded-sm max-h-full"
                />
              ) : (
                <div className="text-center text-muted-foreground font-light">Preview of selected image</div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setCustomPromptOpen(!customPromptOpen)}
            >
              <h3 className="text-lg font-medium text-primary">Custom Prompt</h3>
              <Button variant="link" size="icon" type="button">
                {customPromptOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            </div>

            {customPromptOpen && (
              <FormField
                control={form.control}
                name="customPrompt"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Textarea
                          placeholder="Write custom prompt..."
                          className={cn(
                            "min-h-[120px] max-w-full resize-none bg-gray-50 text-gray-600",
                            field.value === "" && "pl-8"
                          )}
                          {...field}
                        />
                        {field.value === "" && <Sparkles className="text-primary size-4 absolute top-3 left-3" />}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setModelOpen((v) => !v)}>
              <h3 className="text-lg font-medium">AI Model</h3>
              <Button variant="link" size="icon" type="button">
                {modelOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            </div>

            {modelOpen && (
              <FormField
                control={form.control}
                name="apiProvider"
                render={({ field }) => (
                  <FormItem>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select a image generation model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="w-full p-2">
                        {apiProviderSelect.map((val) => {
                          const isSelected = field.value === val.value;
                          return (
                            <SelectItem 
                              key={val.value} 
                              value={val.value}
                              className={cn(
                                "font-semibold border-2 rounded-lg my-1 transition-all duration-200",
                                // Default/unselected state
                                !isSelected && "border-gray-200 bg-white",
                                // Enhanced hover state
                                "hover:border-primary hover:bg-primary/12 hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5",
                                "hover:!text-gray-900 dark:hover:!text-gray-100",
                                // Focus/highlighted state (keyboard navigation)
                                "focus:border-primary focus:bg-primary/12 focus:ring-2 focus:ring-primary/25 focus:shadow-md focus:scale-[1.02] focus:-translate-y-0.5",
                                "data-[highlighted]:border-primary data-[highlighted]:bg-primary/12 data-[highlighted]:ring-2 data-[highlighted]:ring-primary/25 data-[highlighted]:shadow-md data-[highlighted]:scale-[1.02] data-[highlighted]:-translate-y-0.5",
                                "data-[highlighted]:!text-gray-900 dark:data-[highlighted]:!text-gray-100",
                                // Selected state - more prominent with darker text
                                isSelected && "border-primary bg-primary/15 shadow-md font-bold !text-gray-950 dark:!text-white",
                                // Make checkmark more prominent when visible
                                "[&_svg[class*='lucide-check']]:text-primary [&_svg[class*='lucide-check']]:size-5 [&_svg[class*='lucide-check']]:stroke-[2.5]"
                              )}
                            >
                              {val.name}
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          {form.watch("apiProvider") === "ideogram" && (
            <div className="space-y-3 pb-2">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setImageSimilarityOpen(!imageSimilarityOpen)}
              >
                <h3 className="text-lg font-medium">Image Similarity</h3>
                <Button variant="link" size="icon" type="button">
                  {imageSimilarityOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </Button>
              </div>

              {imageSimilarityOpen && (
                <FormField
                  control={form.control}
                  name="imageSimilarity"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div>
                          <span className="text-xs font-thin">{form.getValues("imageSimilarity")}% Similarity</span>
                          <Slider
                            className="mt-2"
                            value={[field.value]}
                            onValueChange={(val) => field.onChange(val[0])}
                            max={100}
                            step={1}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={isSubmitting}
            disabled={isSubmitting || status !== "authenticated" || data.user.credits === 0}
          >
            Remix Image <GIcon>wand_stars</GIcon>
          </Button>
        </form>
      </Form>
    </>
  );
};
export default RemixSidebarContent;
