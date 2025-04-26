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

      <SidebarLinkButton
        icon={<GIcon size={22}>home</GIcon>}
        link="/"
        text="Dashboard"
      />

      <ul className="space-y-1">
        <header className="font-bold text-black">Tools</header>
        <li className="pl-2">
          <SidebarLinkButton
            icon={<GIcon size={22}>wand_stars</GIcon>}
            link="#"
            text="Image Generation"
          />
        </li>
        <li className="pl-2">
          <SidebarLinkButton
            icon={<GIcon size={22}>cards_star</GIcon>}
            link="#"
            text="Remix Image"
            isNew
          />
        </li>
      </ul>
      <ul className="space-y-1">
        <header className="font-bold text-black">Subscription</header>
        <li className="pl-2">
          <SidebarLinkButton
            icon={<GIcon size={22}>crown</GIcon>}
            link="/subscription"
            text="Manage Subscription"
          />
        </li>
      </ul>
      <ul className="space-y-1">
        <header className="font-bold text-black">Other Options</header>
        <li className="pl-2">
          <SidebarLinkButton
            icon={<GIcon size={22}>live_help</GIcon>}
            link="#"
            text="Support"
          />
        </li>
        <li className="pl-2">
          <SidebarLinkButton
            icon={<GIcon size={22}>smart_display</GIcon>}
            link="#"
            text="Tutorial"
          />
        </li>
        <li className="pl-2">
          <SidebarLinkButton
            icon={<GIcon size={22}>quiz</GIcon>}
            link="#"
            text="FAQs"
          />
        </li>
      </ul>
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
