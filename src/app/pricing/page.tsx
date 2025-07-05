"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getPolarProductId } from "@/lib/polar";
import posthog from "posthog-js";
import { useRouter } from "next/navigation";

// Pricing data
const pricingPlans = {
  basic: {
    name: "Basic",
    wordsPerMonth: "5,000",
    wordsPerRequest: "500",
    monthly: {
      price: "$6.99",
      productId: "d3478d30-02fa-406f-bded-f4406620e644"
    },
    annual: {
      price: "$4.99",
      productId: "4a6b4d39-69de-457a-a190-672d934ce3ba"
    },
    features: [
      "500 words per request",
      "Bypass all AI detectors (incl. Turnitin & GPTZero)",
      "Basic Humanization Engine",
      "Plagiarism-free",
      "Error-free rewriting",
      "Undetectable results",
      "Unlimited AI detection",
      "20 languages supported"
    ]
  },
  pro: {
    name: "Pro",
    wordsPerMonth: "15,000",
    wordsPerRequest: "1,500",
    monthly: {
      price: "$19.99",
      productId: "766f9e3b-cdec-4380-8be8-e8baea7adeaf"
    },
    annual: {
      price: "$13.99",
      productId: "c997ffb8-ae50-460c-a43f-0dea553a80a6"
    },
    features: [
      "1,500 words per request",
      "Bypass all AI detectors (incl. Turnitin & GPTZero)",
      "Advanced Humanization Engine",
      "Plagiarism-free",
      "Error-free rewriting",
      "Undetectable results",
      "Unlimited AI detection",
      "50+ languages supported",
      "Advanced Turnitin Bypass Engine",
      "Human-like results",
      "Unlimited grammar checks",
      "Fast mode"
    ]
  },
  ultra: {
    name: "Ultra",
    wordsPerMonth: "30,000",
    wordsPerRequest: "3,000",
    monthly: {
      price: "$39.99",
      productId: "e0695915-5358-4e04-a6b1-35fc47f8d388"
    },
    annual: {
      price: "$27.99",
      productId: "b0d93218-c527-46fa-ad8e-d72fac58fd78"
    },
    features: [
      "3,000 words per request",
      "Bypass all AI detectors (incl. Turnitin & GPTZero)",
      "Advanced Humanization Engine",
      "Plagiarism-free",
      "Error-free rewriting",
      "Undetectable results",
      "Unlimited AI detection",
      "50+ languages supported",
      "Advanced Turnitin Bypass Engine",
      "Human-like results",
      "Unlimited grammar checks",
      "Fast mode",
      "Ultra-human writing output",
      "Priority support"
    ]
  }
};

