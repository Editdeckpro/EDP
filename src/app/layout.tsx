import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./g-font.css";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import NextTopLoader from "nextjs-toploader";
import { TourProvider } from "@/context/OnboardingTourContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const materialSymbols = localFont({
  src: "../font/MaterialSymbolsOutlined-VariableFont_FILL,GRAD,opsz,wght.ttf",
  display: "swap",
  variable: "--font-symbols",
});

export const metadata: Metadata = {
  title: "Edit Deck Pro - AI Album Cover Generator",
  description: "Edit Deck Pro - AI Album Cover Generator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta name="grammarly" content="off" />
      <body className={`${geistSans.variable} ${geistMono.variable} ${materialSymbols.variable} antialiased`}>
        <NextTopLoader color="#3E4EBA" />
        <Toaster richColors position="top-right" />
        <TourProvider>{children}</TourProvider>
      </body>
    </html>
  );
}
