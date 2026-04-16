// ! This will be dashboard page
import ImageCardGrid from "@/components/layout/generation-card/image-card-grid";
import PageCta from "@/components/pages/dashboard/page-cta";

export default function Page() {
  return (
    <section className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cover Art Studio — purple */}
        <PageCta
          title="Cover Art Studio"
          description="Design album covers and single artwork for streaming platforms, vinyl, and more."
          buttonText="Generate Now"
          buttonIcon="sparkles"
          imageSrc="/images/cta-image-creator.svg"
          btnLink="/image-generation/generate"
          cardStyle={{
            background: "linear-gradient(145deg, #0a0010 0%, #1a0828 100%)",
            boxShadow: "inset 0 0 80px rgba(139,92,246,0.15), 0 0 0 1px rgba(139,92,246,0.25)",
          }}
        />
        {/* Remix Wizard — cyan/teal */}
        <PageCta
          title="Remix Wizard"
          description="Transform and evolve your visuals with a single prompt."
          buttonText="Remix Image"
          buttonIcon="sparkles"
          imageSrc="/images/cta-remix.svg"
          buttonVariant="secondary"
          btnLink="/remix-image/remix"
          cardStyle={{
            background: "linear-gradient(145deg, #000e0e 0%, #041c18 100%)",
            boxShadow: "inset 0 0 80px rgba(20,184,166,0.15), 0 0 0 1px rgba(20,184,166,0.25)",
          }}
        />
        {/* Lyric Video — orange */}
        <PageCta
          title="Lyric Video"
          description="Create stunning lyric videos with AI-powered timing."
          buttonText="Create Video"
          buttonIcon="video"
          imageSrc="/images/cta-lyric-video.svg"
          btnLink="/lyric-video/create"
          cardStyle={{
            background: "linear-gradient(145deg, #0e0600 0%, #1e1000 100%)",
            boxShadow: "inset 0 0 80px rgba(249,115,22,0.15), 0 0 0 1px rgba(249,115,22,0.25)",
          }}
        />
        {/* Beat Producer — green */}
        <PageCta
          title="Beat Producer"
          description="Generate professional beats with melody, chords, and drums using AI."
          buttonText="Produce Beat"
          buttonIcon="sparkles"
          imageSrc="/images/cta-lyric-video.svg"
          btnLink="/beat-producer"
          cardStyle={{
            background: "linear-gradient(145deg, #020e04 0%, #051a08 100%)",
            boxShadow: "inset 0 0 80px rgba(34,197,94,0.15), 0 0 0 1px rgba(34,197,94,0.25)",
          }}
        />
      </div>
      <ImageCardGrid generationType="custom,filter" />
      {/* <ImageGridPagination /> */}
    </section>
  );
}
