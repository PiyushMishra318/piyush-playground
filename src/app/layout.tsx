import type { Metadata } from "next";
import { Bricolage_Grotesque, Fraunces } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const body = Fraunces({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Piyush's GitHub Playground",
  description:
    "An interactive tour of Piyush Mishra's public GitHub projects — playful, curious, and definitely not a resume grid.",
  openGraph: {
    title: "Piyush's GitHub Playground",
    description: "Explore public repos the fun way.",
    url: "https://piyush-playground.vercel.app/",
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
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">{children}</body>
    </html>
  );
}
