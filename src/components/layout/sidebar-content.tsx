"use client";
import Image from "next/image";
import React from "react";
import GIcon from "../g-icon";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface SidebarContent {
  target?: React.HTMLAttributeAnchorTarget;
}

export default function SidebarContent({ target }: SidebarContent) {
  return (
    <>
      <Image
        src={"/images/logo.jpg"}
        width={110}
        height={110}
        alt="edit deck pro logo.png"
        priority
        fetchPriority="high"
        className="mx-auto"
      />
      <Separator />

      {sidebarSections.map(
        (section, i) =>
          section.header != false && (
            <div key={i} className="space-y-1">
              {section.header && <header className="font-bold text-black mb-3">{section.header}</header>}
              <ul className="space-y-3" id={section.header === "Other Options" ? "step-1" : undefined}>
                {section.links.map((item, idx) => (
                  <li className={cn("pl-2")} key={idx} id={item.text === "Upload" ? "step-2" : undefined}>
                    <SidebarLinkButton {...item} target={target} />
                  </li>
                ))}
              </ul>
            </div>
          )
      )}
    </>
  );
}

const SidebarLinkButton = ({
  icon,
  link,
  text,
  className,
  bgClassName,
  isNew = false,
  tooltip,
  target,
}: SidebarLink) => {
  const pathname = usePathname();

  const isActive = pathname === link; // <- simple matching
  // if you want *startsWith* behavior (for nested routes), use:
  // const isActive = pathname.startsWith(link);

  return (
    <Link href={link} target={target}>
      <Tooltip>
        <TooltipTrigger className="w-full" asChild>
          <Button
            variant={isActive ? "default" : "ghost"}
            size={"full"}
            className={cn(
              "flex justify-between items-center font-normal cursor-pointer w-full text-wrap gap-2",
              isActive ? "" : "hover:bg-gray-200 hover:text-black",
              className,
              !isActive && bgClassName
            )}
            tabIndex={-1}
          >
            <div data-active={!isActive} className="flex items-center gap-2 min-w-0 flex-1 group">
              {icon}
              <span className="font-semibold truncate">{text}</span>
            </div>
            {isNew && (
              <span
                className={cn(
                  "py-[2px] px-2 bg-[#FF8A3D] rounded-sm text-xs font-semibold",
                  isActive && "bg-white text-black"
                )}
              >
                New
              </span>
            )}
          </Button>
        </TooltipTrigger>
        {tooltip && tooltip != "" && <TooltipContent>{tooltip}</TooltipContent>}
      </Tooltip>
    </Link>
  );
};

type SidebarLink = {
  icon: React.ReactNode;
  text: string;
  link: string;
  isNew?: boolean;
  bgClassName?: string;
  tooltip?: string;
  className?: string;
  target?: React.HTMLAttributeAnchorTarget;
};

export type SidebarSectionType = {
  header: string | null | false;
  links: SidebarLink[];
};

export const sidebarSections: SidebarSectionType[] = [
  {
    header: null,
    links: [
      {
        icon: <GIcon size={22}>home</GIcon>,
        text: "Dashboard",
        link: "/",
      },
    ],
  },
  {
    header: "Tools",
    links: [
      {
        icon: (
          <GIcon size={22} className="group-data-[active=true]:text-primary">
            wand_stars
          </GIcon>
        ),
        text: "Content Creator",
        link: "/image-generation",
        bgClassName: "bg-primary/20 hover:bg-primary/25",
        tooltip: "Generate brand-new, customized album cover.",
      },
      {
        icon: (
          <GIcon size={22} className="group-data-[active=true]:text-secondary">
            cards_star
          </GIcon>
        ),
        text: "Upload",
        link: "/remix-image",
        isNew: true,
        bgClassName: "bg-secondary/20 hover:bg-secondary/20",
        tooltip: "Convert existing photo to album cover.",
      },
      {
        icon: (
          <GIcon size={22} className="group-data-[active=true]:text-purple-600">
            smart_display
          </GIcon>
        ),
        text: "Lyric Videos",
        link: "/lyric-videos",
        bgClassName: "bg-purple-600/10 hover:bg-purple-600/20",
        tooltip: "Create lyric videos with AI-powered timing.",
      },
    ],
  },
  {
    header: "Subscription",
    links: [
      {
        icon: <GIcon size={22}>crown</GIcon>,
        text: "Manage Subscription",
        link: "/subscription",
        bgClassName: "bg-green-600/10 hover:bg-green-600/10",
      },
    ],
  },
  {
    header: "Other Options",
    links: [
      {
        icon: <GIcon size={22}>live_help</GIcon>,
        text: "Support",
        link: "/support",
      },
      {
        icon: <GIcon size={22}>smart_display</GIcon>,
        text: "Tutorial",
        link: "/tutorial",
      },
      {
        icon: <GIcon size={22}>quiz</GIcon>,
        text: "FAQs",
        link: "/faq",
      },
    ],
  },
  // other routes that does not show on sidebar
  // but necessary for header title
  {
    header: false,
    links: [
      {
        icon: <></>,
        text: "My Profile",
        link: "/profile",
      },
      {
        icon: <></>,
        text: "Edit Profile",
        link: "/profile/edit",
      },
    ],
  },
];
