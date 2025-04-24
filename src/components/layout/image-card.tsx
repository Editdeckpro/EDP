import Image from "next/image";
import React, { FC } from "react";
import GIcon from "../g-icon";
import { Button } from "../ui/button";

// Todo add the props when API available
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface ImageCardProps {}

const ImageCard: FC<ImageCardProps> = ({}) => {
  return (
    <div className="relative min-w-[13rem] aspect-square group overflow-hidden">
      <Image
        src={"/images/image-card.png"}
        fill
        alt="image -card image"
        className="rounded-md"
      />
      <div className="absolute flex flex-col gap-2 -right-52 top-2 group-hover:right-2 transition-all duration-200">
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

      <Button className="absolute -bottom-52 group-hover:bottom-2 w-[90%] left-1/2 -translate-x-1/2">
        Remix
      </Button>
    </div>
  );
};
export default ImageCard;
