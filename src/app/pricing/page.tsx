"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

// Pricing data with product IDs
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
      productId: "c997ffb8-ae50-460c-a43f-0dea553a80a6"
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

  const handleSubscribe = (planKey: string) => {
    if (!user?.id) {
      setErrorMessage('Please log in to continue');
      setShowErrorDialog(true);
      return;
    }

    const plan = pricingPlans[planKey as keyof typeof pricingPlans];
    const selectedPlanData = billingPeriod === "monthly" ? plan.monthly : plan.annual;
    
    // Redirect to checkout page with product ID
    window.location.href = `/api/checkout?products=${selectedPlanData.productId}`;
  };

  return (
    <div className="min-h-screen py-16 px-4 md:px-8 lg:px-16 bg-[#f0f7ff]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Flexible pricing plans for you</h1>
        
        {/* Billing Toggle */}
        <div className="flex justify-center mb-16">
          <div className="inline-flex bg-white rounded-lg p-1 shadow-sm">
            <button 
              className={`px-6 py-2 rounded-md text-sm font-medium ${billingPeriod === "monthly" ? "bg-[#3b82f6] text-white" : ""}`}
              onClick={() => setBillingPeriod("monthly")}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-2 rounded-md text-sm font-medium ${billingPeriod === "annual" ? "bg-[#3b82f6] text-white" : ""}`}
              onClick={() => setBillingPeriod("annual")}
            >
              Annual <span className={`text-xs ml-1 ${billingPeriod === "annual" ? "text-white" : "text-[#1e83f0]"}`}>(Save 30%)</span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(pricingPlans).map(([key, plan]) => (
            <Card key={key} className={`p-6 border border-[#e2e8f0] rounded-xl relative ${key === 'pro' ? 'md:scale-105' : ''}`}>
              {key === 'pro' && (
                <div className="absolute top-0 right-0 bg-[#f97316] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">
                  MOST POPULAR
                </div>
              )}
              
              <div className="mb-6">
                <h2 className="text-2xl font-bold">{plan.name}</h2>
                <p className="text-[#3b82f6] text-sm">{plan.wordsPerMonth} words per month</p>
              </div>
              
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold">
                  {billingPeriod === "monthly" ? plan.monthly.price : plan.annual.price}
                </span>
                <div className="ml-2 text-sm text-[#64748b]">
                  <p>Per month</p>
                  <p>Billed {billingPeriod === "monthly" ? "monthly" : "annually"}</p>
                </div>
              </div>
              
              <Button 
                className="w-full mb-6" 
                onClick={() => handleSubscribe(key)}
              >
                Subscribe
              </Button>
              
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-[#10b981] mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4">Need more? <Link href="/contact" className="text-[#3b82f6]">Contact Us</Link></p>
          <p className="text-sm text-[#64748b]">
            By clicking the Subscribe button, you agree to our <Link href="/terms" className="text-[#3b82f6]">Terms of Service</Link> and <Link href="/privacy" className="text-[#3b82f6]">Privacy Policy</Link>.
          </p>
        </div>

        {showErrorDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-4">Error</h3>
              <p>{errorMessage}</p>
              <Button className="mt-4" onClick={() => setShowErrorDialog(false)}>Close</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 