import GIcon from "@/components/g-icon";
import ImageCardGrid from "@/components/layout/generation-card/image-card-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-5 py-10 text-center sm:text-left justify-between px-3 sm:py-5 bg-[url('/images/cta-2.jpg')] bg-no-repeat object-fill bg-cover rounded-xl">
        <div className="text-white">
          <h1 className="font-bold text-xl">Remix Wizard</h1>
          <p className="text-sm">
            Hit &quot;remix&quot; and craft your custom album cover in seconds
          </p>
        </div>
        <div className="w-fit">
          <Link href={"/remix-image/remix"} className="w-fit">
            <Button className="w-full sm:w-auto" variant={"secondary"}>
              Remix Image <GIcon>wand_stars</GIcon>
            </Button>
          </Link>
        </div>
      </div>

      <ImageCardGrid generationType="remix" />
    </section>
  );
}
