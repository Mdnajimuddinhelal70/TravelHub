import SmoothScroll from "@/components/SmoothScroll";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Travel Hub — Discover Your Next Adventure",
    template: "%s | Travel Hub",
  },
  description:
    "Book curated tours, explore destinations across Bangladesh, and plan your perfect trip with AI. Trusted by travelers, powered by local guides.",
  keywords: [
    "travel",
    "bangladesh tours",
    "tour booking",
    "coxs bazar",
    "sundarban",
  ],
  authors: [{ name: "Travel Hub" }],
  openGraph: {
    type: "website",
    title: "Travel Hub — Discover Your Next Adventure",
    description:
      "Book curated tours and explore Bangladesh with AI-powered planning.",
    siteName: "Travel Hub",
  },
  twitter: {
    card: "summary_large_image",
    title: "Travel Hub",
    description:
      "Book curated tours and explore Bangladesh with AI-powered planning.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Toaster position="bottom-right" richColors />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
