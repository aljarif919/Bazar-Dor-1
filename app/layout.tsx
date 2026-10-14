import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর এক নজরে দেখুন।"
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="bn"><body><SiteShell>{children}</SiteShell><Toaster position="top-center" toastOptions={{duration:3000}} /></body></html>;
}