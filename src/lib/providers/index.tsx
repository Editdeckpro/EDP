"use client";
import { AuthProvider } from "@/lib/auth-client";
import React, { FC } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}
const Providers: FC<ProvidersProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
export default Providers;
