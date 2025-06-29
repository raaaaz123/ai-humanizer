"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/AuthContext";
import posthog from "posthog-js";
import { Sparkles, Shield, Zap, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const { user, loading, signIn } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    setMounted(true);
    
    // Configure PostHog
    if (typeof window !== 'undefined') {
      // Get PostHog key from environment variable
      const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
      if (posthogKey) {
        posthog.init(posthogKey, {
          api_host: 'https://app.posthog.com',
          persistence: 'localStorage',
          autocapture: true,
          capture_pageview: true,
          capture_pageleave: true
        });
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && user) {
      console.log("User detected in auth page, redirecting to home", user.uid);
      
      // If user exists, identify them in PostHog
      posthog.identify(user.uid, {
        email: user.email,
        name: user.displayName,
        $initial_referrer: document.referrer
      });

      // Track successful authentication
      posthog.capture('authentication_success', {
        method: 'google',
        isNewUser: user.metadata?.creationTime === user.metadata?.lastSignInTime,
        referrer: document.referrer
      });

      // Always redirect to home page after successful auth
      router.push('/');
    }
  }, [user, loading, router]);
  
  const handleGoogleAuth = async () => {
    setError("");
    setIsLoading(true);
    
    try {
      console.log("Starting Google auth flow with popup");
      await signIn();
      posthog.capture("sign_in_initiated", { method: "google" });
      // Redirect will be handled by useEffect when user state updates
    } catch (err: unknown) {
      console.error("Google authentication error:", err);
      const errorMessage = err instanceof Error ? err.message : "Sign in failed. Please try again.";
      setError(errorMessage);
      posthog.capture("sign_in_error", { 
        method: "google",
        error: errorMessage 
      });
      setIsLoading(false);
    }
  };
  
  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="relative z-10 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          {/* Main auth card */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 transform hover:scale-[1.02] transition-all duration-300">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                Welcome to Raw Writer
              </h1>
              
              <p className="text-gray-600 text-lg leading-relaxed">
                Transform your AI-generated content into human-like text in seconds
              </p>
            </div>
            
            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-start space-x-3">
                <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                </div>
                <div>{error}</div>
              </div>
            )}
            
            {/* Google Sign In Button */}
            <Button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-gray-300 rounded-xl font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span>Opening sign-in popup...</span>
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  <div className="flex items-center justify-center space-x-3 relative z-10">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    <span>Continue with Google</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </>
              )}
            </Button>
            
            {/* Benefits section */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-xl">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Instant Access</p>
                  <p className="text-sm text-gray-600">Start humanizing your content immediately</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-xl">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Secure & Private</p>
                  <p className="text-sm text-gray-600">Your data is protected with enterprise-grade security</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-xl">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">AI-Powered</p>
                  <p className="text-sm text-gray-600">Advanced algorithms for natural-sounding text</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Terms and Privacy */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 leading-relaxed">
              By continuing, you agree to our{" "}
              <Link 
                href="/terms" 
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link 
                href="/privacy" 
                className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </p>
          </div>
          
          {/* Social proof */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
              <div className="flex -space-x-2">
                <Image 
                  src="https://i.pravatar.cc/48?img=1" 
                  alt="User" 
                  width={24} 
                  height={24} 
                  className="rounded-full border-2 border-white"
                />
                <Image 
                  src="https://i.pravatar.cc/48?img=2" 
                  alt="User" 
                  width={24} 
                  height={24} 
                  className="rounded-full border-2 border-white"
                />
                <Image 
                  src="https://i.pravatar.cc/48?img=3" 
                  alt="User" 
                  width={24} 
                  height={24} 
                  className="rounded-full border-2 border-white"
                />
                <Image 
                  src="https://i.pravatar.cc/48?img=4" 
                  alt="User" 
                  width={24} 
                  height={24} 
                  className="rounded-full border-2 border-white"
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                Join 10,000+ users already transforming their content
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}