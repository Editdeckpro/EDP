"use client";

import Image from "next/image";
import React from "react";
import GIcon from "../g-icon";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarSections } from "./sidebar-content";
import { MobileNavSheet } from "./sidebar";

export default function DashboardHeader() {
  const pathname = usePathname();

  const activeLink = sidebarSections
    .flatMap((section) => section.links)
    .find((link) => link.link === pathname);

  const title = activeLink?.text ?? "Dashboard";

  return (
    <>
      <header className="hidden justify-between lg:flex items-center">
        <h1 className="text-lg font-bold">{title}</h1>
        <div className="flex items-center gap-2">
          {/* Credits Badge */}
          <div className="flex items-center gap-2 bg-white text-black outline outline-gray-300 rounded-full px-3 py-1 pl-[5px]">
            <div className="rounded-full bg-secondary p-2 aspect-square flex items-center justify-center text-xs font-bold">
              <GIcon name="toll" />
            </div>
            <div className="text-xs">
              <div className="leading-tight text-gray-600">
                Credits Remained
              </div>
              <div className="font-semibold text-xs leading-tight text-primary">
                21,465
              </div>
            </div>
          </div>

          {/* User Profile */}
          <Link href={"#"}>
            <div className="flex items-center gap-2 bg-gray-100 text-black rounded-full px-4 py-1 pl-[5px]">
              <Image
                src="/images/pfp.jpg"
                alt="User Avatar"
                width={42}
                height={42}
                className="rounded-full overflow-hidden"
              />
              <span className="text-sm font-medium text-gray-800">HSung15</span>
            </div>
          </Link>
        </div>
      </header>
      <header className="lg:hidden block">
        <nav className=" flex items-center gap-2 justify-between">
          <div className="flex gap-2 items-center">
            <MobileNavSheet />
            <div className="-space-y-2">
              <h1 className="font-bold text-lg ">{title}</h1>
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
}
