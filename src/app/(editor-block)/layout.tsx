"use client";
import { AuthProvider } from "@/lib/auth-client";
import React, { FC } from "react";

interface LayoutProps {
  children: React.ReactNode;
}
const Layout: FC<LayoutProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
export default Layout;
