import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { AppNavigation } from "@/components/layout/AppNavigation";
import { NoiseOverlay } from "@/components/layout/NoiseOverlay";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "The Looksmaxx & Gorbagana Community Connection",
  description: "Looksmaxxing meets Gorbagana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-headline antialiased">
        <AppProvider>
          <div className="relative min-h-screen">
            <NoiseOverlay />
            <main className="pb-20">{children}</main>
            <AppNavigation />
          </div>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
