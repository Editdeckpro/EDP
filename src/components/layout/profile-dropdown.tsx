"use client";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { clearAllStorageOnLogout } from "@/lib/clear-storage";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleConfirmLogout() {
    setIsLoggingOut(true);
    clearAllStorageOnLogout();
    try {
      await signOut({ redirect: true, callbackUrl: "/login" });
    } finally {
      setIsLoggingOut(false);
      setLogoutOpen(false);
    }
  }

  const showSkeleton = session.status !== "authenticated" || !session.data?.user;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (showSkeleton) {
      console.log("[EditDeck] ProfileDropdown: showing skeleton", {
        status: session.status,
        hasData: !!session.data,
        hasUser: !!session.data?.user,
      });
    } else {
      console.log("[EditDeck] ProfileDropdown: showing user", { username: session.data?.user?.username });
    }
  }, [showSkeleton, session.status, session.data]);

  if (showSkeleton) {
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

  const user = session.data.user;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div
            className={cn(
              !isMobile &&
                "flex items-center gap-2 bg-gray-100 text-black rounded-full px-4 py-1 pl-[5px]"
            )}
          >
            <Image
              src={user.profileImage || "/images/pfp.jpg"}
              alt={`${user.username}'s profile picture`}
              width={42}
              height={42}
              className="rounded-full overflow-hidden"
            />
            {!isMobile && (
              <span className="text-sm font-medium text-gray-800">
                {user.firstName} {user.lastName || ""}
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
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setLogoutOpen(true);
              setIsLoggingOut(false);
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={logoutOpen}
        onOpenChange={(open) => {
          if (!isLoggingOut) setLogoutOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm logout</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Are you sure you want to logout?
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setLogoutOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out…" : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ProfileDropdown;
