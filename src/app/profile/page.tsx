"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';

export default function ProfilePage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b82f6]"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getSubscriptionBadgeColor = (status?: string | null) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCredits = (credits: number) => {
    return new Intl.NumberFormat().format(credits);
  };

  return (
    <main className="min-h-screen bg-[#f0f7ff] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Account Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h1 className="text-2xl font-bold">Account</h1>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                signOut();
                router.push("/");
              }}
              className="text-[#ef4444] hover:bg-[#fef2f2] hover:text-[#ef4444] border-none"
            >
              <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Log out
            </Button>
          </div>
          
          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#64748b] mb-1">Name</label>
              <p className="text-lg">{user.displayName || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">Email</label>
              <p className="text-lg">{user.email}</p>
            </div>
          </div>
        </div>
        
        {/* Credits and Subscription */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Credits */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <svg className="h-6 w-6 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h2 className="text-xl font-bold">Credits</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-4xl font-bold">{formatCredits(user.credits)}</p>
              <p className="text-[#64748b]">available credits</p>
              {user.lastOrderDate && (
                <p className="text-sm text-[#64748b] mt-2">
                  Last purchase: {formatDistanceToNow(user.lastOrderDate, { addSuffix: true })}
                </p>
              )}
            </div>
            
            <Link href="/pricing">
              <Button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white">
                Get more credits
              </Button>
            </Link>
          </div>
          
          {/* Subscription */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <svg className="h-6 w-6 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <h2 className="text-xl font-bold">Subscription</h2>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold">{user.subscription || 'Free Plan'}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionBadgeColor(user.subscriptionStatus)}`}>
                  {user.subscriptionStatus === 'active' ? 'Active' : 
                   user.subscriptionStatus === 'cancelled' ? 'Cancelled' : 'Free'}
                </span>
              </div>
              
              {user.subscriptionUpdatedAt && (
                <p className="text-sm text-[#64748b]">
                  Last updated: {formatDistanceToNow(user.subscriptionUpdatedAt, { addSuffix: true })}
                </p>
              )}
            </div>
            
            <Link href="/pricing">
              <Button variant="outline" className="w-full border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white">
                {user.subscription ? 'Manage Subscription' : 'Upgrade Now'}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
} 