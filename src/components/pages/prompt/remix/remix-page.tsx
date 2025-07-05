import ImageCard from "@/components/layout/generation-card/image-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { RemixResType } from ".";

interface RemixPageProps {
  data: RemixResType;
  imageSrc: string | null;
  prompt: string | null;
}

interface imagesList {
  url: string;
  prompt: string;
}

const imagesList: imagesList[] = [
  {
    prompt:
      "1: Lorem ipsum, dolor sit amet consectetur adipisicing elit. Earum sapiente perspiciatis odit accusantium, eaque esse corporis harum aut ad pariatur? Facilis nemo magnam eius recusandae adipisci animi suscipit ipsa eaque.",
    url: "https://backend.editdeckpro.com/images/image_1748344340680_2.png",
  },
  {
    prompt:
      "2: ipsum, dolor sit amet consectetur adipisicing elit. Earum sapiente perspiciatis odit accusantium, eaque esse corporis harum aut ad pariatur? Facilis nemo magnam eius recusandae adipisci animi suscipit ipsa eaque.",
    url: "https://backend.editdeckpro.com/images/image_1750788907846_0.png",
  },
  {
    prompt:
      "3: dolor sit amet consectetur adipisicing elit. Earum sapiente perspiciatis odit accusantium, eaque esse corporis harum aut ad pariatur? Facilis nemo magnam eius recusandae adipisci animi suscipit ipsa eaque.",
    url: "https://backend.editdeckpro.com/images/image_1750788909889_3.png",
  },
  {
    prompt:
      "4: sit amet consectetur adipisicing elit. Earum sapiente perspiciatis odit accusantium, eaque esse corporis harum aut ad pariatur? Facilis nemo magnam eius recusandae adipisci animi suscipit ipsa eaque.",
    url: "https://backend.editdeckpro.com/images/image_1750788937413_0.png",
  },
];

const RemixPage: FC<RemixPageProps> = ({ data, imageSrc, prompt }) => {
  if (data === "loading")
    return (
      <div className="space-y-4">
        <div className="px-4 py-5 rounded-lg bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill space-y-3 items-start md:items-center">
          <div className="flex flex-col md:flex-row  items-center gap-10  justify-center">
            <Image
              src={imageSrc!}
              alt={prompt || ""}
              width={150}
              height={150}
              className="rounded-lg"
            />
            <svg
              width="108"
              height="108"
              viewBox="0 0 108 108"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-90 md:rotate-0"
            >
              <path
                d="M37.4721 51.541C28.6452 49.8188 21.7199 51.4223 25.8484 54.2676C27.9906 55.7372 39.3447 56.3842 40.4979 55.1187C41.507 54.0114 39.7683 51.9927 37.4721 51.541Z"
                fill="black"
                className="blink-part-2"
              />
              <path
                d="M105.646 54.8381C107.476 55.0583 107.373 53.4201 105.445 51.6628C102.832 49.3299 96.7932 49.9075 85.5389 43.3673C80.2623 40.2962 80.0294 40.1803 79.4432 40.6113C77.8313 41.7965 84.7142 47.2969 91.5544 50.297C91.9939 50.5045 82.1218 50.7253 79.7341 51.0106C77.0198 51.3361 75.8067 51.8713 75.9675 52.5969C76.4282 54.8506 79.1759 55.762 84.7774 55.5582C87.225 55.4723 88.9713 55.5194 88.7022 55.7085C81.2624 59.7868 79.9914 61.2346 82.1576 63.2086C83.7162 64.629 85.8901 64.1006 91.6988 60.8041C96.1045 58.3042 104.503 54.7131 105.646 54.8381Z"
                fill="black"
                className="blink-part-4"
              />
              <path
                d="M16.4423 52.0657C12.5897 51.3055 1.26906 51.8955 0.605913 52.8354C-1.42679 55.8088 12.658 58.0757 18.9421 55.7432C20.7053 55.0818 19.0172 52.5301 16.4423 52.0657Z"
                className="blink-part-1"
                fill="black"
              />
              <path
                d="M64.3805 51.3042C61.2676 50.6874 51.1649 50.3121 50.7324 50.7867C49.8195 51.7885 52.0477 54.5435 54.1974 55.1029C55.528 55.4469 67.1323 55.501 68.0763 55.1548C70.2886 54.3721 68.0528 51.9969 64.3805 51.3042Z"
                fill="black"
                className="blink-part-3"
              />
            </svg>
            <div className="aspect-square w-52 h-5w-52 sm:w-72 sm:h-72 rounded-xl border border-gray-300 overflow-hidden relative">
              <Image
                src={imageSrc!}
                alt={prompt || ""}
                fill
                className="rounded-lg blur-lg"
              />
            </div>
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
        </div>

        <div className="px-4 py-2 rounded-lg bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill space-y-3 items-start md:items-center">
          {/* <div className="flex items-center gap-3 text-sm">
            <Sparkles className="text-primary size-5 min-w-4" />
            {data.userPrompt}
          </div> */}

          <div className="grid grid-cols-1 gap-4 max-w-2xs mx-auto">
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

  return (
    <main>
      <div className="px-4 py-4 rounded-lg bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill space-y-1 items-start md:items-center">
        <Carousel className="space-y-5">
          <ImageCarouselContent />
        </Carousel>
      </div>
    </main>
  );
};
export default RemixPage;

export const ImageCarouselContent = () => {
  const { api } = useCarousel();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      console.log(index);

      setSelectedImageIndex(index);
    };

    onSelect();

    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <>
      <div className="flex items-start gap-3 text-sm">
        <Sparkles className="text-primary size-5 min-w-4" />
        {imagesList[selectedImageIndex].prompt}
      </div>
      <div className="grid grid-cols-1 gap-1 text-center max-w-2xs mx-auto">
        <div className="relative aspect-square">
          <CarouselContent>
            {imagesList.map((imgData) => (
              <CarouselItem
                key={imgData.prompt + imgData.url}
                className="relative"
              >
                <Image
                  src={imgData.url}
                  alt={String(imgData.prompt)}
                  width={300}
                  height={300}
                  className={`transition-opacity duration-300 rounded-md`}
                  style={{ objectFit: "cover" }}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4="
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </div>
      </div>
    </>
  );
};
