"use client";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import {
  generateFormSchema,
  GenerateFormSchemaType,
  mainGenerateFormSchema,
  MainGenerateFormSchemaType,
} from "@/schemas/generate-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { FC, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetGenerateResType } from "..";
import { generateFormDataSubmit } from "../request";
import GenerateForm from "./generation-form";
import MainGenerateForm from "./main-generation-form";
import { ChevronDown, ChevronUp, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { fileToBase64 } from "@/lib/utils";

interface GenerateFormProps {
  setData: SetGenerateResType;
}

const GenerateFilterForm: FC<GenerateFormProps> = ({ setData }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data, status, update } = useSession();
  const bypassSubscription = Boolean(data?.user?.bypassSubscription);
  const generateFormRef = useRef<HTMLButtonElement | null>(null);
  const mainGenerateFormRef = useRef<HTMLButtonElement | null>(null);
  const [imageGuidancesOpen, setImageGuidanceOpen] = useState<boolean>(true);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);

  const generateForm = useForm<GenerateFormSchemaType>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      albumSongName: "",
      artistName: "",
      colorPalette: [],
      genre: "",
      mood: [],
      visualStyles: [],
      elements: "",
    },
  });

  const mainForm = useForm<MainGenerateFormSchemaType>({
    resolver: zodResolver(mainGenerateFormSchema),
    defaultValues: {
      numberOfImages: 1,
      apiProvider: "openai",
      customPrompt: "",
      referenceImage: undefined,
    },
  });

  const watchedValues = generateForm.watch();

  useEffect(() => {
    const updateField = () => {
      const albumSongName = watchedValues.albumSongName;
      const artistName = watchedValues.artistName;
      const genre = watchedValues.genre;
      const mood = watchedValues.mood;
      const elements = watchedValues.elements;
      const visualStyles = watchedValues.visualStyles;
      const colorPalette = watchedValues.colorPalette;

      const lines: string[] = [];

      if (albumSongName && artistName) {
        lines.push(
          `Generate a visually striking music album cover for a music project named ${albumSongName} by ${artistName}.`
        );
      }
      if (genre) {
        lines.push(`The style should be ${genre}.`);
      }
      if (mood) {
        lines.push(`It should evoke a sense of ${mood}.`);
      }
      if (elements) {
        lines.push(`The scene should feature ${elements} with a focus on rich details.`);
      }
      if (visualStyles) {
        lines.push(`The artwork must be highly detailed, ${visualStyles} and high-resolution.`);
      }

      if (colorPalette.length > 0) {
        lines.push(`Use these colors: ${colorPalette.join(colorPalette.length > 1 ? ", " : " ")}`);
      }

      lines.push(`This artwork is designed for music album covers for streaming platforms and vinyl releases.`);

      const template = lines.join("\n");

      mainForm.setValue("customPrompt", template);
    };
    updateField();
  }, [mainForm, watchedValues]);

  async function submitButtonClicked() {
    const isGenerateFormValid = await generateForm.trigger(); // triggers validation
    const isMainFormValid = await mainForm.trigger();

    if (!isGenerateFormValid || !isMainFormValid) {
      return;
    }
    if (generateFormRef.current) {
      generateFormRef.current.click();
    }
    if (mainGenerateFormRef.current) {
      mainGenerateFormRef.current.click();
    }
  }

  async function mainFormSubmit(values: MainGenerateFormSchemaType) {
    if (!bypassSubscription && data?.user.credits === 0) {
      toast.error("Please upgrade your plan to generate images", {
        description: "You have no credits left",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setData("loading");
      const data = await generateFormDataSubmit(values);
      setIsSubmitting(false);

      if (data === "insufficient_credits") {
        toast.error("Please upgrade your plan to generate images", {
          description: "You do not have enough credits for this request",
        });
        setData(null);
        return;
      }
      if (data === "error") {
        toast.error("Something went wrong", {
          description: "Please try submitting form again",
        });
        setData(null);
        return;
      } else {
        update(); // Update session to refresh user data
      }
      setData(data);
      return;
    } catch (err) {
      setIsSubmitting(false);
      console.log(err);
      toast.error("Something went wrong", {
        description: "Please try submitting form again",
      });
      setData(null);
      return;
    }
  }

  function generateFormSubmit(data: GenerateFormSchemaType) {
    //! This function is meant to be empty
    console.log(data);
  }

  return (
    <>
      <Form {...generateForm}>
        {/* {promptText} */}
        <form onSubmit={generateForm.handleSubmit(generateFormSubmit)} className="space-y-4">
          <GenerateForm />
          <button ref={generateFormRef} type="submit" className="hidden" aria-hidden />
        </form>
      </Form>
      <Form {...mainForm}>
        <form onSubmit={mainForm.handleSubmit(mainFormSubmit)} className="space-y-4 w-full">
          {/* referenceImage Upload */}
          <div className="space-y-3 w-full bg-gray-50/80 rounded-lg p-1 border border-gray-100">
            <div
              className="flex items-center justify-between cursor-pointer w-full"
              onClick={() => setImageGuidanceOpen(!imageGuidancesOpen)}
            >
              <h3 className="text-lg font-medium">Image Guidance</h3>
              <Button variant="link" size="icon" type="button">
                {imageGuidancesOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </Button>
            </div>

            {imageGuidancesOpen && (
              <FormField
                control={mainForm.control}
                name="referenceImage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl className="outline-muted-foreground outline-dashed outline">
                      <Input
                        type="file"
                        icon={<Upload className="text-primary size-5" />}
                        accept="image/jpeg, image/webp, image/png"
                        // disabled={hasValidUrl}
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await fileToBase64(file);
                            setImageBase64(base64);
                            // setPageBase64(base64);
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

          <div className="space-y-2 w-full">
            {/* <h2 className="font-bold text-lg">Image to be Remixed</h2> */}
            <div className="p-2 bg-muted rounded-lg border border-primary/30 max-h-32 flex items-center justify-center min-h-[80px]">
              {imageBase64 !== undefined && imageBase64 !== "" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageBase64 || undefined}
                  width={45}
                  height={45}
                  alt={"Remix Image Preview"}
                  className="rounded-sm max-h-full"
                />
              ) : (
                <div className="text-muted-foreground font-light text-sm">Preview of selected image</div>
              )}
            </div>
          </div>
          <MainGenerateForm />
          <button ref={mainGenerateFormRef} type="submit" className="hidden" aria-hidden />
        </form>
      </Form>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || status !== "authenticated" || (!bypassSubscription && data?.user.credits === 0)}
        onClick={submitButtonClicked}
      >
        {isSubmitting ? "Generating..." : "Generate Image"}
      </Button>
    </>
  );
};
export default GenerateFilterForm;
