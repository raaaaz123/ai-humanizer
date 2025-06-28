"use client";

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

interface SubscriptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  subscription: {
    name: string;
    status: string;
    interval: string;
    startDate?: Date;
    endDate?: Date;
    currentPeriodEnd?: Date;
    updatedAt?: Date;
    wordBalance: number;
  };
  onCancelSubscription: () => Promise<void>;
}

export function SubscriptionDialog({ isOpen, onClose, subscription, onCancelSubscription }: SubscriptionDialogProps) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    setIsCancelling(true);
    setError(null);
    
    try {
      await onCancelSubscription();
      toast.success('Subscription cancelled successfully');
      onClose();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel subscription';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Subscription Details</DialogTitle>
          <DialogDescription className="text-gray-500">
            Manage your subscription and view details
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-5">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
              <h3 className="font-medium text-gray-900 mb-1">Current Plan</h3>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">{subscription.name}</span>
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                  subscription.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                  'bg-gray-100 text-gray-800'
                )}>
                  {subscription.status === 'active' ? 'Active' : 
                   subscription.status === 'cancelled' ? 'Cancelled' : 'Free'}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-1">Word Balance</h3>
              <p className="text-gray-700 text-lg font-semibold">{subscription.wordBalance.toLocaleString()} words</p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-1">Billing Interval</h3>
              <p className="text-gray-700">
                {subscription.interval === 'month' ? 'Monthly' : 'Annually'}
              </p>
            </div>

            {subscription.startDate && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Started</h3>
                <p className="text-gray-700">
                  {formatDistanceToNow(subscription.startDate, { addSuffix: true })}
                </p>
              </div>
            )}

            {subscription.currentPeriodEnd && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Next Billing Date</h3>
                <p className="text-gray-700">
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
            )}

            {subscription.endDate && (
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Cancellation Date</h3>
                <p className="text-gray-700">
                  {new Date(subscription.endDate).toLocaleDateString()}
                </p>
              </div>
            )}

            {error && (
              <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}
          </div>

          <DialogFooter className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                Update Plan
              </Button>
            </Link>
            
            {subscription.status === 'active' && (
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isCancelling}
                className="w-full sm:w-auto text-gray-500 border-gray-300 hover:bg-gray-50 hover:text-red-600"
              >
                {isCancelling ? (
                  <>
                    <span className="mr-2">Cancelling</span>
                    <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full" />
                  </>
                ) : (
                  'Cancel Subscription'
                )}
              </Button>
            )}
            
            <Button 
              variant="secondary" 
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
} 