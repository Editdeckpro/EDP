"use client";
import Image from "next/image";
import Link from "next/link";
import React, { FC } from "react";
import { Skeleton } from "../ui/skeleton";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileDropdownProps {
  isMobile?: boolean;
}

const ProfileDropdown: FC<ProfileDropdownProps> = ({ isMobile = false }) => {
  const session = useSession();

  if (session.status != "authenticated") {
    return (
      <div
        className={cn(
          !isMobile &&
            "flex items-center gap-2 bg-gray-200 rounded-full px-4 py-1 pl-[5px]"
        )}
      >
        <Skeleton className="w-[42px] h-[42px] rounded-full" />
        {!isMobile && <Skeleton className="h-4 w-20 rounded-md" />}
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div
          className={cn(
            !isMobile &&
              "flex items-center gap-2 bg-gray-100 text-black rounded-full px-4 py-1 pl-[5px]"
          )}
        >
          <Image
            src={session.data.user.profileImage || "/images/pfp.jpg"}
            alt={`${session.data.user.username}'s profile picture`}
            width={42}
            height={42}
            className="rounded-full overflow-hidden"
          />
          {!isMobile && (
            <span className="text-sm font-medium text-gray-800">
              {session.data.user.firstName} {session.data.user.lastName || ""}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href={"/profile"}>
          <DropdownMenuItem>Profile</DropdownMenuItem>
        </Link>
        <DropdownMenuItem variant="destructive" onClick={() => signOut()}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
export default ProfileDropdown;
