import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { razorpayService } from '../services/razorpayService';

interface RazorpayPaymentProps {
  amount: number;
  currency?: string;
  userData?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (paymentData: { paymentId: string; orderId: string }) => void;
  onError: (error: string) => void;
  onClose?: () => void;
}

const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  currency = 'INR',
  userData,
  onSuccess,
  onError,
  onClose
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  useEffect(() => {
    // Initialize Razorpay when component mounts
    const initializeRazorpay = async () => {
      try {
        await razorpayService.initialize();
      } catch (err) {
        console.error('Failed to initialize Razorpay:', err);
        setError('Failed to initialize payment gateway');
      }
    };

    initializeRazorpay();
  }, []);

  const handlePayment = async () => {
    setLoading(true);
    setError('');
    setStatus('processing');

    try {
      // First, create an order on the backend
      const order = await razorpayService.createOrder(amount * 100, currency); // amount in paise

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RCHTIPofbIz1gG';
      const result = await razorpayService.initiatePayment({
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Sports Coaching Platform',
        description: `Payment for ${amount > 0 ? '₹' + amount : 'services'}`,
        order_id: order.id, // Use the order ID from backend
        prefill: {
          name: userData?.name,
          email: userData?.email,
          contact: userData?.contact,
        },
        theme: {
          color: '#3399cc'
        }
      });

      if (result.success && result.paymentId && result.orderId) {
        setStatus('success');

        // Process payment on backend to send email notification
        try {
          await razorpayService.processPayment({
            transactionId: result.paymentId || '',
            amount: amount,
            method: 'RAZORPAY',
            email: userData?.email,
            bookingId: undefined, // Add booking ID if available
            coachingId: undefined  // Add coaching ID if available
          });
        } catch (emailError) {
          console.warn('Failed to send email notification:', emailError);
          // Don't fail the payment if email fails
        }

        // Redirect to transaction status page
        navigate(`/payment-status?payment_id=${result.paymentId}&order_id=${result.orderId}&success=true&amount=${amount}&message=Payment successful`);
      } else {
        setStatus('error');
        const errorMessage = result.message || 'Payment failed';
        setError(errorMessage);
        // Redirect to transaction status page with error
        navigate(`/payment-status?success=false&message=${encodeURIComponent(errorMessage)}&amount=${amount}`);
      }
    } catch (err) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'Payment processing failed';
      setError(errorMessage);
      // Redirect to transaction status page with error
      navigate(`/payment-status?success=false&message=${encodeURIComponent(errorMessage)}&amount=${amount}`);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'processing':
        return <Loader className="h-6 w-6 animate-spin text-blue-600" />;
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-6 w-6 text-red-600" />;
      default:
        return <CreditCard className="h-6 w-6 text-gray-600" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'processing':
        return 'Processing payment...';
      case 'success':
        return 'Payment successful!';
      case 'error':
        return 'Payment failed';
      default:
        return 'Ready to pay';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Razorpay Payment</h3>
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700">{getStatusText()}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-700">Amount:</span>
            <span className="font-bold text-lg">₹{amount}</span>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Payment will be processed securely through Razorpay
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <button
          onClick={handlePayment}
          disabled={loading || status === 'processing'}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {loading || status === 'processing' ? (
            <>
              <Loader className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            'Pay with Razorpay'
          )}
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <div className="text-blue-700 text-xs">
          <strong>Note:</strong> This is a test integration. In production, you'll need to:
          <ul className="mt-1 list-disc list-inside">
            <li>Add your Razorpay API keys to environment variables</li>
            <li>Implement backend order creation and verification</li>
            <li>Set up webhooks for payment status updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RazorpayPayment;
