import ImageCard from "@/components/layout/image-card";
import ImageGridHeader from "./image-grid-header";

export default function ImageCardGrid() {
  return (
    <section>
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
