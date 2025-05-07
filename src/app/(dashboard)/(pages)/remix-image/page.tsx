import GIcon from "@/components/g-icon";
import ImageCardGrid from "@/components/pages/dashboard/image-card-grid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  return (
    <section className="space-y-5">
      <div className="flex flex-col gap-5 py-10 text-center sm:text-left sm:flex-row justify-between items-center px-3 sm:py-5 bg-[url('/images/cta-2.jpg')] bg-no-repeat object-fill bg-cover rounded-xl">
        <div className="text-white">
          <h1 className="font-bold text-xl">Remix Wizard</h1>
          <p className="text-sm">
            Lorem ipsum dolor sit amet. Aut laudantium nobis aut dolores
            suscipit eos dicta culpa
          </p>
        </div>
        <Link href={"/remix-image/remix"}>
          <Button className="w-full sm:w-auto" variant={"secondary"}>
            Remix Image <GIcon>wand_stars</GIcon>
          </Button>
        </Link>
      </div>

      <ImageCardGrid generationType="remix" />
    </section>
  );
}
