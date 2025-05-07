"use client";
import ImageCard from "@/components/layout/image-card";
import ImageGridHeader from "./image-grid-header";
import { useInView } from "@/hook/user-in-view";
import { useGenerations } from "@/hook/use-generation";
import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

export default function ImageCardGrid() {
  const { generations, loading, loadNextPage, hasNextPage, error } =
    useGenerations({
      generationType: undefined,
      limit: 12,
    });

  const { inView, setRef } = useInView({ threshold: 1 });

  useEffect(() => {
    function fetchNext() {
      if (inView && hasNextPage && !loading && !error) {
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
                ref={isLast ? setRef : null}
                key={
                  String(item.id) +
                    String(item.imageGenerationId) +
                    item.imagePath || index
                }
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
    </section>
  );
}
