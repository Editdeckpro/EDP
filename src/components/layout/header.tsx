"use client";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { FC } from "react";
import GIcon from "../g-icon";
import ProfileDropdown from "./profile-dropdown";
import { MobileNavSheet } from "./sidebar";
import { sidebarSections } from "./sidebar-content";
import { useSession } from "@/lib/auth-client";
import { useUserUsage } from "@/hook/use-user-usage";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { useTour } from "@/context/OnboardingTourContext";

interface HeaderProps {
  type?: "prompt" | "nav";
}

const DashboardHeader: FC<HeaderProps> = ({ type = "nav" }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { status, data } = useSession();
  const { generationsUsedThisMonth, monthlyLimit, isLoading: usageLoading } = useUserUsage();
  const { handleStartTour } = useTour();

  // Split the path into parts
  const pathParts = pathname.split("/").filter(Boolean);

  // Get corresponding link titles
  const breadcrumbs = pathParts.map((part, index) => {
    const linkPath = "/" + pathParts.slice(0, index + 1).join("/");
    const link = sidebarSections.flatMap((section) => section.links).find((link) => link.link === linkPath);

    const title = link?.text || part.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()); // fallback to formatted slug

    return { title, href: linkPath };
  });

  // Handle back button
  const handleBack = () => {
    if (pathParts.length > 1) {
      const newPath = "/" + pathParts.slice(0, -1).join("/");
      router.push(newPath);
    } else {
      router.push("/"); // If at root, go home
    }
  };

  // Final Title or Breadcrumb
  const isRoot = breadcrumbs.length === 0;
  const pageTitle = isRoot ? "Dashboard" : breadcrumbs[breadcrumbs.length - 1].title;

  return (
    <>
      {/* Desktop Header */}
      <header className="hidden justify-between lg:flex items-center">
        <div className="flex items-center gap-2">
          {/* Back Button - Show only if more than 1 path part */}
          {breadcrumbs.length > 1 && (
            <button
              onClick={handleBack}
              className="text-primary hover:text-primary/80 transition cursor-pointer"
              suppressHydrationWarning
            >
              <ChevronLeft className="text-2xl" />
            </button>
          )}

          {/* Breadcrumbs or Dashboard title */}
          {isRoot ? (
            <h1 className="text-lg font-bold text-black">{pageTitle}</h1>
          ) : (
            breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <Link
                  href={crumb.href}
                  className={`text-lg font-bold hover:underline ${
                    index === 0 && breadcrumbs.length != 1 ? "text-muted-foreground" : "text-black"
                  }`}
                >
                  {crumb.title}
                </Link>
                {index < breadcrumbs.length - 1 && <span className="text-gray-400">/</span>}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            size={"sm"}
            variant={"outline"}
            onClick={handleStartTour}
            className="cursor-pointer text-primary border-primary hover:bg-primary hover:text-white rounded-3xl"
          >
            Onboarding Tour
          </Button>
          {/* Monthly generations badge */}
          <div className="flex items-center gap-2 bg-white text-black outline outline-gray-300 rounded-full px-3 py-1 pl-[5px]">
            <div className="rounded-full bg-secondary p-2 aspect-square flex items-center justify-center text-xs font-bold">
              <GIcon name="toll" />
            </div>
            <div className="text-xs">
              <div className="leading-tight text-gray-600">Generations this month</div>
              <div className="font-semibold text-xs leading-tight text-primary">
                {status === "authenticated" && data?.user ? (
                  usageLoading ? (
                    <Skeleton className="w-16 h-3" />
                  ) : monthlyLimit === null ? (
                    `${generationsUsedThisMonth.toLocaleString()} (Unlimited)`
                  ) : (
                    `${generationsUsedThisMonth.toLocaleString()} / ${monthlyLimit}`
                  )
                ) : (
                  <Skeleton className="w-16 h-3" />
                )}
              </div>
            </div>
          </div>

          {/* User Profile */}

          <ProfileDropdown />
        </div>
      </header>

      {/* Mobile Header */}
      {type === "nav" && (
        <header className="lg:hidden block">
          <nav className="flex items-center gap-2 justify-between">
            <div className="flex gap-2 items-center">
              <MobileNavSheet />
              <div>
                <div className="flex items-center gap-1">
                  {/* Mobile Breadcrumbs or Dashboard */}
                  {isRoot ? (
                    <h1 className="text-base font-bold text-black">{pageTitle}</h1>
                  ) : (
                    breadcrumbs.map((crumb, index) => (
                      <React.Fragment key={index}>
                        <Link
                          href={crumb.href}
                          className={`text-sm font-semibold hover:underline ${
                            index === 0 && breadcrumbs.length != 1 ? "text-muted-foreground" : "text-black"
                          }`}
                        >
                          {crumb.title}
                        </Link>
                        {index < breadcrumbs.length - 1 && <span className="text-gray-400">/</span>}
                      </React.Fragment>
                    ))
                  )}
                </div>
                {/* Generations this month on mobile */}
                <div className="text-xs text-gray-500">
                  Generations this month:{" "}
                  <span className="font-bold text-primary">
                    {status === "authenticated" && data?.user ? (
                      usageLoading ? (
                        <Skeleton className="w-16 h-3" />
                      ) : monthlyLimit === null ? (
                        `${generationsUsedThisMonth} (Unlimited)`
                      ) : (
                        `${generationsUsedThisMonth} / ${monthlyLimit}`
                      )
                    ) : (
                      <Skeleton className="w-16 h-3" />
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-center">
              <Button
                size={"sm"}
                variant={"outline"}
                onClick={handleStartTour}
                className="cursor-pointer text-primary border-primary hover:bg-primary hover:text-white rounded-3xl"
              >
                Onboarding
              </Button>

              <ProfileDropdown isMobile />
            </div>
          </nav>
        </header>
      )}
    </>
  );
};
export default DashboardHeader;
