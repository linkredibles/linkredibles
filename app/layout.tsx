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
  metadataBase: new URL("https://linkredibles.com"),

  title: {
    default: "Linkredibles — Discover Open-Source Projects Worth Knowing",
    template: "%s | Linkredibles",
  },

  description:
    "Discover interesting open-source projects, developer tools, AI apps, self-hosted software, and other things worth exploring.",

  applicationName: "Linkredibles",

  keywords: [
    "open source",
    "GitHub projects",
    "open source projects",
    "developer tools",
    "AI tools",
    "self-hosted software",
    "open source discovery",
  ],

  authors: [
    {
      name: "Linkredibles",
      url: "https://linkredibles.com",
    },
  ],

  creator: "Linkredibles",

  openGraph: {
    type: "website",
    siteName: "Linkredibles",
    title: "Linkredibles — Discover Open-Source Projects Worth Knowing",
    description:
      "A curated collection of interesting open-source projects, developer tools, AI apps, self-hosted software, and other things worth exploring.",
    url: "https://linkredibles.com",
  },

  twitter: {
    card: "summary",
    title: "Linkredibles — Discover Open-Source Projects Worth Knowing",
    description:
      "Discover interesting open-source projects worth knowing.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}