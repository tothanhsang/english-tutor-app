import type { Metadata } from "next";
import Link from "next/link";
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
  title: "English Q&A Tutor",
  description: "Figma-first Next.js scaffold",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="w-full border-b sticky top-0 bg-background/80 backdrop-blur z-10">
          <nav className="mx-auto max-w-6xl px-4 py-3 text-sm flex gap-4 flex-wrap items-center">
            <Link href="/" className="font-semibold">English Q&A Tutor</Link>
            <div className="flex gap-3 text-blue-600">
              <Link href="/auth/sign-in">Sign In</Link>
              <Link href="/onboarding">Onboarding</Link>
              <Link href="/dashboard">Dashboard</Link>
              <Link href="/lesson">Lesson</Link>
              <Link href="/question-bank">Question Bank</Link>
              <Link href="/progress">Progress</Link>
              <Link href="/settings">Settings</Link>
            </div>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
