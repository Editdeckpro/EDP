"use client";

import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import Image from "next/image";
import { forwardRef, useImperativeHandle } from "react";
import { GeneratedImage } from "./generation-details";

interface ImageCarouselProps {
  images: GeneratedImage[];
  noOfImages: number;
}

export interface ImageCarouselRef {
  getCurrentIndex: () => number | undefined;
}

const ImageCarousel = forwardRef<ImageCarouselRef, ImageCarouselProps>(
  ({ images, noOfImages }, ref) => {
    const { api } = useCarousel();

    useImperativeHandle(
      ref,
      () => ({
        getCurrentIndex: () => {
          if (!api) return undefined;
          return api.selectedScrollSnap();
        },
      }),
      [api]
    );

    return (
      <>
        <CarouselContent>
          {images.map((imgData) => (
            <CarouselItem key={imgData.createdAt} className="relative">
              <Image
                src={imgData.imagePath}
                alt={String(imgData.imageGenerationId)}
                width={300}
                height={300}
                className={`transition-opacity duration-300`}
                style={{ objectFit: "cover" }}
                loading="lazy"
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4="
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {noOfImages > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </>
    );
  }
);

ImageCarousel.displayName = "ImageCarousel";
export default ImageCarousel;
