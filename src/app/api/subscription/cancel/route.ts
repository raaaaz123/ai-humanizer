import { NextRequest, NextResponse } from 'next/server';

// Define a type for the Polar error structure for type checking
type PolarErrorResponse = {
  response?: {
    status?: number;
    data?: {
      error?: string;
      error_description?: string;
    };
  };
  message: string;
};

export async function POST(req: NextRequest) {
  try {
    const { subscriptionId } = await req.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Subscription ID is required' }, { status: 400 });
    }

    if (!process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN) {
      console.error('NEXT_PUBLIC_POLAR_ACCESS_TOKEN is not configured');
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Polar API token is not configured'
      }, { status: 500 });
    }

    try {
      // Log the token being used (first 10 chars only for security)
      const tokenPreview = process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN.substring(0, 10) + '...';
      console.log('Using Polar production token:', tokenPreview);
      console.log('Using Polar production environment');
      
      // Make direct API call to production environment
      const response = await fetch(`https://api.polar.sh/v1/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_POLAR_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          response: {
            status: response.status,
            data: data
          }
        };
      }

      return NextResponse.json({
        message: 'Subscription cancelled successfully',
        subscription: data
      });
    } catch (polarError: unknown) {
      // Type cast to the expected error structure
      const typedError = polarError as PolarErrorResponse;
      
      console.error('Polar API Error:', {
        status: typedError?.response?.status,
        error: typedError?.response?.data?.error,
        description: typedError?.response?.data?.error_description,
        message: typedError.message,
        url: 'https://api.polar.sh/v1/subscriptions'
      });
      
      // Check for specific error types
      if (typedError?.response?.status === 401) {
        return NextResponse.json({
          error: 'Authentication failed',
          details: 'Invalid or expired API token. Please check your Polar dashboard for a valid production token.'
        }, { status: 401 });
      }
      
      return NextResponse.json({
        error: 'Failed to cancel subscription',
        details: typedError?.response?.data?.error_description || typedError?.message || 'Unknown error from Polar API'
      }, { status: typedError?.response?.status || 400 });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 