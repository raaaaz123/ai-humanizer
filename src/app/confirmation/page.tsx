"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState({
    plan: "",
    credits: "",
    billingPeriod: "",
    transactionId: "",
    checkoutId: ""
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get checkout ID from Polar
    const checkoutId = searchParams.get('checkout_id');
    
    if (checkoutId) {
      // In a real implementation, you would:
      // 1. Verify the checkout with Polar's API
      // 2. Update the user's credits in the database
      // 3. Create a subscription record
      
      // For now, we'll simulate a successful checkout
      fetchOrderDetails(checkoutId);
    } else {
      // Handle legacy parameters for backward compatibility
      const plan = searchParams.get('plan') || '';
      const credits = searchParams.get('credits') || '';
      const billingPeriod = searchParams.get('billingPeriod') || '';
      const transactionId = searchParams.get('transactionId') || '';
      
      setOrderDetails({
        plan,
        credits,
        billingPeriod,
        transactionId,
        checkoutId: ''
      });
      
      setIsLoading(false);
    }
    
    // Redirect to profile after 5 seconds with the same parameters
    const timer = setTimeout(() => {
      const profileUrl = `/profile?checkout=success&plan=${orderDetails.plan}&credits=${orderDetails.credits}&transactionId=${orderDetails.transactionId || orderDetails.checkoutId}`;
      router.push(profileUrl);
    }, 5000);

    return () => clearTimeout(timer);
  }, [router, searchParams, orderDetails.plan, orderDetails.credits, orderDetails.transactionId, orderDetails.checkoutId]);

  // Simulate fetching order details from Polar API
  const fetchOrderDetails = async (checkoutId: string) => {
    try {
      // In a real implementation, you would fetch this data from Polar's API
      // For now, we'll simulate a response
      setTimeout(() => {
        setOrderDetails({
          plan: "Pro", // This would come from the metadata in the Polar checkout
          credits: "15000", // This would come from the metadata in the Polar checkout
          billingPeriod: "monthly", // This would come from the metadata in the Polar checkout
          transactionId: "",
          checkoutId
        });
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching order details:", error);
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f7ff]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b82f6] mb-4"></div>
          <p className="text-[#64748b]">Processing your order...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f7ff]">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-sm border border-[#e2e8f0] text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Thank You for Your Purchase!</h1>
        <p className="text-[#64748b] mb-6">
          Your order has been successfully processed. You will receive a confirmation email shortly.
        </p>
        
        {/* Order details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Order Summary</h2>
          <div className="space-y-2 text-sm">
            {orderDetails.plan && (
              <div className="flex justify-between">
                <span className="font-medium">Plan:</span>
                <span>{orderDetails.plan}</span>
              </div>
            )}
            {orderDetails.credits && (
              <div className="flex justify-between">
                <span className="font-medium">Credits:</span>
                <span>{parseInt(orderDetails.credits).toLocaleString()}</span>
              </div>
            )}
            {orderDetails.billingPeriod && (
              <div className="flex justify-between">
                <span className="font-medium">Billing:</span>
                <span className="capitalize">{orderDetails.billingPeriod}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{formatDate(new Date())}</span>
              </div>
              {(orderDetails.transactionId || orderDetails.checkoutId) && (
                <div className="flex justify-between mt-1">
                  <span className="font-medium">Transaction ID:</span>
                  <span className="text-xs">{orderDetails.transactionId || orderDetails.checkoutId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-[#64748b]">
            You will be automatically redirected to your profile in a few seconds.
          </p>
          
          <div className="flex flex-col space-y-2">
            <Link href={`/profile?checkout=success&plan=${orderDetails.plan}&credits=${orderDetails.credits}&transactionId=${orderDetails.transactionId || orderDetails.checkoutId}`}>
              <Button className="w-full">Go to Profile</Button>
            </Link>
            
            <Link href="/">
              <Button variant="outline" className="w-full">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 