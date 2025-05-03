import GIcon from "@/components/g-icon";
import ImageCard from "@/components/layout/image-card";
import ImageGridHeader from "@/components/pages/dashboard/image-grid-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default function Page() {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-5 py-10 text-center sm:text-left sm:flex-row justify-between items-center px-3 sm:py-5 bg-[url('/images/cta-2.jpg')] bg-no-repeat object-fill bg-cover rounded-xl">
        <div className="text-white">
          <h1 className="font-bold text-xl">Remix Wizard</h1>
          <p className="text-sm">
            Lorem ipsum dolor sit amet. Aut laudantium nobis aut dolores
            suscipit eos dicta culpa
          </p>
        </div>
        <Link href={"/remix-image/remix"}>
          <Button className="w-full sm:w-auto" variant={"secondary"}>
            Remix Image <GIcon>wand_stars</GIcon>
          </Button>
        </Link>
      </div>

      <div className="space-y-3">
        <ImageGridHeader />
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <ImageCard
            imageSrc="/images/image-card.png"
            imgAlt="image-card.png"
          />
          <ImageCard
            imageSrc="/images/image-card.png"
            imgAlt="image-card.png"
          />
          <ImageCard
            imageSrc="/images/image-card.png"
            imgAlt="image-card.png"
          />
          <ImageCard
            imageSrc="/images/image-card.png"
            imgAlt="image-card.png"
          />
        </div>
      </div>
    </section>
  );
}
