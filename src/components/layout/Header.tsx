"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { theme } from "@/lib/theme";
import posthog from "posthog-js";

export const Header = () => {
  const { user, userData, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut();
    posthog.capture("sign_out", { source: "header" });
  };
  
  const navigateToAuth = (mode: string, redirect?: string) => {
    const redirectPath = redirect || pathname;
    router.push(`/auth?mode=${mode}&redirect=${encodeURIComponent(redirectPath)}`);
    posthog.capture("auth_page_opened", { mode, source: "header" });
  };

  return (
    <header className={`border-b border-[${theme.colors.border}]`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className={`font-bold text-xl text-[${theme.colors.text}]`}
          onClick={() => posthog.capture("navigation", { destination: "home", source: "logo" })}
        >
          AI Humanizer
        </Link>
        
        <nav className="flex-1 flex justify-center">
          <ul className="flex gap-6 items-center">
            <li>
              <Link 
                href="/" 
                className={`hover:text-[${theme.colors.primary}] transition-colors`}
                onClick={() => posthog.capture("navigation", { destination: "home", source: "nav" })}
              >
                Home
              </Link>
            </li>

            <li>
              <Link 
                href="/pricing" 
                className={`hover:text-[${theme.colors.primary}] transition-colors`}
                onClick={() => posthog.capture("navigation", { destination: "pricing", source: "nav" })}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link 
                href="/support" 
                className={`hover:text-[${theme.colors.primary}] transition-colors`}
                onClick={() => posthog.capture("navigation", { destination: "support", source: "nav" })}
              >
                Support
              </Link>
            </li>
            <li>
              <Link 
                href="https://naturalwrite.com/history" 
                className={`hover:text-[${theme.colors.primary}] transition-colors flex items-center`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => posthog.capture("external_link", { destination: "history", source: "nav" })}
              >
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                History
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-4">
        {user && (
          <Link
            href="/pricing"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
            onClick={() => posthog.capture("navigation", { destination: "pricing", source: "get_more_words" })}
          >
            <span>Get More Words</span>
            <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        )}

        {!loading && (
          <>
            {user ? (
              <Link 
                href="/profile"
                onClick={() => posthog.capture("navigation", { destination: "profile", source: "header" })}
                className="flex items-center focus:outline-none"
              >
                {user.photoURL ? (
                  <Image 
                    src={user.photoURL} 
                    alt="Profile" 
                    width={40} 
                    height={40} 
                    className="rounded-full"
                  />
                ) : (
                  <div className={`w-10 h-10 rounded-full bg-[${theme.colors.primary}] flex items-center justify-center text-white`}>
                    {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                )}
              </Link>
            ) : (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateToAuth('signin')}
                >
                  Sign In
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigateToAuth('signup')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </header>
  );
}; 