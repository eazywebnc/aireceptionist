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
  metadataBase: new URL("https://aireceptionist.eazyweb.nc"),
  alternates: {
    canonical: "https://aireceptionist.eazyweb.nc",
  },
  openGraph: {
    title: "AIReceptionist — AI-Powered 24/7 Phone Receptionist",
    description:
      "Never miss a call again. AI receptionist answers your phone 24/7.",
    url: "https://aireceptionist.eazyweb.nc",
    siteName: "AIReceptionist",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AIReceptionist",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://aireceptionist.eazyweb.nc",
  description:
    "AI-powered 24/7 phone receptionist. Answers calls, books appointments, and transfers important calls in natural conversation.",
  offers: [
    { "@type": "Offer", name: "Starter", price: "29", priceCurrency: "USD" },
    { "@type": "Offer", name: "Pro", price: "79", priceCurrency: "USD" },
    { "@type": "Offer", name: "Business", price: "199", priceCurrency: "USD" },
  ],
  creator: { "@type": "Organization", name: "EazyWebNC", url: "https://eazyweb.nc" },
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
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#050508] text-white">
        {children}
      </body>
    </html>
  );
}
