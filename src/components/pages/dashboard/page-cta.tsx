import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import { FC } from "react";

interface PageCtaProps {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: string;
  imageSrc: string;
  bgImgSrc: string;
  buttonVariant?: "default" | "secondary";
}

const PageCta: FC<PageCtaProps> = ({
  bgImgSrc,
  buttonText,
  description,
  imageSrc,
  title,
  buttonVariant = "default",
}) => {
  return (
    <div
      className="rounded-lg overflow-hidden text-white p-6 flex  justify-between gap-4"
      style={{
        backgroundImage: `url(${bgImgSrc})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col justify-between">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
            {title}
          </h3>
          <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-xs">
            {description}
          </p>
        </div>

        <Button
          variant={buttonVariant === "default" ? "default" : "secondary"}
          className={`mt-4 w-fit ${
            buttonVariant === "secondary"
              ? "bg-orange-400 hover:bg-orange-500"
              : ""
          }`}
        >
          {buttonText}
          <Sparkles className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="xs-visible relative w-32 h-32 md:w-40 md:h-40 self-center md:self-auto">
        <Image
          src={imageSrc || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default PageCta;
