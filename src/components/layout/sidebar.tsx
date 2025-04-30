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
import { useEffect, useState } from "react";
import GIcon from "../g-icon";
import { Button } from "../ui/button";
import SidebarContent from "./sidebar-content";

const Sidebar = ({}) => {
  return (
    <>
      <aside className="p-5 bg-white border w-full rounded-3xl min-h-dvh space-y-5 text-sm text-gray-700 font-medium">
        <SidebarContent />
      </aside>
    </>
  );
};
export default Sidebar;

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
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};
