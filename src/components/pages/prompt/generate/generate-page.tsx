import React, { FC } from "react";
import { GenerateResType } from ".";
import { Sparkles } from "lucide-react";
import ImageCard from "@/components/layout/generation-card/image-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ImageCardGrid from "../../../layout/generation-card/image-card-grid";
import Image from "next/image";

interface GeneratePageProps {
  data: GenerateResType;
}

const GeneratePage: FC<GeneratePageProps> = (props) => {
  return (
    <section>
      <DataResult {...props} />
      {/* <ImageCardGrid generationType="custom" /> */}
    </section>
  );
};
export default GeneratePage;

const DataResult = ({ data }: GeneratePageProps) => {
  if (data === "loading")
    return (
      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="space-y-3">
            <Skeleton className="w-sm h-6" />
            <Skeleton className="w-xs h-4" />
          </div>
        </div>

        <div className="px-4 py-2 rounded-lg bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill space-y-3 items-start md:items-center">
          <div className="flex items-center gap-3 text-sm">
            <Sparkles className="text-primary size-5 min-w-4" />
            <Skeleton className="w-full h-5" />
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Skeleton className="aspect-square w-[12rem]" />
            <Skeleton className="aspect-square w-[12rem]" />
            <Skeleton className="aspect-square w-[12rem]" />
            <Skeleton className="aspect-square w-[12rem]" />
          </div>
        </div>
      </div>
    );
  else if (data)
    return (
      <section className="space-y-4">
        <div className="flex justify-between">
          <div>
            <h1 className="text-lg font-bold">Generated Result</h1>
            <p className="text-sm font-light text-muted-foreground">
              Browse, refine, or relive your image generations.
            </p>
          </div>
          <Button variant={"secondary"} size={"sm"}>
            Generate Again <Sparkles />
          </Button>
        </div>

        <div className="px-4 py-2 rounded-lg bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill space-y-3 items-start md:items-center">
          {/* <div className="flex items-center gap-3 text-sm">
            <Sparkles className="text-primary size-5 min-w-4" />
            {data.finalPrompt}
          </div> */}

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.images.map((src, i) => (
              <ImageCard
                id={String(data.imageGenerationId)}
                imageSrc={src}
                imgAlt={src}
                key={src + String(i)}
              />
            ))}
          </div>
        </div>
      </section>
    );
  else {
    return (
      <div className="px-4 py-2 rounded-lg bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill space-y-1 items-start md:items-center">
        <div className="grid grid-cols-1 gap-1 text-center max-w-2xs mx-auto">
          <div className="relative aspect-square">
            <Image src={"/images/remix-empty.svg"} fill alt="something" />
          </div>
        </div>
      </div>
    );
  }
};
