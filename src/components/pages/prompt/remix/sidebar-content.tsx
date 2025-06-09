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
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { cn, fileToBase64 } from "@/lib/utils";
import { remixFormSchema, RemixFormSchemaType } from "@/schemas/remix-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Sparkles, Upload } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { SetRemixResType } from ".";
import { remixFormDataSubmit } from "./request";
import { useSession } from "next-auth/react";

interface RemixSidebarContentProps {
  setData: SetRemixResType;
  imageUrl?: string | null;
}

const RemixSidebarContent: FC<RemixSidebarContentProps> = ({
  setData,
  imageUrl,
}) => {
  const hasValidUrl = imageUrl !== null;
  const [customPromptOpen, setCustomPromptOpen] = useState<boolean>(true);
  const [imageGuidancesOpen, setImageGuidanceOpen] = useState<boolean>(
    !hasValidUrl
  );
  const [imageSimilarityOpen, setImageSimilarityOpen] = useState<boolean>(true);
  const [imageBase64, setImageBase64] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { update } = useSession();

  const form = useForm<RemixFormSchemaType>({
    resolver: zodResolver(remixFormSchema),
    defaultValues: {
      customPrompt: "",
      imageSimilarity: 10,
      referenceImage: undefined,
      imageUrl: imageUrl || null,
    },
  });

  async function onSubmit(values: RemixFormSchemaType) {
    try {
      setIsSubmitting(true);
      setData("loading");
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

  return (
    <>
      <h1 className="text-lg font-bold">Remix Image</h1>
      <Separator />

      <div className="space-y-2">
        <h2 className="font-bold text-lg">Image to be Remixed</h2>
        <div className="p-2 bg-muted rounded-lg border border-primary/30 max-h-32">
          {(imageBase64 !== undefined &&
            imageBase64 !== "" &&
            imageUrl != "") ||
          hasValidUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageBase64 || imageUrl || undefined}
              width={45}
              height={45}
              alt={"Remix Image Preview"}
              className="rounded-sm max-h-full"
            />
          ) : (
            <div className="text-center text-muted-foreground font-light">
              Preview of selected image
            </div>
          )}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

          <div className="space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setImageGuidanceOpen(!imageGuidancesOpen)}
            >
              <h3 className="text-lg font-medium">Image Guidance</h3>
              <Button variant="link" size="icon" type="button">
                {imageGuidancesOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
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
                            setImageBase64(await fileToBase64(file));
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

          <div className="space-y-3">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setImageSimilarityOpen(!imageSimilarityOpen)}
            >
              <h3 className="text-lg font-medium">Image Similarity</h3>
              <Button variant="link" size="icon" type="button">
                {imageSimilarityOpen ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
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
                        <span className="text-xs font-thin">
                          {form.getValues("imageSimilarity")}% Similarity
                        </span>
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

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Remix Image <GIcon>wand_stars</GIcon>
          </Button>
        </form>
      </Form>
    </>
  );
};
export default RemixSidebarContent;
