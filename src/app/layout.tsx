import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/AuthContext";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { PostHogProvider } from "@/lib/PostHogProvider";
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
  title: "AI Humanizer - Transform AI Text to Human-Like Content",
  description: "AI Humanizer helps you transform AI-generated content into natural, human-like text that connects with your audience.",
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
        <AuthProvider>
          <PostHogProvider>
            <CookieConsent>
              <Header />
              {children}
              <Footer />
            </CookieConsent>
          </PostHogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
