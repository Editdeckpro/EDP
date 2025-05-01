"use client";

import Image from "next/image";
import Link from "next/link";
import React, { FC, useState } from "react";
import { GenerateResType } from "./generate";

import GIcon from "@/components/g-icon";
import { sidebarSections } from "@/components/layout/sidebar-content";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import GenerateSidebarContent from "./generate/sidebar-content";

interface GenerateMobileHeaderProps {
  setData: GenerateResType;
}

const GenerateMobileHeader: FC<GenerateMobileHeaderProps> = ({ setData }) => {
  const pathname = usePathname();

  // Split the path into parts
  const pathParts = pathname.split("/").filter(Boolean);

  // Get corresponding link titles
  const breadcrumbs = pathParts.map((part, index) => {
    const linkPath = "/" + pathParts.slice(0, index + 1).join("/");
    const link = sidebarSections
      .flatMap((section) => section.links)
      .find((link) => link.link === linkPath);

    const title =
      link?.text ||
      part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); // fallback to formatted slug

    return { title, href: linkPath };
  });

  // Final Title or Breadcrumb
  const isRoot = breadcrumbs.length === 0;
  const pageTitle = isRoot
    ? "Dashboard"
    : breadcrumbs[breadcrumbs.length - 1].title;

  return (
    <header className="lg:hidden block">
      <nav className="flex items-center gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <MobileNavSheet setData={setData} />
          <div>
            <div className="flex items-center gap-1">
              {/* Mobile Breadcrumbs or Dashboard */}
              {isRoot ? (
                <h1 className="text-base font-bold text-black">{pageTitle}</h1>
              ) : (
                breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <Link
                      href={crumb.href}
                      className={`text-sm font-semibold hover:underline ${
                        index === 0 && breadcrumbs.length != 1
                          ? "text-muted-foreground"
                          : "text-black"
                      }`}
                    >
                      {crumb.title}
                    </Link>
                    {index < breadcrumbs.length - 1 && (
                      <span className="text-gray-400">/</span>
                    )}
                  </React.Fragment>
                ))
              )}
            </div>
            {/* Credits below on mobile */}
            <div className="text-xs text-gray-500">
              Credit Remained:{" "}
              <span className="font-bold text-primary">21,465</span>
            </div>
          </div>
        </div>

        <Link href={"/profile"}>
          <Image
            src="/images/pfp.jpg"
            width={40}
            height={40}
            alt="pfp image"
            className="rounded-full"
          />
        </Link>
      </nav>
    </header>
  );
};
export default GenerateMobileHeader;

interface MobileNavSheet {
  setData: GenerateResType;
}

const MobileNavSheet: FC<MobileNavSheet> = ({ setData }) => {
  const [open, setOpen] = useState(false);

  function closeSidebar() {
    setOpen(false);
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size={"icon"}
          className="rounded-full text-black cursor-pointer"
          variant={"secondary"}
        >
          <GIcon name="menu" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="max-w-screen w-xs bg-transparent border-none"
      >
        {/* Accessibility only */}
        <SheetHeader className="hidden">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>
            This is a sidebar for navigating different pages
          </SheetDescription>
        </SheetHeader>

        <div className="p-2 py-5 bg-white border w-full rounded-r-3xl min-h-dvh space-y-5 text-sm text-gray-700 font-medium overflow-y-scroll">
          <GenerateSidebarContent setData={setData} />
        </div>
      </SheetContent>
    </Sheet>
  );
};
