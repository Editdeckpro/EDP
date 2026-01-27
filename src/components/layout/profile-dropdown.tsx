"use client";
import Image from "next/image";
import Link from "next/link";
import React, { FC, useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoggingOut) {
      return;
    }

    if (countdown === null) {
      return;
    }

    if (countdown <= 0) {
      return;
    }

    const id = window.setTimeout(() => {
      setCountdown((prev) => (typeof prev === "number" ? prev - 1 : prev));
    }, 1000);

    return () => window.clearTimeout(id);
  }, [countdown, isLoggingOut]);

  useEffect(() => {
    if (!isLoggingOut || countdown !== 0) {
      return;
    }

    (async () => {
      try {
        await signOut({ redirect: true, callbackUrl: "/login" });
      } finally {
        window.setTimeout(() => {
          if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
            window.location.href = "/login";
          }
        }, 300);
      }
    })();
  }, [countdown, isLoggingOut]);

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
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setLogoutOpen(true);
              setIsLoggingOut(false);
              setCountdown(null);
            }}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={logoutOpen}
        onOpenChange={(open) => {
          if (isLoggingOut) {
            return;
          }
          setLogoutOpen(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isLoggingOut ? "Logging out" : "Confirm logout"}
            </DialogTitle>
          </DialogHeader>

          {isLoggingOut ? (
            <div className="text-sm text-muted-foreground">
              Logging out in {countdown ?? 3}s…
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              Are you sure you want to logout?
            </div>
          )}

          <DialogFooter>
            {isLoggingOut ? (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsLoggingOut(false);
                  setCountdown(null);
                  setLogoutOpen(false);
                  router.refresh();
                }}
              >
                Cancel
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setLogoutOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    setIsLoggingOut(true);
                    setCountdown(3);
                  }}
                >
                  Logout
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default ProfileDropdown;
