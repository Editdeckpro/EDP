import GIcon from "@/components/g-icon";
import ImageCardGrid from "@/components/layout/generation-card/image-card-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-5 py-10 text-center sm:text-left justify-between px-3 sm:py-5 bg-[url('/images/cta-bg.jpg')] bg-no-repeat object-fill bg-cover rounded-xl">
        <div className="text-white">
          <h1 className="font-bold text-xl">Imagine & Generate!</h1>
          <p className="text-sm">
            Hit &quot;Generate Now&quot; and craft your custom album cover in
            seconds.
          </p>
        </div>
        <div className="w-fit">
          <Link href={"/image-generation/generate"} className="w-fit">
            <Button className="w-full sm:w-auto">
              Generate Now <GIcon>wand_stars</GIcon>
            </Button>
          </Link>
        </div>
      </div>

      <ImageCardGrid generationType="custom,filter" />
    </section>
  );
}
