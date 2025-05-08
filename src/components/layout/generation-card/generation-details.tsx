"use client";
import GIcon from "@/components/g-icon";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface GenerationDetailsProp extends React.ComponentProps<"section"> {
  id: string;
}

export default function GenerationDetails({
  className,
  id,
  ...props
}: GenerationDetailsProp) {
  const { data: session } = useSession();
  const [data, setData] = useState<GenerationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session || !id) return;

    const fetchData = async () => {
      try {
        const token = session?.accessToken;
        const res = await axios.get<GenerationData>(
          `${process.env.NEXT_PUBLIC_BE_URL}/api/generations/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, session]);

  if (data === null && !loading) {
    return;
  }

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-6 p-5 overflow-y-scroll md:overflow-y-auto">
        {/* Left Image Area */}
        <div className="bg-muted rounded-2xl p-4 flex justify-center items-center w-full lg:w-1/2">
          <Skeleton className="w-full aspect-square max-w-[400px] rounded-xl" />
        </div>

        {/* Right Content Area */}
        <div className="flex flex-col gap-6 w-full lg:w-1/2">
          {/* Prompt box */}
          <Skeleton className="w-full h-[100px] rounded-xl" />

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-4 text-sm sm:text-base">
            <div>
              <Skeleton className="w-28 h-4 mb-1" />
              <Skeleton className="w-40 h-5" />
            </div>
            <div>
              <Skeleton className="w-28 h-4 mb-1" />
              <Skeleton className="w-40 h-5" />
            </div>
            <div>
              <Skeleton className="w-28 h-4 mb-1" />
              <Skeleton className="w-40 h-5" />
            </div>
            <div>
              <Skeleton className="w-28 h-4 mb-1" />
              <Skeleton className="w-40 h-5" />
            </div>
            <div>
              <Skeleton className="w-28 h-4 mb-1" />
              <Skeleton className="w-40 h-5" />
            </div>
            <div>
              <Skeleton className="w-28 h-4 mb-1" />
              <Skeleton className="w-40 h-5" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
              <Skeleton className="w-10 h-10 rounded-full" />
            </div>
            <Skeleton className="w-[140px] h-10 rounded-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <section
      className={cn(
        "flex items-center md:items-start flex-col md:flex-row gap-5 my-5 overflow-y-scroll md:overflow-y-auto",
        className
      )}
      {...props}
    >
      <Carousel className="relative max-w-2xs">
        <CarouselContent>
          {data.generatedImages.map((imgData) => (
            <CarouselItem key={imgData.createdAt} className="relative">
              <Image
                src={imgData.imagePath}
                alt={String(imgData.imageGenerationId)}
                width={300}
                height={300}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="flex-1 gap-5 md:gap-0 flex flex-col justify-between h-full w-full md:w-auto">
        <div>
          {data.generationType === "filter" && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <div className="whitespace-nowrap text-muted-foreground text-sm">
                  Album Song Name
                </div>
                <div className="font-semibold">
                  {data.generationDetails.projectName}
                </div>
              </div>
              <div>
                <div className="whitespace-nowrap text-muted-foreground text-sm">
                  Artist Name
                </div>
                <div className="font-semibold">
                  {data.generationDetails.artistName}
                </div>
              </div>
              <div>
                <div className="whitespace-nowrap text-muted-foreground text-sm">
                  Genre
                </div>
                <div className="font-semibold">
                  {data.generationDetails.genre}
                </div>
              </div>
              <div>
                <div className="whitespace-nowrap text-muted-foreground text-sm">
                  Visual Style
                </div>
                <div className="font-semibold">
                  {data.generationDetails.visualStyle}
                </div>
              </div>
              <div>
                <div className="whitespace-nowrap text-muted-foreground text-sm">
                  Mood
                </div>
                <div className="font-semibold">
                  {data.generationDetails.mood}
                </div>
              </div>
              <div>
                <div className="whitespace-nowrap text-muted-foreground text-sm">
                  Color Palette
                </div>
                <div className="font-semibold">
                  {data.generationDetails.colorPallete}
                </div>
              </div>
            </div>
          )}
          {data.generationType === "custom" ||
            (data.generationType === "remix" && (
              <div className="flex gap-2 items-center bg-muted p-2 rounded-md text-muted-foreground font-medium ">
                <Sparkles className="size-5 text-primary" />
                <div>{data.generationDetails.userPrompt}</div>
              </div>
            ))}
        </div>
        <div className="w-full flex-1">
          <div className="flex-1 flex-col flex justify-between md:flex-row md:items-end items-center gap-5 h-full">
            <div className="flex gap-2 right-2 top-2">
              <Button
                size={"icon"}
                className="rounded-full size-8 "
                variant={"outline"}
              >
                <GIcon size={17} name="draw" />
              </Button>
              <Button
                size={"icon"}
                className="rounded-full size-8 "
                variant={"outline"}
              >
                <GIcon size={17} name="delete" />
              </Button>
              <Button
                size={"icon"}
                className="rounded-full size-8 "
                variant={"outline"}
              >
                <GIcon size={17} name="share" />
              </Button>
            </div>
            <Link href={"/remix-image/remix"} className="w-full md:w-auto">
              <Button className="w-full">Remix Image</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// Shared GeneratedImage interface
interface GeneratedImage {
  id: number;
  imageGenerationId: number;
  imagePath: string;
  createdAt: string; // ISO string
}

// Shared base type for outer structure
interface BaseGeneration {
  id: number;
  generationType: GenerationType;
  noOfImages: number;
  generatedImages: GeneratedImage[];
}

// Generation type discriminators
type GenerationType = "remix" | "filter" | "custom";

// Specific generationDetails types
interface RemixDetails {
  imageGenerationId: number;
  referenceImageUrl: string;
  userPrompt: string;
  imgSimilarityPercentage: number;
}

interface FilterDetails {
  imageGenerationId: number;
  projectName: string;
  artistName: string;
  genre: string;
  mood: string;
  visualStyle: string;
  elements: string;
  colorPallete: string;
}

interface CustomDetails {
  imageGenerationId: number;
  userPrompt: string;
}

// Final discriminated union
type GenerationData =
  | (BaseGeneration & {
      generationType: "remix";
      generationDetails: RemixDetails;
    })
  | (BaseGeneration & {
      generationType: "filter";
      generationDetails: FilterDetails;
    })
  | (BaseGeneration & {
      generationType: "custom";
      generationDetails: CustomDetails;
    });
