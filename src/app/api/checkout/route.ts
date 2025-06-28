import { NextRequest, NextResponse } from "next/server";
import { Checkout } from "@polar-sh/nextjs";

// Get base URL for dynamic environment URLs
const baseUrl = process.env.NODE_ENV === 'production' 
  ? 'https://www.ai-humanizer.com'
  : 'http://localhost:3000';

// Use environment variables for Polar configuration
const successUrl = process.env.NEXT_PUBLIC_POLAR_SUCCESS_URL || 
  `${baseUrl}/confirmation?checkout_id={CHECKOUT_ID}`;
const cancelUrl = process.env.NEXT_PUBLIC_POLAR_CANCEL_URL || 
  `${baseUrl}/pricing?checkout=cancelled`;

// Validate that we have the required environment variables
const POLAR_ACCESS_TOKEN = process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN;

// Log function for debugging
const logCheckoutEvent = (type: string, data: any) => {
  const timestamp = new Date().toISOString();
  console.log(`CHECKOUT ${type} [${timestamp}]:`, JSON.stringify(data, null, 2));
};

// Create Polar checkout handler - with fallback for missing token
const createCheckout = POLAR_ACCESS_TOKEN ? Checkout({
  accessToken: POLAR_ACCESS_TOKEN,
  server: process.env.POLAR_ENVIRONMENT as 'sandbox' | 'production' || 'production'
}) : null;

// Simple checkout handler that simulates a successful checkout
export async function GET(req: NextRequest) {
  try {
    // Check if Polar is configured
    if (!createCheckout) {
      logCheckoutEvent('ERROR', { message: 'Polar is not configured - missing access token' });
      return NextResponse.json({ 
        error: 'Polar checkout is not configured',
        details: 'Missing Polar access token'
      }, { status: 500 });
    }

    // Log the incoming request
    logCheckoutEvent('REQUEST', { 
      url: req.url,
      params: Object.fromEntries(req.nextUrl.searchParams.entries())
    });

    // Extract parameters
    const searchParams = req.nextUrl.searchParams;
    const products = searchParams.get('products');
    const customerExternalId = searchParams.get('customerExternalId');
    const customerEmail = searchParams.get('customerEmail');
    const customerName = searchParams.get('customerName');
    const metadata = searchParams.get('metadata');

    // Validate required parameters
    if (!products) {
      logCheckoutEvent('ERROR', { message: 'Missing products parameter' });
      return NextResponse.json({ error: 'Missing products parameter' }, { status: 400 });
    }

    // Validate at least one customer identifier is present
    if (!customerExternalId && !customerEmail) {
      logCheckoutEvent('ERROR', { message: 'Missing customer identification (ID or email)' });
      return NextResponse.json({ 
        error: 'Missing customer identification',
        details: 'Either customerExternalId or customerEmail must be provided'
      }, { status: 400 });
    }

    // Create a new request with all parameters
    const checkoutUrl = new URL(req.url);
    
    // Set the required parameters for success and cancel URLs
    checkoutUrl.searchParams.set('successUrl', successUrl);
    checkoutUrl.searchParams.set('cancelUrl', cancelUrl);

    // Log the checkout attempt
    logCheckoutEvent('ATTEMPT', {
      products,
      customerExternalId,
      customerEmail,
      successUrl,
      cancelUrl,
      metadata: metadata ? JSON.parse(metadata) : null
    });

    try {
      // Create checkout session with Polar
      const response = await createCheckout(new NextRequest(checkoutUrl));
      
      // Log the successful response
      logCheckoutEvent('SUCCESS', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });

      // Return the response directly as it will handle the redirect
      return response;
    } catch (polarError) {
      // Handle Polar API errors
      logCheckoutEvent('POLAR_API_ERROR', {
        error: polarError instanceof Error ? polarError.message : 'Unknown Polar API error',
        stack: polarError instanceof Error ? polarError.stack : null
      });
      
      // Return a friendly error response
      return NextResponse.json({
        error: 'Failed to create checkout session with payment provider',
        details: polarError instanceof Error ? polarError.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    // Log the error
    logCheckoutEvent('UNHANDLED_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    });
    
    // Return a friendly error response
    return NextResponse.json({ 
      error: 'Failed to process checkout request',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// Sandbox test endpoint for development
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Log the test request
    logCheckoutEvent('SANDBOX_REQUEST', body);
    
    // Verify we're in development/testing mode
    if (process.env.NODE_ENV === 'production' && !process.env.ENABLE_SANDBOX_TESTING) {
      return NextResponse.json(
        { error: 'Sandbox testing not available in production' },
        { status: 403 }
      );
    }

    // Simulate a successful checkout response
    return NextResponse.json({
      success: true,
      mode: 'sandbox',
      checkoutUrl: `${baseUrl}/confirmation?checkout_id=test-checkout-id`,
      productId: body.productId || 'test-product',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Log the error
    logCheckoutEvent('SANDBOX_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    });
    
    // Return a friendly error response
    return NextResponse.json(
      { 
        error: 'Failed to process sandbox test',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
} 