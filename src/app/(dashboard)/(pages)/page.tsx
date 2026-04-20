// ! This will be dashboard page
import ImageCardGrid from "@/components/layout/generation-card/image-card-grid";
import PageCta from "@/components/pages/dashboard/page-cta";

export default function Page() {
  return (
    <section className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Cover Art Studio — deep purple gradient */}
        <PageCta
          title="Cover Art Studio"
          description="Design album covers and single artwork for streaming platforms, vinyl, and more."
          buttonText="Generate Now"
          buttonIcon="sparkles"
          imageSrc="/images/cta-image-creator.svg"
          btnLink="/image-generation/generate"
          cardStyle={{
            background: "linear-gradient(135deg, #4c1d95 0%, #7c3aed 40%, #a855f7 70%, #6d28d9 100%)",
            boxShadow: "0 4px 32px rgba(139,92,246,0.4)",
          }}
        />
        {/* Remix Wizard — teal/cyan gradient */}
        <PageCta
          title="Remix Wizard"
          description="Transform and evolve your visuals with a single prompt."
          buttonText="Remix Image"
          buttonIcon="sparkles"
          imageSrc="/images/cta-remix.svg"
          buttonVariant="secondary"
          btnLink="/remix-image/remix"
          cardStyle={{
            background: "linear-gradient(135deg, #134e4a 0%, #0f766e 40%, #14b8a6 70%, #0d9488 100%)",
            boxShadow: "0 4px 32px rgba(20,184,166,0.4)",
          }}
        />
        {/* HIDDEN PRE-LAUNCH — see hide-unready-features PR
        Lyric Video — warm orange gradient
        <PageCta
          title="Lyric Video"
          description="Create stunning lyric videos with AI-powered timing."
          buttonText="Create Video"
          buttonIcon="video"
          imageSrc="/images/cta-lyric-video.svg"
          btnLink="/lyric-video/create"
          cardStyle={{
            background: "linear-gradient(135deg, #92400e 0%, #d97706 40%, #f59e0b 70%, #b45309 100%)",
            boxShadow: "0 4px 32px rgba(245,158,11,0.4)",
          }}
        />
        */}
        {/* HIDDEN PRE-LAUNCH — see hide-unready-features PR
        Beat Producer — deep green gradient
        <PageCta
          title="Beat Producer"
          description="Generate professional beats with melody, chords, and drums using AI."
          buttonText="Produce Beat"
          buttonIcon="sparkles"
          imageSrc="/images/cta-beat-producer.svg"
          btnLink="/beat-producer"
          cardStyle={{
            background: "linear-gradient(135deg, #14532d 0%, #15803d 40%, #22c55e 70%, #166534 100%)",
            boxShadow: "0 4px 32px rgba(34,197,94,0.4)",
          }}
        />
        */}
      </div>
      <ImageCardGrid generationType="custom,filter" />
      {/* <ImageGridPagination /> */}
    </section>
  );
}
