import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "AIReceptionist — AI-Powered 24/7 Phone Receptionist",
  description:
    "Never miss a call again. AI receptionist answers your phone 24/7, books appointments, answers questions, and transfers important calls — all in natural conversation.",
  openGraph: {
    title: "AIReceptionist — AI-Powered 24/7 Phone Receptionist",
    description:
      "Never miss a call again. AI receptionist answers your phone 24/7.",
    url: "https://aireceptionist.eazyweb.nc",
    siteName: "AIReceptionist",
    type: "website",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-[#050508] text-white">
        {children}
      </body>
    </html>
  );
}
