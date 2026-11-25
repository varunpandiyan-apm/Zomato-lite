import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zomato Lite — Ludhiana Burrito",
  description: "Reviews and ratings for Ludhiana Burrito in Sector 32.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} min-h-screen font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
