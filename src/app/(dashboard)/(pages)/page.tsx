// ! This will be dashboard page
import ImageCardGrid from "@/components/layout/generation-card/image-card-grid";
import PageCta from "@/components/pages/dashboard/page-cta";

export default function Page() {
  return (
    <section className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <PageCta
          title="Cover Art Studio"
          description="Design album covers and single artwork for streaming platforms, vinyl, and more."
          buttonText="Generate Now"
          buttonIcon="sparkles"
          imageSrc="/images/cta-image-creator.svg"
          bgImgSrc="/images/cta-bg.jpg"
          btnLink="/image-generation/generate"
        />
        <PageCta
          title="Remix Wizard"
          description="Transform and evolve your visuals with a single prompt."
          buttonText="Remix Image"
          buttonIcon="sparkles"
          imageSrc="/images/cta-remix.svg"
          buttonVariant="secondary"
          bgImgSrc="/images/cta-2.jpg"
          btnLink="/remix-image/remix"
        />
        <PageCta
          title="Lyric Video"
          description="Create stunning lyric videos with AI-powered timing."
          buttonText="Create Video"
          buttonIcon="video"
          imageSrc="/images/cta-lyric-video.svg"
          bgImgSrc="/images/cta-bg.jpg"
          btnLink="/lyric-video/create"
        />
        <PageCta
          title="Beat Producer"
          description="Generate professional beats with melody, chords, and drums using AI."
          buttonText="Produce Beat"
          buttonIcon="sparkles"
          imageSrc="/images/cta-lyric-video.svg"
          bgImgSrc="/images/cta-2.jpg"
          btnLink="/beat-producer"
        />
      </div>
      <ImageCardGrid generationType="custom,filter" />
      {/* <ImageGridPagination /> */}
    </section>
  );
}
