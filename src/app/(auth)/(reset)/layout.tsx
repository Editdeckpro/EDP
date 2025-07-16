import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = async ({ children }) => {
  const headersList = await headers();
  const referer = headersList.get("referer");
  const previousPath = referer ? new URL(referer).pathname : "/login";

  return (
    <>
      <Link href={previousPath || "/login"}>
        <Button
          variant={"link"}
          className="absolute top-2 left-1 cursor-pointer text-white text-lg md:text-black font-medium"
        >
          <ChevronLeft className="size-6" /> Back
        </Button>
      </Link>
      {children}
    </>
  );
};
export default Layout;
