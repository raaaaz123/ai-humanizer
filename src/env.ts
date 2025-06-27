export const env = {
  POLAR_ACCESS_TOKEN: process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN!,
  POLAR_WEBHOOK_SECRET: process.env.POLAR_WEBHOOK_SECRET!,
  POLAR_SERVER: 'sandbox'
} as const; 