"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hook/use-media-querry";
import Image from "next/image";
import React, { forwardRef } from "react";
import GIcon from "../../g-icon";
import GenerationDetails from "./generation-details";
import { toast } from "sonner";
import { useTopLoader } from "nextjs-toploader";
import Link from "next/link";

interface ImageCardProps {
  id: string;
  imageSrc: string;
  imgAlt: string;
}

const ImageCard = forwardRef<HTMLDivElement, ImageCardProps>(({ imageSrc, imgAlt, id }, ref) => {
  const [downloading, setDownloading] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  const topLoader = useTopLoader();

  function downloadImage() {
    handleDownload({
      imageAlt: imgAlt,
      imageSrc: imageSrc,
      setDownloading: (e) => {
        setDownloading(e);
        if (e) {
          topLoader.start();
        } else {
          topLoader.done();
        }
      },
    });
  }

  // If image failed to load, don't render the card
  if (imageError) {
    return null;
  }

  return (
    <div ref={ref} tabIndex={0} className="relative aspect-square group overflow-hidden">
      <DrawerDialog imageSrc={imageSrc} imageAlt={imgAlt} id={id} onImageError={() => setImageError(true)} />
      <div className="absolute flex-col gap-2 right-2 top-2 pointer-fine:hidden pointer-coarse:flex group-focus:flex group-hover:flex transition-all duration-200">
        <Button
          size={"icon"}
          className="rounded-full size-8 bg-[#1B1C1E]"
          onClick={downloadImage}
          disabled={downloading}
        >
          <GIcon size={17} name="download" />
        </Button>
        <Link href={`${process.env.NEXT_PUBLIC_EDITOR_URL}?url=${imageSrc}`}>
          <Button size={"icon"} className="rounded-full size-8 bg-[#1B1C1E]">
            <GIcon size={17} name="edit" />
          </Button>
        </Link>
      </div>

      <Link href={`/remix-image/remix?imageUrl=${imageSrc}`}>
        <Button className="absolute bottom-2 pointer-fine:hidden pointer-coarse:block group-focus:block group-hover:block w-[90%] left-1/2 -translate-x-1/2">
          Remix
        </Button>
      </Link>
    </div>
  );
});

ImageCard.displayName = "ImageCard"; // Required for forwardRef in dev tools

export default ImageCard;

interface handleDownloadProps {
  imageSrc: string;
  imageAlt: string;
  setDownloading?: (e: boolean) => void;
}

export const handleDownload = async ({ imageSrc, imageAlt, setDownloading }: handleDownloadProps) => {
  if (setDownloading) {
    setDownloading(true);
  }

  try {
    const response = await fetch(imageSrc);
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = imageAlt || "image.jpg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast.success("Image downloading started!");
  } catch (error) {
    console.error("Download failed:", error);
    toast.error("Failed to download image. Please try again.");
  } finally {
    if (setDownloading) {
      setDownloading(false);
    }
  }
};

function DrawerDialog({
  id,
  imageSrc,
  imageAlt,
  onImageError,
}: {
  id: string;
  imageSrc: string;
  imageAlt: string;
  onImageError?: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleImageError = () => {
    console.error(`Failed to load image: ${imageSrc}`);
    if (onImageError) {
      onImageError();
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Image
            src={imageSrc}
            fill
            alt={imageAlt}
            className="rounded-md"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDMwMCAzMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbGw9IiNlZWUiLz48L3N2Zz4="
            onError={handleImageError}
          />
        </DialogTrigger>
        <DialogContent className="min-w-3xl">
          {/* For accessability */}
          <DialogHeader className="hidden">
            <DialogTitle>Generation Details</DialogTitle>
            <DialogDescription>View all the details of the generation</DialogDescription>
          </DialogHeader>

          <GenerationDetails id={id} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Image src={imageSrc} fill alt={imageAlt} className="rounded-md" onError={handleImageError} />
      </DrawerTrigger>
      <DrawerContent>
        {/* For accessability */}
        <DrawerHeader className="hidden">
          <DrawerTitle>Generation Details</DrawerTitle>
          <DrawerDescription>View all the details of the generation</DrawerDescription>
        </DrawerHeader>
        <GenerationDetails className="px-4" id={id} />
      </DrawerContent>
    </Drawer>
  );
}
