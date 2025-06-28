"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { theme } from "@/lib/theme";
import posthog from "posthog-js";

export const Header = () => {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const navigateToAuth = (mode: string, redirect?: string) => {
    const redirectPath = redirect || pathname;
    router.push(`/auth?mode=${mode}&redirect=${encodeURIComponent(redirectPath)}`);
    posthog.capture("auth_page_opened", { mode, source: "header" });
  };

  return (
    <header className={`border-b border-[${theme.colors.border}] bg-white shadow-sm sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link 
          href="/" 
          className="flex items-center gap-2 group"
          onClick={() => posthog.capture("navigation", { destination: "home", source: "logo" })}
        >
          <div className="relative w-10 h-10 flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            <svg 
              className="w-7 h-7 text-white transform group-hover:rotate-12 transition-transform duration-300" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Book base */}
              <path 
                d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="rgba(255,255,255,0.1)"
              />
              
              {/* Book pages */}
              <path 
                d="M8 6H16" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
              />
              <path 
                d="M8 10H13" 
                stroke="currentColor" 
                strokeWidth="1.2" 
                strokeLinecap="round" 
              />
              
              {/* Pen */}
              <path 
                d="M15.5 14.5L19 11M19.5 10.5L17 8L11 14V17H14L19.5 10.5Z" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                fill="rgba(255,255,255,0.2)"
              />
              <path 
                d="M19.5 10.5L17 8" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              
              {/* Ink drop */}
              <circle 
                cx="13.5" 
                cy="15.5" 
                r="0.75" 
                fill="white" 
              />
            </svg>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div className="flex flex-col">
            <span className={`font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500 group-hover:from-blue-500 group-hover:to-indigo-400 transition-all duration-300`}>
              Raw Writer
            </span>
            <span className="text-xs text-gray-400 -mt-1">AI Humanizer</span>
          </div>
        </Link>
        
        <nav className="flex-1 flex justify-center">
          <ul className="flex gap-6 items-center">
            <li>
              <Link 
                href="/" 
                className={`font-medium px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 ${pathname === '/' ? 'text-blue-600' : 'text-gray-700'}`}
                onClick={() => posthog.capture("navigation", { destination: "home", source: "nav" })}
              >
                Home
              </Link>
            </li>

            <li>
              <Link 
                href="/pricing" 
                className={`font-medium px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 ${pathname === '/pricing' ? 'text-blue-600' : 'text-gray-700'}`}
                onClick={() => posthog.capture("navigation", { destination: "pricing", source: "nav" })}
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link 
                href="/support" 
                className={`font-medium px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 ${pathname === '/support' ? 'text-blue-600' : 'text-gray-700'}`}
                onClick={() => posthog.capture("navigation", { destination: "support", source: "nav" })}
              >
                Support
              </Link>
            </li>
            <li>
              <Link 
                href="/history" 
                className={`font-medium px-3 py-2 rounded-md hover:bg-gray-50 hover:text-blue-600 transition-all duration-200 flex items-center ${pathname === '/history' ? 'text-blue-600' : 'text-gray-700'}`}
                onClick={() => posthog.capture("navigation", { destination: "history", source: "nav" })}
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
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm font-medium rounded-full hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
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
                className="flex items-center focus:outline-none relative group"
              >
                {user.photoURL ? (
                  <div className="relative">
                    <Image 
                      src={user.photoURL} 
                      alt="Profile" 
                      width={40} 
                      height={40} 
                      className="rounded-full border-2 border-white shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105"
                    />
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                ) : (
                  <div className="relative">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-all duration-300 group-hover:scale-105`}>
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                )}
              </Link>
            ) : (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigateToAuth('signin')}
                  className="border-blue-200 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                >
                  Sign In
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigateToAuth('signup')}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
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