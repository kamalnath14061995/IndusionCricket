import React, { useEffect, useState } from 'react';
import { apiPaymentService } from '../services/apiPaymentService';

interface PayPalPaymentProps {
  amount: number;
  currency?: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
  bookingId?: string;
  coachingId?: string;
}

declare global {
  interface Window {
    paypal: any;
  }
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  currency = 'USD',
  onSuccess,
  onError,
  onCancel,
  bookingId,
  coachingId
}) => {
  const [sdkReady, setSdkReady] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    const addPayPalSdk = async () => {
      const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      if (!clientId) {
        onError('PayPal client ID not configured');
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}`;
      script.async = true;
      script.onload = () => setSdkReady(true);
      script.onerror = () => onError('Failed to load PayPal SDK');
      document.body.appendChild(script);
    };

    if (!window.paypal) {
      addPayPalSdk();
    } else {
      setSdkReady(true);
    }
  }, [currency, onError]);

  useEffect(() => {
    if (sdkReady && window.paypal) {
      window.paypal.Buttons({
        createOrder: async (data: any, actions: any) => {
          try {
            setProcessing(true);
            const order = await apiPaymentService.createPayPalOrder(amount, currency);
            return order.orderId;
          } catch (error) {
            onError('Failed to create payment order');
            return '';
          } finally {
            setProcessing(false);
          }
        },
        onApprove: async (data: any, actions: any) => {
          try {
            setProcessing(true);
            const details = await actions.order.capture();
            const verification = await apiPaymentService.verifyPayPalPayment(
              details.id, 
              data.orderID
            );
            
            if (verification.success) {
              onSuccess(verification.transactionId || details.id);
            } else {
              onError(verification.message || 'Payment verification failed');
            }
          } catch (error) {
            onError('Payment processing failed');
          } finally {
            setProcessing(false);
          }
        },
        onError: (err: any) => {
          onError(err.message || 'Payment error occurred');
        },
        onCancel: () => {
          onCancel?.();
        }
      }).render('#paypal-button-container');
    }
  }, [sdkReady, amount, currency, onSuccess, onError, onCancel]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">PayPal Payment</h3>
        <div className="flex items-center space-x-2">
          {processing ? (
            <span className="text-sm font-medium text-yellow-600">Processing...</span>
          ) : (
            <span className="text-sm font-medium text-gray-700">
              {sdkReady ? 'Ready to pay' : 'Loading payment...'}
            </span>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Amount:</span>
            <span className="font-bold text-lg">
              {new Intl.NumberFormat(currency === 'USD' ? 'en-US' : 'en-IN', {
                style: 'currency',
                currency
              }).format(amount)}
            </span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Secure payment processed through PayPal
          </div>
        </div>
      </div>

      <div id="paypal-button-container" className="mb-4" />

      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs">
        <p className="text-blue-700 font-medium mb-1">Security Note:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Payments are processed securely</li>
          <li>Your financial details are never shared with us</li>
          <li>All transactions are encrypted</li>
        </ul>
      </div>
    </div>
  );
};

export default PayPalPayment;
