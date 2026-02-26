"use client";
import { SessionProvider } from "next-auth/react";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <SessionProvider refetchOnWindowFocus={false} refetchInterval={5 * 60}>
      {children}
    </SessionProvider>
  );
};
export default Layout;
