"use client";
import Image from "next/image";
import GIcon from "../g-icon";
import { Button } from "../ui/button";
import SidebarContent from "./sidebar-content";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Sidebar = ({}) => {
  return (
    <>
      <aside className="hidden lg:block p-5 bg-white border w-full rounded-3xl min-h-dvh space-y-5 text-sm text-gray-700 font-medium">
        <SidebarContent />
      </aside>
      <header className="lg:hidden block">
        <nav className=" flex items-center gap-2 justify-between">
          <div className="flex gap-2 items-center">
            <MobileNavSheet />
            <div className="-space-y-2">
              <h1 className="font-bold text-lg ">Dashboard</h1>
              <span className="text-xs ">
                Credit Remained: <samp>21,465</samp>
              </span>
            </div>
          </div>
          <Image
            src="/images/pfp.jpg"
            width={40}
            height={40}
            alt="pfp image"
            className="rounded-full"
          />
        </nav>
      </header>
    </>
  );
};
export default Sidebar;

const MobileNavSheet = () => {
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
        className="max-w-xs w-xs bg-transparent border-none"
      >
        {/* Accessibility only */}
        <SheetHeader className="hidden">
          <SheetTitle>Sidebar</SheetTitle>
          <SheetDescription>
            This is a sidebar for navigating different pages
          </SheetDescription>
        </SheetHeader>

        <div className="p-5 bg-white border w-full rounded-r-3xl min-h-dvh space-y-5 text-sm text-gray-700 font-medium overflow-y-scroll">
          <SidebarContent />
        </div>
      </SheetContent>
    </Sheet>
  );
};
