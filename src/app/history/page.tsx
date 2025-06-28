import { Suspense } from "react";
import HistoryClient from "./HistoryClient";

export const metadata = {
  title: 'History | Raw Writer',
  description: 'View your humanization history and restore previous texts.',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#ffffff'
}

export default function HistoryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    }>
      <HistoryClient />
    </Suspense>
  );
} 