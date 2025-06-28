import { NextRequest, NextResponse } from 'next/server';
import { validateEvent, WebhookVerificationError } from '@polar-sh/sdk/webhooks';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { handleApiError, createSuccessResponse } from '../../config';
import { Firestore } from 'firebase-admin/firestore';

// Export runtime configuration directly
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

// Define a generic webhook event type
type WebhookEvent = {
  type: string;
  data: Record<string, unknown>;
};

// Define subscription data type
interface SubscriptionData {
  id: string;
  status: string;
  metadata?: {
    userId?: string;
    planName?: string;
    credits?: number;
  };
  recurring_interval?: string;
  started_at: string;
  current_period_end: string;
  cancel_at_period_end?: boolean;
}

// Define order data type
interface OrderData {
  id: string;
  metadata?: {
    userId?: string;
    credits?: number;
  };
  billing_reason?: string;
  subscription?: {
    current_period_end: string;
  };
}

// Define checkout data type
interface CheckoutData {
  id: string;
  status: string;
  customer_id: string;
  customer_external_id?: string;
  product_id: string;
  amount: number;
  currency: string;
  product?: {
    name: string;
  };
  metadata?: Record<string, unknown>;
}

// Log function for debugging
const logWebhookEvent = (type: string, data: Record<string, unknown>) => {
  const timestamp = new Date().toISOString();
  console.log(`WEBHOOK ${type} [${timestamp}]:`, JSON.stringify(data, null, 2));
};

// Add a GET handler for testing the route
export async function GET() {
  console.log('WEBHOOK TEST GET REQUEST RECEIVED');
  return createSuccessResponse({ 
    message: 'Polar webhook endpoint is active',
    timestamp: new Date().toISOString() 
  });
}

export async function POST(req: NextRequest) {
  console.log('WEBHOOK RECEIVED [' + new Date().toISOString() + ']');
  
  try {
    // Get the raw body as a buffer
    const rawBody = await req.text();
    console.log('WEBHOOK RAW BODY:', rawBody.substring(0, 200) + '...');
    
    // Get headers for verification
    const signature = req.headers.get('polar-signature');
    const timestamp = req.headers.get('polar-timestamp');
    
    console.log('WEBHOOK HEADERS:', {
      signature: signature ? signature.substring(0, 10) + '...' : null,
      timestamp
    });
    
    // Parse the raw body as JSON
    let jsonBody;
    try {
      jsonBody = JSON.parse(rawBody);
      console.log('WEBHOOK JSON BODY:', {
        type: jsonBody.type,
        dataPreview: jsonBody.data ? JSON.stringify(jsonBody.data).substring(0, 100) + '...' : null
      });
    } catch (parseError) {
      console.log('JSON PARSE ERROR:', parseError instanceof Error ? parseError.message : 'Unknown error');
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }
    
    // Development mode - still process the event
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      console.log('DEVELOPMENT MODE: Processing event');
      
      try {
        // Log the event data
        logWebhookEvent(jsonBody.type, jsonBody.data);
        
        // Process the event
        await processEvent(jsonBody);
        
        console.log('WEBHOOK PROCESSED SUCCESSFULLY (DEV MODE)');
        return createSuccessResponse({ mode: 'development' }, 202);
      } catch (devError) {
        console.log('DEV MODE ERROR:', devError instanceof Error ? devError.message : 'Unknown error');
        return NextResponse.json({ 
          error: 'Failed to process webhook in development mode',
          details: devError instanceof Error ? devError.message : 'Unknown error'
        }, { status: 400 });
      }
    }
    
    // Production mode - validate signature
    if (!signature || !timestamp) {
      logWebhookEvent('ERROR', { message: 'Missing signature or timestamp header' });
      return NextResponse.json({ error: 'Missing required headers' }, { status: 400 });
    }
    
    // Get webhook secret from environment variables
    const webhookSecret = process.env.POLAR_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logWebhookEvent('ERROR', { message: 'Webhook secret not configured' });
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 500 });
    }
    
    try {
      // Validate the webhook event
      const headers = {
        'polar-signature': signature,
        'polar-timestamp': timestamp
      };
      
      // Validate the event
      const event = validateEvent(
        jsonBody,
        headers,
        webhookSecret
      ) as WebhookEvent;
      
      // Log the event for debugging
      logWebhookEvent('RECEIVED', {
        type: event.type,
        data: event.data
      });
      
      // Return success without processing the event for now
      console.log('WEBHOOK RECEIVED SUCCESSFULLY - SKIPPING PROCESSING');
      return createSuccessResponse({}, 202);
    } catch (error) {
      if (error instanceof WebhookVerificationError) {
        logWebhookEvent('VERIFICATION_ERROR', {
          error: error.message,
          rawBody: rawBody.substring(0, 100) + '...'
        });
        console.log('WEBHOOK VERIFICATION ERROR:', error.message);
        return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
      }
      
      // Log other errors
      logWebhookEvent('ERROR', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : null
      });
      
      console.log('WEBHOOK ERROR:', error instanceof Error ? error.message : 'Unknown error');
      
      throw error;
    }
  } catch (error) {
    logWebhookEvent('UNHANDLED_ERROR', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : null
    });
    
    console.log('WEBHOOK UNHANDLED ERROR:', error instanceof Error ? error.message : 'Unknown error');
    
    return handleApiError(error);
  }
}

