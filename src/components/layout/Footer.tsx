"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useCookieConsent } from "@/components/ui/cookie-consent";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isMounted, setIsMounted] = useState(false);
  const { showCookieSettings } = useCookieConsent();

  // Fix hydration issues by only rendering form elements on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      // Save email to Firestore
      await addDoc(collection(db, "newsletter_subscribers"), {
        email,
        subscribedAt: new Date()
      });
      
      setSubscriptionStatus('success');
      setEmail('');
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      setSubscriptionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#1e293b] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <nav>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="hover:text-[#3b82f6]">Pricing</Link></li>
                <li><Link href="/support" className="hover:text-[#3b82f6]">Support</Link></li>
              </ul>
            </nav>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <nav>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-[#3b82f6]">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-[#3b82f6]">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-[#3b82f6]">Cookie Policy</Link></li>
                <li>
                  <button 
                    onClick={showCookieSettings} 
                    className="hover:text-[#3b82f6] cursor-pointer"
                  >
                    Cookie Settings
                  </button>
                </li>
              </ul>
            </nav>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4 text-sm text-gray-300">Stay updated with our latest features and releases.</p>
            <div className="newsletter-form">
              {isMounted ? (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <div className="flex max-w-md">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className={cn(
                        "flex-1 px-4 py-2 rounded-l-md focus:outline-none",
                        "bg-[#2d3748] text-white placeholder-gray-400 border border-[#4a5568]"
                      )}
                      required
                      disabled={isSubmitting}
                      aria-label="Email address"
                    />
                    <button
                      type="submit"
                      className={cn(
                        "px-4 py-2 bg-[#3b82f6] text-white rounded-r-md hover:bg-[#2563eb] transition-colors",
                        isSubmitting && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                    </button>
                  </div>
                  {subscriptionStatus === 'success' && (
                    <p className="text-green-400 text-sm mt-2" role="status">Thank you for subscribing!</p>
                  )}
                  {subscriptionStatus === 'error' && (
                    <p className="text-red-400 text-sm mt-2" role="alert">Failed to subscribe. Please try again.</p>
                  )}
                </form>
              ) : (
                <div className="flex max-w-md">
                  <div className={cn(
                    "flex-1 px-4 py-2 rounded-l-md",
                    "bg-[#2d3748] border border-[#4a5568]"
                  )}></div>
                  <div className="px-4 py-2 bg-[#3b82f6] text-white rounded-r-md">
                    Subscribe
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} Raw Writer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 