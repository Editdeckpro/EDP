"use client";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
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
          <h3 className="text-lg font-medium">Choose Your Style</h3>
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
                <FormControl>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {apiProviderSelect.map((val) => {
                      const isSelected = field.value === val.value;
                      return (
                        <Button
                          key={val.value}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "flex-1 min-w-0 font-semibold border-2 transition-all duration-200",
                            isSelected && "bg-primary hover:bg-primary/90 shadow-md border-primary",
                            !isSelected && "hover:border-primary hover:bg-primary/10 border-gray-200"
                          )}
                          onClick={() => field.onChange(val.value)}
                        >
                          {val.name}
                        </Button>
                      );
                    })}
                  </div>
                </FormControl>
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
