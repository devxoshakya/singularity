import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppWrapper from "@/components/app-wrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MIET Results Listing - Singularity Project",
  description: "Fast, smart academic results platform by Dev Shakya & Akshita Srivastava",
  icons : {
    icon: "/favicon.png",
    
  },
  openGraph: {
    images: [
      {
        url: "https://miet-results-listing.pages.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "MIET Results Listing - Singularity Project",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script defer src="https://cloud.umami.is/script.js" data-website-id="4aca6dd4-9ce3-4aec-9624-0c60650ab73d"></script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWrapper>
          {children}
        </AppWrapper>
      </body>
    </html>
  );
}
