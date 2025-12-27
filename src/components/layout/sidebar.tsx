"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import GIcon from "../g-icon";
import { Button } from "../ui/button";
import SidebarContent from "./sidebar-content";

export const SidebarWrapper = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  const updateShadows = () => {
    const el = containerRef.current;
    if (!el) return;

    setShowTop(el.scrollTop > 0);
    setShowBottom(el.scrollTop + el.clientHeight < el.scrollHeight);
  };

  useEffect(() => {
    updateShadows();
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateShadows);
    window.addEventListener("resize", updateShadows);
    return () => {
      el.removeEventListener("scroll", updateShadows);
      window.removeEventListener("resize", updateShadows);
    };
  }, []);

  return (
    <>
      <div className="max-w-sm w-full rounded-3xl overflow-hidden sticky top-5">
        {/* Top shadow */}
        {showTop && (
          <div className="pointer-events-none absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/10 to-transparent z-10 rounded-t-3xl" />
        )}
        {/* Bottom shadow */}
        {showBottom && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/10 to-transparent z-10 rounded-b-3xl" />
        )}

        <aside
          ref={containerRef}
          className="p-5 bg-blue-50/60 border w-full rounded-3xl space-y-5 text-sm text-gray-700 font-medium max-w-sm  min-h-[94dvh] max-h-[95dvh] overflow-y-scroll hide-scrollbar"
        >
          {children}
        </aside>
      </div>
    </>
  );
};

export default function Sidebar() {
  return (
    <SidebarWrapper>
      <SidebarContent />
    </SidebarWrapper>
  );
}

// This will be used in the header file for responsive layout
export const MobileNavSheet = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false); // close sheet on URL/pathname change
  }, [pathname]);

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
        className="max-w-screen w-xs bg-white/95 backdrop-blur-md border-none p-0"
      >
        {/* Accessibility only */}
        <SheetHeader className="hidden">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>
            This is a sidebar for navigating different pages
          </SheetDescription>
        </SheetHeader>

        <div className="p-2 py-5 bg-blue-50 border w-full rounded-r-3xl min-h-dvh space-y-5 text-sm text-gray-700 font-medium overflow-y-scroll">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};
