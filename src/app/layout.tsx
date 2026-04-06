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
  keywords: [
    "AI receptionist",
    "virtual receptionist",
    "AI phone answering",
    "24/7 receptionist",
    "automated call answering",
    "AI appointment booking",
    "business phone AI",
    "virtual front desk",
  ],
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
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "AIReceptionist",
      url: "https://aireceptionist.eazyweb.nc",
      publisher: {
        "@type": "Organization",
        name: "EazyWebNC",
        url: "https://eazyweb.nc",
        logo: { "@type": "ImageObject", url: "https://eazyweb.nc/logo.png" },
      },
    },
    {
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
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is AIReceptionist?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AIReceptionist is an AI-powered virtual receptionist that answers your business phone 24/7. It handles calls, books appointments, answers FAQs, and transfers important calls — all in natural conversation.",
          },
        },
        {
          "@type": "Question",
          name: "How does AIReceptionist answer phone calls?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "AIReceptionist uses advanced speech AI to have natural phone conversations. It understands caller intent, provides answers from your knowledge base, and can book appointments or transfer calls.",
          },
        },
        {
          "@type": "Question",
          name: "Can AIReceptionist book appointments automatically?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes! AIReceptionist integrates with your calendar to check availability and book appointments in real time during the call. No human intervention needed.",
          },
        },
      ],
    },
  ],
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
