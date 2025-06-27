"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    try {
      // Add your newsletter subscription logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSubscriptionStatus('success');
      setEmail('');
    } catch (error) {
      setSubscriptionStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#1e293b] text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Product</h3>
            <nav>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="hover:text-[#3b82f6]">Pricing</Link></li>
                <li><Link href="/features" className="hover:text-[#3b82f6]">Features</Link></li>
                <li><Link href="/support" className="hover:text-[#3b82f6]">Support</Link></li>
              </ul>
            </nav>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <nav>
              <ul className="space-y-2">
                <li><Link href="/about" className="hover:text-[#3b82f6]">About</Link></li>
                <li><Link href="/contact" className="hover:text-[#3b82f6]">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-[#3b82f6]">Blog</Link></li>
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
              </ul>
            </nav>
          </div>
          
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="mb-4 text-sm text-gray-300">Stay updated with our latest features and releases.</p>
            <div className="newsletter-form">
              <form onSubmit={handleSubmit} className="space-y-2">
                <div className="flex max-w-md">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-l-md text-[#1e293b] focus:outline-none"
                    required
                    disabled={isSubmitting}
                    aria-label="Email address"
                  />
                  <button
                    type="submit"
                    className={`px-4 py-2 bg-[#3b82f6] text-white rounded-r-md hover:bg-[#2563eb] transition-colors ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
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
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} AI Humanizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
} 