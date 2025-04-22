import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Link href={"/login"}>
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
