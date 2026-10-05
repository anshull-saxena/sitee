import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinkFlow · Curated Link Directory",
  description: "A fast, minimalist archive of web tools, design inspiration, and engineering references.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} min-h-[100dvh] antialiased`}
    >
      <body className="min-h-[100dvh] flex flex-col bg-[#121110] text-[#f5f4ef]">
        {children}
      </body>
    </html>
  );
}
