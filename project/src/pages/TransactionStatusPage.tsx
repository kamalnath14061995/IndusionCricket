import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowLeft,
  Receipt,
  CreditCard,
  Calendar,
  DollarSign
} from 'lucide-react';
import { apiPaymentService } from '../services/apiPaymentService';

interface PaymentStatus {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  status?: string;
  message?: string;
  timestamp?: string;
}

const TransactionStatusPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<PaymentStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');
    const orderId = searchParams.get('order_id');
    const success = searchParams.get('success') === 'true';
    const amount = searchParams.get('amount');
    const message = searchParams.get('message');

    if (paymentId && orderId) {
      // If we have payment details from URL, use them
      setStatus({
        success,
        paymentId,
        orderId,
        amount: amount ? parseFloat(amount) : undefined,
        message: message || (success ? 'Payment successful' : 'Payment failed'),
        timestamp: new Date().toISOString()
      });
      setLoading(false);
    } else if (paymentId) {
      // Fetch payment status from backend
      fetchPaymentStatus(paymentId);
    } else {
      // No payment information available
      setStatus({
        success: false,
        message: 'Payment information not available'
      });
      setLoading(false);
    }
  }, [searchParams]);

  const fetchPaymentStatus = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/payments/razorpay/status/${paymentId}`);
      if (response.ok) {
        const data = await response.json();
        setStatus({
          success: data.status === 'captured' || data.status === 'success',
          paymentId,
          amount: data.amount,
          currency: data.currency,
          status: data.status,
          message: data.status === 'captured' ? 'Payment successful' : 'Payment failed'
        });
      } else {
        setStatus({
          success: false,
          message: 'Unable to fetch payment status'
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        message: 'Error fetching payment status'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (loading) return <Clock className="h-16 w-16 text-blue-600 animate-spin" />;
    if (status?.success) return <CheckCircle className="h-16 w-16 text-green-600" />;
    return <XCircle className="h-16 w-16 text-red-600" />;
  };

  const getStatusColor = () => {
    if (loading) return 'text-blue-600';
    if (status?.success) return 'text-green-600';
    return 'text-red-600';
  };

  const getStatusTitle = () => {
    if (loading) return 'Processing Payment...';
    if (status?.success) return 'Payment Successful!';
    return 'Payment Failed';
  };

  const getStatusMessage = () => {
    if (loading) return 'Please wait while we verify your payment.';
    return status?.message || 'Your payment could not be processed.';
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleRetryPayment = () => {
    navigate('/payment', {
      state: {
        amount: status?.amount,
        retry: true
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          {getStatusIcon()}
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{getStatusTitle()}</h1>
          <p className="mt-2 text-gray-600">{getStatusMessage()}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className={`p-6 text-center ${status?.success ? 'bg-green-50' : 'bg-red-50'}`}>
            {getStatusIcon()}
            <h1 className={`mt-4 text-3xl font-bold ${getStatusColor()}`}>
              {getStatusTitle()}
            </h1>
            <p className="mt-2 text-gray-600">{getStatusMessage()}</p>
          </div>

          {status && (
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Receipt className="h-5 w-5 mr-2" />
                  Transaction Details
                </h2>

                <div className="space-y-3">
                  {status.paymentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Payment ID:
                      </span>
                      <span className="font-mono text-sm">{status.paymentId}</span>
                    </div>
                  )}

                  {status.orderId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-mono text-sm">{status.orderId}</span>
                    </div>
                  )}

                  {status.amount && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Amount:
                      </span>
                      <span className="font-bold">
                        ₹{status.amount} {status.currency || 'INR'}
                      </span>
                    </div>
                  )}

                  {status.timestamp && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        Date & Time:
                      </span>
                      <span className="text-sm">
                        {new Date(status.timestamp).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {status.status && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium ${
                        status.success ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {status.status.toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleGoBack}
                  className="flex-1 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </button>

                {!status.success && (
                  <button
                    onClick={handleRetryPayment}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Retry Payment
                  </button>
                )}
              </div>

              {status.success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 text-sm">
                    ✅ Your payment has been processed successfully. You will receive a confirmation email shortly.
                  </p>
                </div>
              )}

              {!status.success && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">
                    ❌ Your payment could not be processed. Please try again or contact support if the issue persists.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionStatusPage;
