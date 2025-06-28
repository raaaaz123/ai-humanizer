import { NextRequest, NextResponse } from 'next/server';

// Export runtime configuration for all API routes
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

// Helper function to handle API errors
export function handleApiError(error: unknown) {
  console.error('API Error:', error);
  
  return NextResponse.json({
    success: false,
    error: error instanceof Error ? error.message : 'Unknown error occurred'
  }, { status: 500 });
}

// Helper function to create a success response
export function createSuccessResponse(data: any, status = 200) {
  return NextResponse.json({
    success: true,
    ...data
  }, { status });
} 