// ! This will be dashboard page
import ImageCardGrid from "@/components/layout/generation-card/image-card-grid";
import PageCta from "@/components/pages/dashboard/page-cta";

export default function Page() {
  return (
    <section className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <PageCta
          title="Image Creator"
          description="Craft stunning album covers from pure imagination."
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
          disabled={false}
          upgradeRequired={false}
          planRestriction={{
            allowedPlans: ["NEXT_LEVEL", "PRO_STUDIO"],
            message: "Upgrade to Next Level or Pro Studio to create lyric videos"
          }}
        />
      </div>
      <ImageCardGrid generationType="custom,filter" />
      {/* <ImageGridPagination /> */}
    </section>
  );
}
