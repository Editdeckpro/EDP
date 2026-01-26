"use client";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import { useSession } from "next-auth/react";
import { SubscriptionRequiredModal } from "@/components/pages/auth/subscription-required-modal";

interface PageCtaProps {
  title: string;
  description: string;
  buttonText: string;
  buttonIcon: string;
  imageSrc: string;
  bgImgSrc: string;
  buttonVariant?: "default" | "secondary";
  btnLink: string;
  disabled?: boolean;
  upgradeRequired?: boolean;
  planRestriction?: {
    allowedPlans: string[];
    message: string;
  };
}

const PageCta: FC<PageCtaProps> = ({
  bgImgSrc,
  buttonText,
  description,
  imageSrc,
  title,
  btnLink,
  buttonVariant = "default",
  disabled = false,
  upgradeRequired = false,
  planRestriction,
}) => {
  const { data: session } = useSession();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const planType = session?.user?.subscription?.planType || "FREE";
  const isDisabled = disabled || (planRestriction && !planRestriction.allowedPlans.includes(planType));

  const handleClick = (e: React.MouseEvent) => {
    if (isDisabled || upgradeRequired) {
      e.preventDefault();
      setShowUpgradeModal(true);
    }
  };

  return (
    <>
      <div
        className={`rounded-lg overflow-hidden text-white p-6 flex justify-between gap-4 ${isDisabled ? "opacity-60" : ""}`}
        style={{
          backgroundImage: `url(${bgImgSrc})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">{title}</h3>
            <p className="text-white/80 text-sm sm:text-base md:text-lg max-w-xs">{description}</p>
            {isDisabled && planRestriction && (
              <p className="text-white/60 text-xs mt-2">{planRestriction.message}</p>
            )}
          </div>

          <div className="w-full sm:w-fit">
            <Link href={isDisabled ? "#" : btnLink} onClick={handleClick}>
              <Button
                variant={buttonVariant === "default" ? "default" : "secondary"}
                disabled={isDisabled}
                className={`mt-4 w-full sm:w-fit ${buttonVariant === "secondary" ? "bg-orange-400 hover:bg-orange-500" : ""
                  } text-sm sm:text-base px-3 sm:px-4 sm:py-3 ${isDisabled ? "cursor-not-allowed" : ""}`}
                id={buttonText.toLowerCase() === "generate now" ? "step-3" : undefined}
              >
                {buttonText}
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="xs-visible relative w-32 h-32 md:w-40 md:h-40 self-center md:self-auto">
          <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover rounded-lg" />
        </div>
      </div>

      {showUpgradeModal && (
        <SubscriptionRequiredModal
          open={showUpgradeModal}
          onOpenChange={setShowUpgradeModal}
          details={{
            title: "Upgrade Required",
            message: planRestriction?.message || "This feature requires a higher plan. Please upgrade to continue.",
            actionText: "Upgrade Now",
            actionLink: "/subscription",
          }}
        />
      )}
    </>
  );
};

export default PageCta;
