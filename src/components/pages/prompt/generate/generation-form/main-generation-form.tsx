"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiProviderSelect, cn } from "@/lib/utils";
import { MainGenerateFormSchemaType } from "@/schemas/generate-schema";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const MainGenerateForm = () => {
  const { control, watch, setValue } =
    useFormContext<MainGenerateFormSchemaType>();

  const [sectionsOpen, setSectionsOpen] = useState({
    generalSetting: true,
    otherSettings: true,
    customPrompt: true,
    model: true,
    style: true,
  });

  const toggleSection = (section: keyof typeof sectionsOpen) => {
    setSectionsOpen((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      {/* Other Settings Section */}
      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("otherSettings")}
        >
          <h3 className="text-lg font-medium">Other Settings</h3>
          <Button variant="link" size="icon" type="button">
            {sectionsOpen.otherSettings ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </Button>
        </div>

        {sectionsOpen.otherSettings && (
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
                      watch("numberOfImages") === number ? "default" : "outline"
                    }
                    className={`flex-1 ${
                      watch("numberOfImages") === number
                        ? "bg-primary hover:bg-primary/50"
                        : "hover:bg-primary/50"
                    }`}
                    onClick={() => setValue("numberOfImages", number)}
                  >
                    {number}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("model")}
        >
          <h3 className="text-lg font-medium">AI Model</h3>
          <Button variant="link" size="icon" type="button">
            {sectionsOpen.model ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </Button>
        </div>

        {sectionsOpen.model && (
          <FormField
            control={control}
            name="apiProvider"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a image generation model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="w-full">
                    {apiProviderSelect.map((val) => (
                      <SelectItem key={val.value} value={val.value}>
                        {val.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <div className="space-y-3">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={() => toggleSection("customPrompt")}
        >
          <h3 className="text-lg font-medium ">Custom Prompt</h3>
          <Button variant="link" size="icon" type="button">
            {sectionsOpen.customPrompt ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </Button>
        </div>

        {sectionsOpen.customPrompt && (
          <FormField
            control={control}
            name="customPrompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Textarea
                      placeholder="Write custom prompt..."
                      className={cn(
                        "min-h-[120px] resize-none bg-gray-50 text-gray-600 whitespace-pre-wrap break-words",
                        field.value === "" && "pl-8"
                        // This can be use to control textarea overflow width
                        // "max-w-[90dvw] md:max-w-[12rem] xl:max-w-3xs",
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
    </>
  );
};
export default MainGenerateForm;
