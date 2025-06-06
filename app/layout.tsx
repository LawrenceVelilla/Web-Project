import type React from "react";
import "@/app/globals.css";
import { Afacad, Caveat, Libre_Baskerville } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Footer } from "@/components/footer";
import { HeaderNav } from "@/components/headerNav";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { cn } from "@/lib/utils";
import QueryProvider from "@/components/QueryProvider";

const afacad = Afacad({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-afacad",
});
const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-libre-baskerville",
});
const caveat = Caveat({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caveat",
});

export const metadata = {
  title: "UCourseMap - University of Alberta Course Planner",
  description:
    "Plan your University of Alberta courses easily with UCourseMap. Check prerequisites, course descriptions, and more.",
  openGraph: {
    title: "UCourseMap - University of Alberta Course Planner",
    description:
      "Plan your University of Alberta courses easily with UCourseMap. Check prerequisites, course descriptions, and more.",
    url: "https://uniplannerproject.vercel.app",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "UniPlanner - University of Alberta Course Planner",
      },
    ],
  },
  icons: {
    icon: "/icons/uniplannerplannerlogo.svg",
    shortcut: "/icons/uniplannerplannerlogo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen font-sans antialiased",
          afacad.variable,
          libreBaskerville.variable,
          caveat.variable,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <head>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover"
            />
            <meta name="theme-color" content="#606c5d" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          </head>
          <QueryProvider>
            <div className="relative flex min-h-screen flex-col">
              <header className="sticky top-0 z-50 w-full border-b border-border bg-card p-2 text-card-foreground backdrop-blur-md">
                <HeaderNav />
              </header>
              <main className="flex-1 w-full max-w-full overflow-x-hidden">
                <div className="px-2 sm:px-4 md:px-6 py-4">{children}</div>
                <SpeedInsights />
                <Analytics />
              </main>
              <Footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground" />
            </div>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
