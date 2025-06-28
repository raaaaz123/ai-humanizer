import { NextRequest, NextResponse } from 'next/server';

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
      console.log('Using Polar sandbox token:', tokenPreview);
      console.log('Using Polar sandbox environment');
      
      // Make direct API call to sandbox environment
      const response = await fetch(`https://sandbox-api.polar.sh/v1/subscriptions/${subscriptionId}`, {
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
    } catch (polarError: any) {
      console.error('Polar API Error:', {
        status: polarError?.response?.status,
        error: polarError?.response?.data?.error,
        description: polarError?.response?.data?.error_description,
        message: polarError.message,
        url: 'https://sandbox-api.polar.sh/v1/subscriptions'
      });
      
      // Check for specific error types
      if (polarError?.response?.status === 401) {
        return NextResponse.json({
          error: 'Authentication failed',
          details: 'Invalid or expired API token. Please check your Polar dashboard for a valid sandbox token.'
        }, { status: 401 });
      }
      
      return NextResponse.json({
        error: 'Failed to cancel subscription',
        details: polarError?.response?.data?.error_description || polarError?.message || 'Unknown error from Polar API'
      }, { status: polarError?.response?.status || 400 });
    }
  } catch (error) {
    console.error('Server Error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 