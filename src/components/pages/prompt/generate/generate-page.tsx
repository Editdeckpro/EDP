import ImageCard from "@/components/layout/generation-card/image-card";
import Image from "next/image";
import { FC } from "react";
import { GenerateResType } from ".";
import GenerationLoading from "./generation-loading";

interface GeneratePageProps {
  data: GenerateResType;
}

const GeneratePage: FC<GeneratePageProps> = (props) => {
  return (
    <section>
      <DataResult {...props} />
      {/* <ImageCardGrid generationType="custom" /> */}
    </section>
  );
};
export default GeneratePage;

const DataResult = ({ data }: GeneratePageProps) => {
  if (data === "loading") return <GenerationLoading />;
  else if (data)
    return (
      <section className="space-y-3">
        <div className="flex justify-between">
          <div>
            <h1 className="text-lg font-bold">Generated Result</h1>
            <p className="text-sm font-light text-muted-foreground">
              Browse, refine, or relive your image generations.
            </p>
          </div>
          {/* <Button variant={"secondary"} size={"sm"}>
            Generate Again <Sparkles />
          </Button> */}
        </div>

        <div className="p-4 rounded-xl bg-primary/5 bg-[url('/images/support-banner-bg.png')] object-fill space-y-3 items-start md:items-center">
          {/* <div className="flex items-center gap-3 text-sm">
            <Sparkles className="text-primary size-5 min-w-4" />
            {data.finalPrompt}
          </div> */}

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.images.map((src, i) => (
              <ImageCard id={String(data.imageGenerationId)} imageSrc={src} imgAlt={src} key={src + String(i)} />
            ))}
          </div>
        </div>
      </section>
    );
  else {
    return (
      <div className="relative w-full rounded-xl overflow-hidden bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-pink-50/20 border border-gray-100/50">
        {/* Subtle animated pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Content - Perfectly centered */}
        <div className="relative flex flex-col items-center justify-center min-h-[280px] md:min-h-[320px] py-8 md:py-10 px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:gap-5 text-center">
            {/* Illustration */}
            <div className="relative aspect-square w-[180px] md:w-[200px] flex-shrink-0">
              <Image 
                src={"/images/remix-empty.svg"} 
                fill 
                alt="Empty state illustration" 
                className="opacity-85 object-contain" 
              />
            </div>
            
            {/* Text Content - Centered */}
            <div className="flex flex-col items-center gap-2.5 max-w-md">
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 leading-tight">
                Ready to Create?
              </h3>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                Fill out the form on the left to generate your first image
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
};
