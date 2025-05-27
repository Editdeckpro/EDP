"use client";
import ImageCard from "./image-card";
import ImageGridHeader from "../../pages/dashboard/image-grid-header";
import { useInView } from "@/hook/user-in-view";
import { GenerationType, useGenerations } from "@/hook/use-generation";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";
import Image from "next/image";

export default function ImageCardGrid({
  generationType,
}: {
  generationType?: GenerationType;
}) {
  const { generations, loading, loadNextPage, hasNextPage, error } =
    useGenerations({
      generationType,
      limit: 10,
    });

  const { inView, setRef } = useInView({ threshold: 1 });

  useEffect(() => {
    function fetchNext() {
      if (inView && hasNextPage && !loading && !error) {
        // console.log("Loading next page");
        loadNextPage();
      }
    }
    fetchNext();
  }, [error, hasNextPage, inView, loadNextPage, loading]);

  return (
    <section>
      <div className="space-y-3">
        <ImageGridHeader />
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {generations.map((item, index) => {
            const isLast = index === generations.length - 1;
            return (
              <ImageCard
                id={item.imageGenerationId}
                ref={isLast ? setRef : null}
                key={index}
                imageSrc={item.imagePath}
                imgAlt={item.imageGenerationId}
              />
            );
          })}
        </div>
        {loading && (
          <LoaderCircle className="mx-auto text-primary/50 animate-spin" />
        )}
      </div>
      {error && (
        <div className="flex flex-col gap-2 items-center justify-center">
          <Image
            src={"/images/rocket-undraw.svg"}
            width={200}
            height={200}
            alt=""
          />
          <span className="text-orange-800 font-bold text-lg">{error}</span>
        </div>
      )}
    </section>
  );
}
