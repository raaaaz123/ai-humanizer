import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/lib/AuthContext";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { PostHogProvider } from "@/lib/PostHogProvider";
import { Suspense } from "react";
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
  title: "Raw Writer - #1 AI Humanizer Tool | Bypass AI Detectors | 100% Undetectable AI Text",
  description: "Raw Writer is the leading AI humanizer tool that transforms AI-generated content into 100% human-like text. Bypass AI detectors like Turnitin, GPTZero, Content at Scale, Originality.ai, and ZeroGPT with our advanced AI text converter. Make your ChatGPT, Gemini, Claude, and Bard content completely undetectable.",
  keywords: "AI humanizer, bypass AI detection, undetectable AI text, humanize AI content, AI content humanizer, ChatGPT humanizer, AI text converter, AI to human text, AI writing tool, AI detector bypass, make AI text human, free AI humanizer, Raw Writer, Turnitin bypass, GPTZero bypass, AI detection remover, humanize ChatGPT text",
  authors: [{ name: "Raw Writer Team" }],
  creator: "Raw Writer",
  publisher: "Raw Writer",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#5bbad5'
      },
    ]
  },
  manifest: '/site.webmanifest',
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  themeColor: "#ffffff",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Raw Writer - AI Humanizer',
  },
  applicationName: 'Raw Writer - AI Humanizer',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: 'Raw Writer - #1 AI Humanizer Tool | Bypass AI Detectors | 100% Undetectable AI Text',
    description: 'Raw Writer transforms AI-generated content into 100% human-like text. Bypass AI detectors like Turnitin, GPTZero, and Content at Scale with our advanced AI humanizer. Try our free AI text converter today!',
    url: 'https://rawwriter.com',
    siteName: 'Raw Writer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Raw Writer - AI Humanizer Tool',
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Raw Writer - #1 AI Humanizer Tool | Bypass AI Detectors',
    description: 'Transform AI-generated content into 100% human-like text. Bypass AI detectors with our advanced AI humanizer. Try our free AI text converter today!',
    images: ['/twitter-image.png'],
    creator: '@rawwriter',
  },
  alternates: {
    canonical: 'https://rawwriter.com',
    languages: {
      'en-US': 'https://rawwriter.com',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'verification_token',
    yandex: 'verification_token',
  },
  category: 'AI Tools',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <Suspense>
            <PostHogProvider>
              <CookieConsent>
                <div className="flex flex-col min-h-screen">
                  <Header />
                  <main className="flex-grow">
                    {children}
                  </main>
                  <Footer />
                </div>
              </CookieConsent>
            </PostHogProvider>
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