export default function PricingPage() {
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("annual");
  const [isProcessing, setIsProcessing] = useState<{[key: string]: boolean}>({
    basic: false,
    pro: false,
    ultra: false
  });
  const searchParams = useSearchParams();
  const [showCancelledMessage, setShowCancelledMessage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check for checkout cancelled parameter
    const checkoutStatus = searchParams.get('checkout');
    if (checkoutStatus === 'cancelled') {
      setShowCancelledMessage(true);
      
      // Track cancelled checkout
      posthog.capture("checkout_cancelled");
      
      // Hide the message after 5 seconds
      const timer = setTimeout(() => {
        setShowCancelledMessage(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleSelectPlan = (planKey: string) => {
    if (!user?.id) {
      router.push('/auth?mode=signup&redirect=%2Fpricing');
      posthog.capture("subscription_login_required", {
        planSelected: planKey,
        billingPeriod: billingPeriod
      });
      return;
    }

    const plan = pricingPlans[planKey as keyof typeof pricingPlans];
    const price = billingPeriod === "monthly" ? plan.monthly.price : plan.annual.price;
    const productId = billingPeriod === "monthly" ? plan.monthly.productId : plan.annual.productId;
    const credits = plan.name === "Basic" ? 5000 : plan.name === "Pro" ? 15000 : 30000;
    
    // Set processing state for this plan
    setIsProcessing(prev => ({ ...prev, [planKey]: true }));
    
    // Track subscription attempt
    posthog.capture("subscription_initiated", {
      plan: plan.name,
      billingPeriod: billingPeriod,
      price: price,
      credits: credits
    });
    
    try {
      // Create metadata for Polar
      const metadata = {
        planName: plan.name,
        planType: billingPeriod,
        credits: credits,
        userId: user.id,
        userEmail: user.email || ''
      };
      
      // Build checkout URL with all necessary parameters for Polar
      const checkoutUrl = `/api/checkout?products=${productId}&customerExternalId=${user.id}&customerEmail=${encodeURIComponent(user.email || '')}&metadata=${encodeURIComponent(JSON.stringify(metadata))}`;
      
      // Log checkout attempt
      console.log(`Initiating checkout for ${plan.name} (${billingPeriod}) plan with Polar`);
      
      // Redirect to checkout API which will handle the process
      window.location.href = checkoutUrl;
      
    } catch (error) {
      console.error('Error initiating checkout:', error);
      
      // Track checkout error
      posthog.capture("checkout_error", {
        plan: plan.name,
        billingPeriod: billingPeriod,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      
      // Reset processing state for this plan
      setIsProcessing(prev => ({ ...prev, [planKey]: false }));
    }
  };

  // Add a custom CSS class for the pulsing effect
  const pulseAnimation = `
    @keyframes pulse-blue {
      0% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(59, 130, 246, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(59, 130, 246, 0);
      }
    }
    .pulse-blue {
      animation: pulse-blue 2s infinite;
    }
  `;

  return (
    <div className="min-h-screen py-12 sm:py-16 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-[#f0f7ff] to-white overflow-hidden">
      <style jsx>{pulseAnimation}</style>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-5 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">Flexible pricing plans for you</h1>
        <p className="text-center text-gray-600 mb-10 sm:mb-16 max-w-2xl mx-auto pb-4 sm:pb-6 text-base sm:text-lg">Choose the perfect plan that fits your needs. Cancel anytime.</p>
        
        {/* Cancelled Message */}
        {showCancelledMessage && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg mb-8 flex justify-between items-center shadow-sm">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm sm:text-base">Your checkout was cancelled. No changes were made to your subscription.</span>
            </div>
            <button 
              onClick={() => setShowCancelledMessage(false)}
              className="text-yellow-700 hover:text-yellow-900 ml-2 flex-shrink-0"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Billing Toggle */}
        <div className="flex justify-center mb-10 sm:mb-16">
          <div className="inline-flex bg-white rounded-full p-1 shadow-md">
            <button 
              className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${billingPeriod === "monthly" ? "bg-blue-500 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </button>
            <button 
              className={`px-4 sm:px-8 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${billingPeriod === "annual" ? "bg-blue-500 text-white shadow-sm" : "text-gray-700 hover:bg-gray-100"}`}
              onClick={() => setBillingPeriod("annual")}
            >
              Annual <span className={`text-xs ml-1 ${billingPeriod === "annual" ? "text-white" : "text-blue-500"}`}>(Save 30%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {Object.entries(pricingPlans).map(([key, plan]) => (
            <Card 
              key={key} 
              className={`p-5 sm:p-6 rounded-xl transition-all duration-300 group
                ${key === 'pro' 
                  ? 'border-2 border-blue-500 shadow-lg md:scale-105 relative z-10' 
                  : 'border border-[#e2e8f0] hover:border-blue-400 hover:shadow-md'
                }`}
            >
              {key === 'pro' && (
                <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 sm:px-4 py-1 rounded-full shadow-md">
                  MOST POPULAR
                </div>
              )}
            
              <div className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-bold">{plan.name}</h2>
                <p className="text-blue-500 text-xs sm:text-sm mt-1">{plan.wordsPerMonth} words per month</p>
              </div>
            
              <div className="flex items-baseline mb-6 sm:mb-8">
                <span className="text-3xl sm:text-4xl font-bold">
                  {billingPeriod === "monthly" ? plan.monthly.price : plan.annual.price}
                </span>
                <div className="ml-2 text-xs sm:text-sm text-gray-600">
                  <p>Per month</p>
                  <p>Billed {billingPeriod === "monthly" ? "monthly" : "annually"}</p>
                </div>
              </div>
            
              <div className="relative mb-6 sm:mb-8">
                <Button 
                  className={`w-full py-3 sm:py-4 md:py-6 text-base sm:text-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg rounded-xl
                    ${key === 'pro' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md pulse-blue' 
                      : 'bg-blue-500 hover:bg-blue-600'
                    }`}
                  onClick={() => handleSelectPlan(key)}
                  disabled={isProcessing[key]}
                >
                  {isProcessing[key] ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </div>
                  ) : (
                    <>
                      <span className="relative z-10 flex items-center justify-center">
                        Subscribe Now
                        <svg className="h-4 h-4 sm:h-5 sm:w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </span>
                      <span className="sr-only">to {plan.name} plan</span>
                    </>
                  )}
                </Button>
                {key === 'pro' && (
                  <div className="absolute -right-2 -top-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-full transform rotate-12 shadow-sm">
                    Best Value!
                  </div>
                )}
              </div>
            
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-10 sm:mt-16 text-center">
          <p className="mb-3 sm:mb-4 text-sm sm:text-base">Need more? <Link href="/contact" className="text-blue-500 hover:text-blue-700 font-medium">Contact Us</Link></p>
          <p className="text-xs sm:text-sm text-gray-500">
            By clicking the Subscribe button, you agree to our <Link href="/terms" className="text-blue-500 hover:text-blue-700">Terms of Service</Link> and <Link href="/privacy" className="text-blue-500 hover:text-blue-700">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
} 