// Process different event types
async function processEvent(event: WebhookEvent) {
  const { type, data } = event;
  
  // Log the event type
  console.log('Processing event:', type);
  
  try {
    // Get admin Firestore instance
    const adminDb = await getAdminFirestore();
    
    if (!adminDb) {
      console.error('Admin Firestore not available, logging event only');
      console.log('Event data:', JSON.stringify(data, null, 2));
      return;
    }
    
    switch (type) {
      case 'subscription.created':
      case 'subscription.active':
        await handleSubscriptionCreatedOrActive(adminDb, data as unknown as SubscriptionData);
        break;
        
      case 'subscription.updated':
        await handleSubscriptionUpdated(adminDb, data as unknown as SubscriptionData);
        break;
        
      case 'subscription.canceled':
      case 'subscription.revoked':
        await handleSubscriptionCanceledOrRevoked(adminDb, data as unknown as SubscriptionData);
        break;
        
      case 'subscription.uncanceled':
        await handleSubscriptionUncanceled(adminDb, data as unknown as SubscriptionData);
        break;
        
      case 'order.created':
        await handleOrderCreated(adminDb, data as unknown as OrderData);
        break;
        
      case 'checkout.created':
      case 'checkout.updated':
        await handleCheckout(adminDb, data as unknown as CheckoutData, type);
        break;
        
      default:
        console.log('Unhandled event type:', type);
        console.log('Event data preview:', JSON.stringify(data).substring(0, 200) + '...');
        break;
    }
    
    console.log('Event processed successfully');
  } catch (error) {
    console.error('Error processing webhook event:', error);
    throw error;
  }
}

// Handle subscription created or active events
async function handleSubscriptionCreatedOrActive(adminDb: Firestore, data: SubscriptionData) {
  const userId = data.metadata?.userId;
  if (!userId) return;

  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const planName = data.metadata?.planName || 'Ultra';
    const credits = data.metadata?.credits || 30000;

    await userRef.update({
      subscription: planName,
      subscriptionId: data.id,
      subscriptionStatus: 'active',
      subscriptionInterval: data.recurring_interval || 'month',
      subscriptionUpdatedAt: new Date(),
      subscriptionStartDate: new Date(data.started_at),
      subscriptionCurrentPeriodEnd: new Date(data.current_period_end),
      wordBalance: credits,
      lastOrderDate: new Date()
    });
  }
}

// Handle subscription updated events
async function handleSubscriptionUpdated(adminDb: Firestore, data: SubscriptionData) {
  const userId = data.metadata?.userId;
  if (!userId) return;

  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const updateData: Record<string, unknown> = {
      subscriptionStatus: data.status,
      subscriptionUpdatedAt: new Date(),
      subscriptionCurrentPeriodEnd: new Date(data.current_period_end)
    };

    if (data.cancel_at_period_end) {
      updateData.subscriptionEndDate = new Date(data.current_period_end);
    }

    await userRef.update(updateData);
  }
}

// Handle subscription canceled or revoked events
async function handleSubscriptionCanceledOrRevoked(adminDb: Firestore, data: SubscriptionData) {
  const userId = data.metadata?.userId;
  if (!userId) return;

  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    await userRef.update({
      subscriptionStatus: 'cancelled',
      subscriptionEndDate: new Date(),
      subscriptionUpdatedAt: new Date(),
      subscription: 'Free Plan',
      wordBalance: 250 // Reset to free plan balance
    });
  }
}

// Handle subscription uncanceled events
async function handleSubscriptionUncanceled(adminDb: Firestore, data: SubscriptionData) {
  const userId = data.metadata?.userId;
  if (!userId) return;

  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const planName = data.metadata?.planName || 'Ultra';
    const credits = data.metadata?.credits || 30000;

    await userRef.update({
      subscription: planName,
      subscriptionStatus: 'active',
      subscriptionEndDate: null,
      subscriptionUpdatedAt: new Date(),
      wordBalance: credits
    });
  }
}

// Handle order created events
async function handleOrderCreated(adminDb: Firestore, data: OrderData) {
  const userId = data.metadata?.userId;
  if (!userId) return;

  const userRef = adminDb.collection('users').doc(userId);
  const userDoc = await userRef.get();

  if (userDoc.exists) {
    const updateData: Record<string, unknown> = {
      lastOrderDate: new Date(),
      lastOrderId: data.id
    };

    // If it's a renewal (subscription_cycle), add new credits
    if (data.billing_reason === 'subscription_cycle' && data.subscription) {
      const credits = data.metadata?.credits || 30000;
      const currentBalance = userDoc.data()?.wordBalance as number || 0;
      updateData.wordBalance = currentBalance + credits;
      
      if (data.subscription.current_period_end) {
        updateData.subscriptionCurrentPeriodEnd = new Date(data.subscription.current_period_end);
      }
    }

    await userRef.update(updateData);
  }
}

// Handle checkout events
async function handleCheckout(adminDb: Firestore, data: CheckoutData, type: string) {
  console.log(`${type} Info:`, {
    id: data.id,
    status: data.status,
    customerId: data.customer_id,
    customerExternalId: data.customer_external_id,
    productId: data.product_id,
    metadata: data.metadata
  });
  
  try {
    // Store checkout data
    await adminDb.collection('checkouts').doc(data.id).set({
      ...data,
      status: data.status,
      updatedAt: new Date(),
      processedAt: new Date()
    }, { merge: true });
    
    // If there's customer data, update user record
    if (data.customer_external_id) {
      const userRef = adminDb.collection('users').doc(data.customer_external_id);
      const userDoc = await userRef.get();
      
      if (userDoc.exists) {
        await userRef.update({
          'checkoutPending': {
            checkoutId: data.id,
            productId: data.product_id,
            productName: data.product?.name || '',
            amount: data.amount,
            currency: data.currency,
            status: data.status,
            updatedAt: new Date()
          }
        });
      }
    }
  } catch (error) {
    console.error('Error handling checkout event:', error);
  }
} 