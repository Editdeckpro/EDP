"use client";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { apiProviderSelect, cn } from "@/lib/utils";
import { MainGenerateFormSchemaType } from "@/schemas/generate-schema";
import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const MainGenerateForm = () => {
  const { control, watch, setValue } = useFormContext<MainGenerateFormSchemaType>();

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
      <div className="space-y-3 w-full p-1">
        <div
          className="flex items-center justify-between cursor-pointer w-full"
          onClick={() => toggleSection("otherSettings")}
        >
          <h3 className="text-lg font-medium">Other Settings</h3>
          <Button variant="link" size="icon" type="button">
            {sectionsOpen.otherSettings ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>

        {sectionsOpen.otherSettings && (
          <div className="pt-0 space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Number of Images to be Generated</p>
              <div className="flex gap-2 flex-wrap">
                {[1, 2, 3, 4].map((number) => (
                  <Button
                    key={number}
                    type="button"
                    variant={watch("numberOfImages") === number ? "default" : "outline"}
                    className={`flex-1 ${
                      watch("numberOfImages") === number ? "bg-primary hover:bg-primary/50" : "hover:bg-primary/50"
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
      <div className="space-y-3 w-full bg-gray-50/80 rounded-lg p-1 border border-gray-100">
        <div className="flex items-center justify-between cursor-pointer w-full" onClick={() => toggleSection("model")}>
          <h3 className="text-lg font-medium">AI Model</h3>
          <Button variant="link" size="icon" type="button">
            {sectionsOpen.model ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </Button>
        </div>

        {sectionsOpen.model && (
          <FormField
            control={control}
            name="apiProvider"
            render={({ field }) => (
              <FormItem>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl className="w-full">
                    <SelectTrigger className="bg-white border-2 border-primary/30 hover:border-primary/50 focus-visible:border-primary focus-visible:ring-primary/20 font-semibold shadow-sm">
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

      <div className="space-y-3 w-full p-1">
        <div className="flex items-center justify-between cursor-pointer w-full" onClick={() => toggleSection("customPrompt")}>
          <h3 className="text-lg font-medium ">Custom Prompt</h3>
          <Button variant="link" size="icon" type="button">
            {sectionsOpen.customPrompt ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
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
                    {field.value === "" && <Sparkles className="text-primary size-4 absolute top-3 left-3" />}
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
