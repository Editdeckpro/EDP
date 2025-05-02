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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  customFormSchema,
  CustomFormSchemaType,
} from "@/schemas/custom-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { SetGenerateResType } from ".";
import { customFormDataSubmit } from "./request";
import { toast } from "sonner";

interface CustomFormProps {
  setData: SetGenerateResType;
}

const CustomForm: FC<CustomFormProps> = ({ setData }) => {
  const [customPromptOpen, setCustomPromptOpen] = useState(true);
  const [otherSettingsOpen, setOtherSettingsOpen] = useState(true);

  const form = useForm<CustomFormSchemaType>({
    resolver: zodResolver(customFormSchema),
    defaultValues: {
      customPrompt: "",
      numberOfImages: 4,
      includeTextInImage: false,
    },
  });

  async function onSubmit(values: CustomFormSchemaType) {
    try {
      const data = await customFormDataSubmit(values);

      if (data === "error") {
        toast.error("Something went wrong", {
          description: "Please try submitting form again",
        });
        form.reset();
        return;
      }
      setData(data);
    } catch (err) {
      console.log(err);

      toast.error("Something went wrong", {
        description: "Please try submitting form again",
      });
      form.reset();
      return;
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Custom Prompt Section */}
        <div className="space-y-3">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setCustomPromptOpen(!customPromptOpen)}
          >
            <h3 className="text-lg font-medium">Custom Prompt</h3>
            <Button variant="link" size="icon" type="button">
              {customPromptOpen ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
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
                      {field.value === "" && (
                        <Sparkles className="text-primary size-4 absolute top-3 left-3" />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

              <div className="flex items-center justify-between">
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
              </div>
            </div>
          )}
        </div>

        <Button type="submit" className="w-full">
          Generate Images <GIcon>wand_stars</GIcon>
        </Button>
      </form>
    </Form>
  );
};
export default CustomForm;
