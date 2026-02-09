"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactNode, useState } from "react";

import GIcon from "@/components/g-icon";
import ProfileDropdown from "@/components/layout/profile-dropdown";
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
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

interface PromptMobileHeaderProps {
  SidebarContent: ReactNode;
}

const PromptMobileHeader = ({ SidebarContent }: PromptMobileHeaderProps) => {
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const { status, data } = useSession();

  const breadcrumbs = pathParts.map((part, index) => {
    const linkPath = "/" + pathParts.slice(0, index + 1).join("/");
    const link = sidebarSections
      .flatMap((section) => section.links)
      .find((link) => link.link === linkPath);

    const title =
      link?.text ||
      part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    return { title, href: linkPath };
  });

  const isRoot = breadcrumbs.length === 0;
  const pageTitle = isRoot
    ? "Dashboard"
    : breadcrumbs[breadcrumbs.length - 1].title;

  return (
    <header className="lg:hidden block">
      <nav className="flex items-center gap-2 justify-between">
        <div className="flex gap-2 items-center">
          <MobileNavSheet SidebarContent={SidebarContent} />
          <div>
            <div className="flex items-center gap-1">
              {isRoot ? (
                <h1 className="text-base font-bold text-black">{pageTitle}</h1>
              ) : (
                breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <Link
                      href={crumb.href}
                      className={`text-sm font-semibold hover:underline ${
                        index === 0 && breadcrumbs.length !== 1
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
            <div className="text-xs text-gray-500">
              Generations this month:{" "}
              <span className="font-bold text-primary">
                {status === "authenticated" && data?.user ? (
                  data.user.monthlyLimit === null ? (
                    `${data.user.generationsUsedThisMonth} (Unlimited)`
                  ) : (
                    `${data.user.generationsUsedThisMonth} / ${data.user.monthlyLimit}`
                  )
                ) : (
                  <Skeleton className="w-16 h-3" />
                )}
              </span>
            </div>
          </div>
        </div>

        <ProfileDropdown isMobile />
      </nav>
    </header>
  );
};

export default PromptMobileHeader;

interface MobileNavSheetProps {
  SidebarContent: ReactNode;
}

const MobileNavSheet = ({ SidebarContent }: MobileNavSheetProps) => {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="icon"
          className="rounded-full text-black cursor-pointer"
          variant="secondary"
        >
          <GIcon name="menu" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="max-w-screen w-xs bg-white/95 backdrop-blur-md border-none p-0"
      >
        <SheetHeader className="hidden">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>
            This is a sidebar for navigating different pages
          </SheetDescription>
        </SheetHeader>

        <div className="p-2 py-5 bg-blue-50 border w-full rounded-r-3xl min-h-dvh space-y-5 text-sm text-gray-700 font-medium overflow-y-scroll">
          {SidebarContent}
        </div>
      </SheetContent>
    </Sheet>
  );
};
