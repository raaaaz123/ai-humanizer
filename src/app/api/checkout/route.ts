import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
  accessToken: process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN!,
  server: 'sandbox'
}); 