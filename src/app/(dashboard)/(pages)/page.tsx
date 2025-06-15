// ! This will be dashboard page
import ImageCardGrid from "@/components/layout/generation-card/image-card-grid";
// import ImageGridPagination from "@/components/pages/dashboard/image-grid-pagination";
import PageCta from "@/components/pages/dashboard/page-cta";

export default function Page() {
  return (
    <section className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PageCta
          title="Image Creator"
          description="Craft stunning album covers from pure imagination."
          buttonText="Generate Now"
          buttonIcon="sparkles"
          imageSrc="/images/cta-fg.jpg"
          bgImgSrc="/images/cta-bg.jpg"
          btnLink="/image-generation/generate"
        />
        <PageCta
          title="Remix Wizard"
          description="Transform and evolve your visuals with a single prompt."
          buttonText="Remix Image"
          buttonIcon="sparkles"
          imageSrc="/images/cta-2-fg-1.jpg"
          buttonVariant="secondary"
          bgImgSrc="/images/cta-2.jpg"
          btnLink="/remix-image/remix"
        />
      </div>
      <ImageCardGrid generationType="custom,filter" />
      {/* <ImageGridPagination /> */}
    </section>
  );
}
