import Image from "next/image";
import React from "react";
import GIcon from "../g-icon";
import Link from "next/link";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";

export default function SidebarContent() {
  return (
    <>
      <Image src={"/images/logo.jpg"} width={110} height={110} alt="logo" />
      <Separator />

      <SidebarLinkButton
        icon={<GIcon size={22}>home</GIcon>}
        link="#"
        text="Dashboard"
        active
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
            link="#"
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
  active?: boolean;
  className?: string;
  isNew?: boolean;
}
const SidebarLinkButton = ({
  icon,
  link,
  text,
  className,
  active = false,
  isNew = false,
}: SidebarLinkButtonProp) => {
  return (
    <Link href={link}>
      <Button
        variant={active ? "default" : "ghost"}
        size={"full"}
        className={cn(
          "flex justify-start items-center font-normal cursor-pointer w-full text-wrap",
          active ? "" : "hover:bg-gray-200",
          className
        )}
      >
        {icon} <div className="text-wrap">{text}</div>
        {isNew && (
          <span className="py-[2px] px-2 bg-[#FF8A3D] rounded-sm text-xs font-semibold">
            New
          </span>
        )}
      </Button>
    </Link>
  );
};
