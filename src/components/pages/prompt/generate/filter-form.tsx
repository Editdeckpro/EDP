"use client";
import GIcon from "@/components/g-icon";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  generateFilterFormSchema,
  GenerateFilterFormSchemaType,
} from "@/schemas/filter-schema";
import { zodResolver } from "@hookform/resolvers/zod";

// import { Switch } from "@/components/ui/switch";
import {
  ChevronDown,
  ChevronUp,
  CircleDot,
  Drama,
  SquareMousePointer,
  UserRound,
} from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { SetGenerateResType } from ".";
import ColorPaletteModal from "./modals/colors-modal";
import MoodModal from "./modals/mood-modal";
import VisualStyleModal from "./modals/visual-modal";
import { filterFormDataSubmit } from "./request";
import { toast } from "sonner";

interface GenerateFilterFormProps {
  setData: SetGenerateResType;
}

const GenerateFilterForm: FC<GenerateFilterFormProps> = ({ setData }) => {
  const [generalSettingOpen, setGeneralSettingOpen] = useState<boolean>(true);
  const [otherSettingsOpen, setOtherSettingsOpen] = useState<boolean>(true);
  const [styleOpen, setStyleOpen] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const form = useForm<GenerateFilterFormSchemaType>({
    resolver: zodResolver(generateFilterFormSchema),
    defaultValues: {
      albumSongName: "",
      artistName: "",
      colorPalette: "",
      genre: "",
      includeTextInImage: false,
      mood: "",
      numberOfImages: 1,
      visualStyles: "",
      elements: "",
    },
  });

  async function onSubmit(values: GenerateFilterFormSchemaType) {
    try {
      setIsSubmitting(true);
      setData("loading");
      const data = await filterFormDataSubmit(values);
      setIsSubmitting(false);

      if (data === "error") {
        toast.error("Something went wrong", {
          description: "Please try submitting form again",
        });
        form.reset();
        return;
      }
      setData(data);
      return;
    } catch (err) {
      setIsSubmitting(false);
      // console.log(err);
      toast.error("Something went wrong", {
        description: "Please try submitting form again",
      });
      form.reset();
      setData(null);
      return;
    }
  }

  const handleVisualStyleSelect = (styleName: string) => {
    form.setValue("visualStyles", styleName);
    form.trigger("visualStyles");
  };

  const handleColorSelect = (color: string) => {
    form.setValue("colorPalette", color);
    form.trigger("colorPalette");
  };

  const handleMoodSelect = (mood: string) => {
    form.setValue("mood", mood);
    form.trigger("mood");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Custom Prompt Section */}
        <div className="space-y-3">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setGeneralSettingOpen(!generalSettingOpen)}
          >
            <h3 className="text-lg font-medium">General Settings</h3>
            <Button variant="link" size="icon" type="button">
              {generalSettingOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </Button>
          </div>

          {generalSettingOpen && (
            <div className="space-y-3">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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
            onClick={() => setStyleOpen(!styleOpen)}
          >
            <h3 className="text-lg font-medium">Style</h3>
            <Button variant="link" size="icon" type="button">
              {styleOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </div>

          {styleOpen && (
            <div className="space-y-3">
              <FormField
                control={form.control}
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
                control={form.control}
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
                control={form.control}
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

        {/* Other Settings Section */}
        <div className="space-y-3">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setOtherSettingsOpen(!otherSettingsOpen)}
          >
            <h3 className="text-lg font-medium">Other Settings</h3>
            <Button variant="link" size="icon" type="button">
              {otherSettingsOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </Button>
          </div>

          {otherSettingsOpen && (
            <div className="pt-0 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Number of Images to be Generated
                </p>
                <div className="flex gap-2 flex-wrap">
                  {[1, 2, 3, 4].map((number) => (
                    <Button
                      key={number}
                      type="button"
                      variant={
                        form.watch("numberOfImages") === number
                          ? "default"
                          : "outline"
                      }
                      className={`flex-1 ${
                        form.watch("numberOfImages") === number
                          ? "bg-primary hover:bg-primary/50"
                          : "hover:bg-primary/50"
                      }`}
                      onClick={() => form.setValue("numberOfImages", number)}
                    >
                      {number}
                    </Button>
                  ))}
                </div>
              </div>

              {/* <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Include/Exclude Text in Image?
                </p>
                <FormField
                  control={form.control}
                  name="includeTextInImage"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div> */}
            </div>
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Generate Images <GIcon>wand_stars</GIcon>
        </Button>
      </form>
    </Form>
  );
};
export default GenerateFilterForm;
