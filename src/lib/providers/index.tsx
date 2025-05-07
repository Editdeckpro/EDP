"use client";
import { SessionProvider } from "next-auth/react";
import React, { FC } from "react";

interface ProvidersProps {
  children: React.ReactNode;
}
const Providers: FC<ProvidersProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
export default Providers;
