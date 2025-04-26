"use client";
import Image from "next/image";
import React from "react";
import GIcon from "../g-icon";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";

export default function SidebarContent() {
  return (
    <>
      <Image src={"/images/logo.jpg"} width={110} height={110} alt="logo" />
      <Separator />

      {sidebarSections.map((section, i) => (
        <ul className="space-y-1" key={i}>
          {section.header && (
            <header className="font-bold text-black">{section.header}</header>
          )}
          {section.links.map((item, idx) => (
            <li className="pl-2" key={idx}>
              <SidebarLinkButton
                icon={item.icon}
                link={item.link}
                text={item.text}
                isNew={item.isNew}
              />
            </li>
          ))}
        </ul>
      ))}
    </>
  );
}

interface SidebarLinkButtonProp {
  link: string;
  text: string;
  icon: React.ReactNode;
  className?: string;
  isNew?: boolean;
}

const SidebarLinkButton = ({
  icon,
  link,
  text,
  className,
  isNew = false,
}: SidebarLinkButtonProp) => {
  const pathname = usePathname();

  const isActive = pathname === link; // <- simple matching
  // if you want *startsWith* behavior (for nested routes), use:
  // const isActive = pathname.startsWith(link);

  return (
    <Link href={link}>
      <Button
        variant={isActive ? "default" : "ghost"}
        size={"full"}
        className={cn(
          "flex justify-start items-center font-normal cursor-pointer w-full text-wrap gap-2",
          isActive ? "" : "hover:bg-gray-200 hover:text-black",
          className
        )}
      >
        {icon}
        <div className="text-wrap">{text}</div>
        {isNew && (
          <span className="py-[2px] px-2 bg-[#FF8A3D] rounded-sm text-xs font-semibold">
            New
          </span>
        )}
      </Button>
    </Link>
  );
};

type SidebarLink = {
  icon: React.ReactNode;
  text: string;
  link: string;
  isNew?: boolean;
};

export type SidebarSectionType = {
  header: string | null;
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
        icon: <GIcon size={22}>wand_stars</GIcon>,
        text: "Image Generation",
        link: "#",
      },
      {
        icon: <GIcon size={22}>cards_star</GIcon>,
        text: "Remix Image",
        link: "#",
        isNew: true,
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
      },
    ],
  },
  {
    header: "Other Options",
    links: [
      {
        icon: <GIcon size={22}>live_help</GIcon>,
        text: "Support",
        link: "#",
      },
      {
        icon: <GIcon size={22}>smart_display</GIcon>,
        text: "Tutorial",
        link: "#",
      },
      {
        icon: <GIcon size={22}>quiz</GIcon>,
        text: "FAQs",
        link: "#",
      },
    ],
  },
];
