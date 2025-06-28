import { Suspense } from "react";
import HistoryClient from "./HistoryClient";

export const metadata = {
  title: 'History | Raw Writer',
  description: 'View your humanization history and restore previous texts.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
}

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 border-opacity-20 rounded-full"></div>
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading your history...</p>
      </div>
    }>
      <HistoryClient />
    </Suspense>
  );
} 