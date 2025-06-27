import { env } from "@/env";
import { Webhooks } from "@polar-sh/nextjs";
import { prisma } from "@/lib/prisma";

type PlanId = 
  | "d3478d30-02fa-406f-bded-f4406620e644" // Basic Monthly
  | "4a6b4d39-69de-457a-a190-672d934ce3ba" // Basic Yearly
  | "766f9e3b-cdec-4380-8be8-e8baea7adeaf" // Pro Monthly
  | "c997ffb8-ae50-460c-a43f-0dea553a80a6" // Pro Yearly
  | "b0d93218-c527-46fa-ad8e-d72fac58fd78"; // Ultra Yearly

const PLAN_CREDITS: Record<PlanId, number> = {
  "d3478d30-02fa-406f-bded-f4406620e644": 5000,  // Basic Monthly
  "4a6b4d39-69de-457a-a190-672d934ce3ba": 5000,  // Basic Yearly
  "766f9e3b-cdec-4380-8be8-e8baea7adeaf": 15000, // Pro Monthly
  "c997ffb8-ae50-460c-a43f-0dea553a80a6": 15000, // Pro Yearly
  "b0d93218-c527-46fa-ad8e-d72fac58fd78": 30000  // Ultra Yearly
};

// Type guard for subscription payload
function isSubscriptionPayload(data: any): data is { customer: { email: string }, subscription: { plan_id: string } } {
  return (
    data &&
    typeof data === 'object' &&
    'customer' in data &&
    data.customer &&
    typeof data.customer === 'object' &&
    'email' in data.customer &&
    typeof data.customer.email === 'string' &&
    'subscription' in data &&
    data.subscription &&
    typeof data.subscription === 'object' &&
    'plan_id' in data.subscription &&
    typeof data.subscription.plan_id === 'string'
  );
}

// Type guard for customer payload
function isCustomerPayload(data: any): data is { customer: { email: string } } {
  return (
    data &&
    typeof data === 'object' &&
    'customer' in data &&
    data.customer &&
    typeof data.customer === 'object' &&
    'email' in data.customer &&
    typeof data.customer.email === 'string'
  );
}

export const POST = Webhooks({
  webhookSecret: env.POLAR_WEBHOOK_SECRET,
  onPayload: async (payload) => {
    try {
      console.log('Received webhook payload:', payload.type);
      
      // Handle different event types
      if (payload.type === 'subscription.created' || payload.type === 'subscription.active') {
        // For subscription events
        if (isSubscriptionPayload(payload.data)) {
          const customerEmail = payload.data.customer.email;
          const subscriptionId = payload.data.subscription.plan_id as PlanId;
          
          const credits = PLAN_CREDITS[subscriptionId] || 5000;
          
          await prisma.user.update({
            where: { email: customerEmail },
            data: {
              subscription: subscriptionId,
              credits: { increment: credits },
              subscriptionStatus: 'active',
              subscriptionUpdatedAt: new Date(),
              lastRenewalDate: new Date()
            },
          });
          console.log(`Subscription activated for ${customerEmail} with ${credits} credits`);
        }
      } 
      else if (payload.type === 'subscription.canceled' || payload.type === 'subscription.revoked') {
        // For cancellation events
        if (isCustomerPayload(payload.data)) {
          const customerEmail = payload.data.customer.email;
          
          await prisma.user.update({
            where: { email: customerEmail },
            data: {
              subscriptionStatus: 'cancelled',
              subscriptionUpdatedAt: new Date(),
              cancellationDate: new Date()
            },
          });
          console.log(`Subscription cancelled for ${customerEmail}`);
        }
      }
      else {
        console.log(`Unhandled event type ${payload.type}`);
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      throw error;
    }
  }
}); 