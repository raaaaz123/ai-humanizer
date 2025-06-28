import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { handleApiError, createSuccessResponse } from '../config';
import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';

// Export runtime configuration directly
export const runtime = 'nodejs';
export const preferredRegion = 'auto';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the current timestamp
    const timestamp = new Date().toISOString();
    
    console.log('Testing Firebase Admin SDK connection...');
    
    // Get the admin Firestore instance
    const adminDb = await getAdminFirestore();
    
    if (!adminDb) {
      return createSuccessResponse({ 
        status: 'error', 
        message: 'Firebase Admin SDK not properly initialized',
        timestamp
      }, 500);
    }
    
    console.log('Firebase Admin DB instance type:', typeof adminDb);
    
    // Try to write to a test collection
    const testRef = adminDb.collection('admin-tests').doc('test-' + Date.now());
    await testRef.set({
      timestamp,
      message: 'Firebase Admin SDK test',
      success: true
    });
    
    console.log('Successfully wrote to Firestore using Admin SDK');
    
    // Try to read from the test collection
    const snapshot = await adminDb.collection('admin-tests').limit(5).get();
    const docs = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return createSuccessResponse({ 
      message: 'Firebase Admin SDK is working correctly',
      timestamp,
      testDocs: docs
    });
  } catch (error) {
    console.error('Error testing Firebase Admin SDK:', error);
    return handleApiError(error);
  }
} 