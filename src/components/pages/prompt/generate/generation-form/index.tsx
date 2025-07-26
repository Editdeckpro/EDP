"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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

interface GenerateFormProps {
  setData: SetGenerateResType;
}

const GenerateFilterForm: FC<GenerateFormProps> = ({ setData }) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data, status, update } = useSession();
  const generateFormRef = useRef<HTMLButtonElement | null>(null);
  const mainGenerateFormRef = useRef<HTMLButtonElement | null>(null);

  const generateForm = useForm<GenerateFormSchemaType>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      albumSongName: "",
      artistName: "",
      colorPalette: "",
      genre: "",
      mood: "",
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

      lines.push(`This artwork is designed for music album covers for streaming platforms and vinyl releases.`);

      const template = lines.join("\n");

      mainForm.setValue("customPrompt", template);
    };
    updateField();
  }, [mainForm, watchedValues]);

  function submitButtonClicked() {
    if (generateFormRef.current) {
      generateFormRef.current.click();
    }
    if (mainGenerateFormRef.current) {
      mainGenerateFormRef.current.click();
    }
  }

  async function mainFormSubmit(values: MainGenerateFormSchemaType) {
    if (data?.user.credits === 0) {
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

      if (data === "error") {
        toast.error("Something went wrong", {
          description: "Please try submitting form again",
        });
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
          <Button type="submit">submit</Button>
        </form>
      </Form>
      <Form {...mainForm}>
        <form onSubmit={mainForm.handleSubmit(mainFormSubmit)} className="space-y-4">
          <MainGenerateForm />
          <button ref={mainGenerateFormRef} type="submit" className="hidden" aria-hidden />
        </form>
      </Form>

      <Button
        type="submit"
        className="w-full"
        disabled={isSubmitting || status !== "authenticated"}
        onClick={submitButtonClicked}
      >
        {isSubmitting ? "Generating..." : "Generate Image"}
      </Button>
    </>
  );
};
export default GenerateFilterForm;
