import Image from "next/image";
import React, { forwardRef } from "react";
import GIcon from "../g-icon";
import { Button } from "../ui/button";

interface ImageCardProps {
  imageSrc: string;
  imgAlt: string;
}

const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ imageSrc, imgAlt }, ref) => {
    return (
      <div
        ref={ref}
        tabIndex={0}
        className="relative aspect-square group overflow-hidden"
      >
        <Image src={imageSrc} fill alt={imgAlt} className="rounded-md" />
        <div className="absolute flex-col gap-2 right-2 top-2 hidden group-focus:flex group-hover:flex transition-all duration-200">
          <Button size={"icon"} className="rounded-full size-8 bg-[#1B1C1E]">
            <GIcon size={17} name="draw" />
          </Button>
          <Button size={"icon"} className="rounded-full size-8 bg-[#1B1C1E]">
            <GIcon size={17} name="delete" />
          </Button>
          <Button size={"icon"} className="rounded-full size-8 bg-[#1B1C1E]">
            <GIcon size={17} name="share" />
          </Button>
        </div>

        <Button className="absolute bottom-2 hidden group-focus:block group-hover:block w-[90%] left-1/2 -translate-x-1/2">
          Remix
        </Button>
      </div>
    );
  }
);

ImageCard.displayName = "ImageCard"; // Required for forwardRef in dev tools

export default ImageCard;
