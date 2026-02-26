"use client";
import GIcon from "@/components/g-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { FC, useEffect } from "react";

const Page = () => {
  const { status, data } = useSession();
  const loading = status !== "authenticated" || !data;
  const generationsLabel =
    status === "authenticated" && data?.user
      ? data.user.monthlyLimit === null
        ? `${data.user.generationsUsedThisMonth} (Unlimited)`
        : `${data.user.generationsUsedThisMonth} / ${data.user.monthlyLimit}`
      : null;

  useEffect(() => {
    if (typeof window === "undefined") return;
    console.log("[EditDeck] user-info (editor): session", {
      status,
      hasData: !!data,
      hasUser: !!data?.user,
      loading,
      generations: generationsLabel ?? "(skeleton)",
    });
  }, [status, data, loading, generationsLabel]);

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden justify-between md:flex items-center">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-black">Editor</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Credits Badge - always visible; shows skeleton while session is loading/refreshing */}
          <div className="flex items-center gap-2 bg-white text-black outline outline-gray-300 rounded-full px-3 py-1 pl-[5px]">
            <div className="rounded-full bg-secondary p-2 aspect-square flex items-center justify-center text-xs font-bold">
              <GIcon name="toll" />
            </div>
            <div className="text-xs">
              <div className="leading-tight text-gray-600">
                Generations this month
              </div>
              <div className="font-semibold text-xs leading-tight text-primary">
                {status === "authenticated" && data?.user ? (
                  data.user.monthlyLimit === null ? (
                    `${data.user.generationsUsedThisMonth} (Unlimited)`
                  ) : (
                    `${data.user.generationsUsedThisMonth} / ${data.user.monthlyLimit}`
                  )
                ) : (
                  <Skeleton className="w-16 h-3" />
                )}
              </div>
            </div>
          </div>

          {/* User Profile */}
          <ProfileDropdown data={data ?? undefined} loading={loading} />
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden block">
        <nav className="flex items-center gap-2 justify-between">
          <div className="flex gap-2 items-center">
            {/* <MobileNavSheet /> */}
            <div>
              <div className="flex items-center gap-1">
                <h1 className="text-lg font-bold text-black">Editor</h1>
              </div>
              {/* Generations this month on mobile */}
              <div className="text-xs text-gray-500">
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

          <ProfileDropdown
            data={data ?? undefined}
            loading={loading}
            isMobile
          />
        </nav>
      </header>
    </>
  );
};
export default Page;

interface ProfileDropdownProps {
  isMobile?: boolean;
  data?: Session;
  loading: boolean;
}

const ProfileDropdown: FC<ProfileDropdownProps> = ({
  data,
  loading,
  isMobile = false,
}) => {
  if (loading || !data) {
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
    <a href={"/profile"} target="_top">
      <div
        className={cn(
          !isMobile &&
            "flex items-center gap-2 bg-gray-100 text-black rounded-full px-4 py-1 pl-[5px]"
        )}
      >
        <Image
          src={data.user.profileImage || "/images/pfp.jpg"}
          alt={`${data.user.username}'s profile picture`}
          width={42}
          height={42}
          className="rounded-full overflow-hidden"
        />
        {!isMobile && (
          <span className="text-sm font-medium text-gray-800">
            {data.user.username}
          </span>
        )}
      </div>
    </a>
  );
};
