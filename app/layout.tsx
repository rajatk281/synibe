import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Poppins, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Provider } from "./Components/session-provider";
import Script from "next/script";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Synibe — Watch & Listen Together in Perfect Sync",
  description: "Sync your favorite movies, TV shows, and music with friends in real-time. Experience crystal-clear quality and perfect audio/video synchronization. Vibe together, anywhere.",
  keywords: ["watch together", "sync watch", "group watch", "listen together", "synibe", "shared video streaming", "sync play"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", poppins.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col select-none">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <Provider>{children}</Provider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

