"use client";

import {
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import Image from "next/image";
import { forwardRef, useImperativeHandle, useState } from "react";
import { GeneratedImage } from "./generation-details";

interface ImageCarouselProps {
  images: GeneratedImage[];
  noOfImages: number;
}

export interface ImageCarouselRef {
  getCurrentIndex: () => number | undefined;
}

// Placeholder image URL (replace with your own if needed)
const PLACEHOLDER_IMAGE = "/placeholder.png";

const ImageCarousel = forwardRef<ImageCarouselRef, ImageCarouselProps>(
  ({ images, noOfImages }, ref) => {
    const { api } = useCarousel();
    // Track loaded state for each image
    const [loaded, setLoaded] = useState<boolean[]>(() =>
      images.map(() => false)
    );

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

    const handleLoad = (idx: number) => {
      setLoaded((prev) => {
        const next = [...prev];
        next[idx] = true;
        return next;
      });
    };

    return (
      <>
        <CarouselContent>
          {images.map((imgData, idx) => (
            <CarouselItem key={imgData.createdAt} className="relative">
              {!loaded[idx] && (
                <Image
                  src={PLACEHOLDER_IMAGE}
                  alt="Loading..."
                  width={300}
                  height={300}
                  className="absolute inset-0 z-0"
                  style={{ objectFit: "cover" }}
                />
              )}
              <Image
                src={imgData.imagePath}
                alt={String(imgData.imageGenerationId)}
                width={300}
                height={300}
                className={`transition-opacity duration-300 ${
                  loaded[idx] ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleLoad(idx)}
                style={{ objectFit: "cover" }}
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
