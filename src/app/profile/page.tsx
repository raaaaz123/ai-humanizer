"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from 'date-fns';
import { SubscriptionDialog } from "@/components/ui/subscription-dialog";
import posthog from "posthog-js";

export default function ProfilePage() {
  const { user, userData, loading, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSubscriptionDialog, setShowSubscriptionDialog] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [successDetails, setSuccessDetails] = useState<{
    plan?: string;
    credits?: string;
    transactionId?: string;
  }>({});

  // Add function to refresh user data
  const refreshUserData = async () => {
    if (!user) return;
    
    try {
      setIsRefreshing(true);
      // Force a reload to refresh user data from Firestore
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing user data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
      return;
    }
    
    // Check for checkout success parameter
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'success') {
      // Get additional details if available
      const plan = searchParams.get('plan');
      const credits = searchParams.get('credits');
      const transactionId = searchParams.get('transactionId');
      
      setSuccessDetails({
        plan: plan || undefined,
        credits: credits || undefined,
        transactionId: transactionId || undefined
      });
      
      setShowSuccessMessage(true);
      
      // Track successful checkout
      posthog.capture("checkout_success", {
        plan: plan || "Unknown plan",
        credits: credits ? parseInt(credits, 10) : undefined,
        transactionId: transactionId
      });
      
      // Hide the message after 8 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 8000);
      
      return () => clearTimeout(timer);
    }
  }, [user, loading, router, searchParams]);

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

  // Generate success message based on available details
  const getSuccessMessage = () => {
    if (successDetails.plan && successDetails.credits) {
      return `Your ${successDetails.plan} subscription was successful! ${parseInt(successDetails.credits).toLocaleString()} credits have been added to your account.`;
    } else if (successDetails.plan) {
      return `Your ${successDetails.plan} subscription was successful! Your credits have been added to your account.`;
    } else if (successDetails.credits) {
      return `Your subscription was successful! ${parseInt(successDetails.credits).toLocaleString()} credits have been added to your account.`;
    } else {
      return "Your subscription was successful! Your credits have been added to your account.";
    }
  };

  const handleCancelSubscription = async () => {
    try {
      // Track subscription cancellation attempt
      posthog.capture("subscription_cancel_initiated", {
        subscriptionId: user?.subscriptionId,
        plan: user?.subscription
      });

      // Call your API to cancel the subscription
      const response = await fetch('/api/subscription/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          subscriptionId: user?.subscriptionId
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Failed to cancel subscription');
      }

      // Track successful cancellation
      posthog.capture("subscription_cancelled", {
        subscriptionId: user?.subscriptionId,
        plan: user?.subscription
      });

      // Refresh the page to show updated status
      router.refresh();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      
      // Track cancellation error
      posthog.capture("subscription_cancel_error", {
        subscriptionId: user?.subscriptionId,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      
      throw error; // Re-throw to be handled by the dialog
    }
  };

  return (
    <main className="min-h-screen bg-[#f0f7ff] py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p>{getSuccessMessage()}</p>
                  {successDetails.transactionId && (
                    <p className="text-xs mt-1">Transaction ID: {successDetails.transactionId}</p>
                  )}
                </div>
              </div>
              <button 
                onClick={() => setShowSuccessMessage(false)}
                className="text-green-700 hover:text-green-900"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
        
        {/* Account Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <svg className="h-6 w-6 text-[#64748b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h1 className="text-2xl font-bold">Account</h1>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={refreshUserData}
                disabled={isRefreshing}
                className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#eff6ff] hover:text-[#3b82f6]"
              >
                <svg className={`h-5 w-5 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </Button>
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
          </div>
          
          <div className="mt-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#64748b] mb-1">Name</label>
              <p className="text-lg">{userData?.displayName || user?.displayName || 'Not provided'}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#64748b] mb-1">Email</label>
              <p className="text-lg">{userData?.email || user?.email || 'Not provided'}</p>
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
              <h2 className="text-xl font-bold">Word Balance</h2>
            </div>
            
            <div className="mb-6">
              <p className="text-4xl font-bold">{formatCredits(userData?.wordBalance || user?.wordBalance || 0)}</p>
              <p className="text-[#64748b]">available words</p>
              {user?.lastOrderDate && (
                <p className="text-sm text-[#64748b] mt-2">
                  Last purchase: {formatDistanceToNow(new Date(user.lastOrderDate), { addSuffix: true })}
                </p>
              )}
            </div>
            
            <Link href="/pricing">
              <Button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-white">
                Get more words
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
                <span className="text-2xl font-bold">{userData?.subscription || user?.subscription || 'Free Plan'}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSubscriptionBadgeColor(userData?.subscriptionStatus || user?.subscriptionStatus)}`}>
                  {userData?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'active' ? 'Active' : 
                   userData?.subscriptionStatus === 'cancelled' || user?.subscriptionStatus === 'cancelled' ? 'Cancelled' : 'Free'}
                </span>
              </div>
              
              {(userData?.subscriptionInterval || user?.subscriptionInterval) && (
                <p className="text-sm text-[#64748b] mb-2">
                  Billing: {(userData?.subscriptionInterval || user?.subscriptionInterval) === 'month' ? 'Monthly' : 'Annually'}
                </p>
              )}
              
              {(userData?.subscriptionCurrentPeriodEnd || user?.subscriptionCurrentPeriodEnd) && (
                <p className="text-sm text-[#64748b] mb-2">
                  Next billing date: {new Date(userData?.subscriptionCurrentPeriodEnd || user?.subscriptionCurrentPeriodEnd || new Date()).toLocaleDateString()}
                </p>
              )}
              
              {(userData?.subscriptionStartDate || user?.subscriptionStartDate) && (
                <p className="text-sm text-[#64748b] mb-2">
                  Started: {formatDistanceToNow(new Date(userData?.subscriptionStartDate || user?.subscriptionStartDate || new Date()), { addSuffix: true })}
                </p>
              )}
              
              {(userData?.subscriptionUpdatedAt || user?.subscriptionUpdatedAt) && (
                <p className="text-sm text-[#64748b]">
                  Last updated: {formatDistanceToNow(new Date(userData?.subscriptionUpdatedAt || user?.subscriptionUpdatedAt || new Date()), { addSuffix: true })}
                </p>
              )}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-2 border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-white"
              onClick={() => {
                if ((userData?.subscription || user?.subscription) && 
                    (userData?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'active')) {
                  setShowSubscriptionDialog(true);
                } else {
                  router.push('/pricing');
                }
              }}
            >
              {(userData?.subscription || user?.subscription) && 
               (userData?.subscriptionStatus === 'active' || user?.subscriptionStatus === 'active') 
                ? 'Manage Subscription' : 'Upgrade Now'}
            </Button>
          </div>
        </div>
      </div>

      {/* Subscription Dialog */}
      {user && (
        <SubscriptionDialog
          isOpen={showSubscriptionDialog}
          onClose={() => setShowSubscriptionDialog(false)}
          subscription={{
            name: userData?.subscription || user?.subscription || 'Free Plan',
            status: userData?.subscriptionStatus || user?.subscriptionStatus || 'free',
            interval: userData?.subscriptionInterval || user?.subscriptionInterval || 'month',
            startDate: userData?.subscriptionStartDate || user?.subscriptionStartDate,
            endDate: userData?.subscriptionEndDate || user?.subscriptionEndDate,
            currentPeriodEnd: userData?.subscriptionCurrentPeriodEnd || user?.subscriptionCurrentPeriodEnd,
            updatedAt: userData?.subscriptionUpdatedAt || user?.subscriptionUpdatedAt,
            wordBalance: userData?.wordBalance || user?.wordBalance || 0
          }}
          onCancelSubscription={handleCancelSubscription}
        />
      )}
    </main>
  );
} 