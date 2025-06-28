// Polar API client for checkout integration

// Product IDs for each plan
export const POLAR_PRODUCT_IDS = {
  basic: {
    monthly: "003bbf1d-34c1-451e-93a0-0efa9215e5d2",
    annual: "003bbf1d-34c1-451e-93a0-0efa9215e5d2"
  },
  pro: {
    monthly: "baff8c60-012c-494b-9611-86a3da1bbc8a",
    annual: "baff8c60-012c-494b-9611-86a3da1bbc8a"
  },
  ultra: {
    monthly: "c6dd5223-e9eb-45a8-ba28-3247597419c0",
    annual: "c6dd5223-e9eb-45a8-ba28-3247597419c0"
  }
};

// Polar environment configuration
export const POLAR_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN,
  environment: process.env.POLAR_ENVIRONMENT || "production",
  successUrl: process.env.NEXT_PUBLIC_POLAR_SUCCESS_URL,
  cancelUrl: process.env.NEXT_PUBLIC_POLAR_CANCEL_URL
};

// Helper function to get product ID based on plan and billing period
export function getPolarProductId(plan: string, billingPeriod: "monthly" | "annual"): string {
  const planKey = plan.toLowerCase() as keyof typeof POLAR_PRODUCT_IDS;
  
  if (!POLAR_PRODUCT_IDS[planKey]) {
    throw new Error(`Invalid plan: ${plan}`);
  }
  
  return POLAR_PRODUCT_IDS[planKey][billingPeriod];
}

// Create checkout URL for Polar
export function createPolarCheckoutUrl(
  productId: string,
  customerId: string,
  customerEmail: string,
  metadata: Record<string, any> = {}
): string {
  const baseUrl = "/api/checkout";
  const params = new URLSearchParams();
  
  // Add required parameters
  params.append("products", productId);
  params.append("customerExternalId", customerId);
  
  // Add optional parameters if provided
  if (customerEmail) {
    params.append("customerEmail", customerEmail);
  }
  
  if (Object.keys(metadata).length > 0) {
    params.append("metadata", JSON.stringify(metadata));
  }
  
  // Add timestamp to prevent caching
  params.append("_t", Date.now().toString());
  
  return `${baseUrl}?${params.toString()}`;
} 