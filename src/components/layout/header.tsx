import Image from "next/image";
import React from "react";
import GIcon from "../g-icon";
import Link from "next/link";

export default function DashboardHeader() {
  return (
    <header className="hidden justify-between lg:flex items-center">
      <h1 className="text-lg font-bold">Dashboard</h1>
      <div className="flex items-center gap-2">
        {/* Credits Badge */}
        <div className="flex items-center gap-2 bg-white text-black outline outline-gray-300 rounded-full px-3 py-1 pl-[5px]">
          <div className="rounded-full bg-secondary p-2 aspect-square flex items-center justify-center text-xs font-bold">
            <GIcon name="toll" />
          </div>
          <div className="text-xs">
            <div className="leading-tight text-gray-600">Credits Remained</div>
            <div className="font-semibold text-xs leading-tight text-primary">
              21,465
            </div>
          </div>
        </div>

        {/* User Profile */}
        {/* todo add profile link */}
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
  );
}
