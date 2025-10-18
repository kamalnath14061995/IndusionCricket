import React, { useState, useEffect } from 'react';
import { CreditCard, Users, Settings, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiPaymentService } from '../services/apiPaymentService';

interface PaymentModalProps {
  userId?: string | null;
  amount: number;
  visible: boolean;
  onClose: () => void;
  onSuccess?: (info: { method: string; amount: number; referenceId: string }) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ userId, amount, visible, onClose, onSuccess }) => {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [selected, setSelected] = useState<PaymentMethod | null>(null);
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (visible) {
      loadPaymentMethods();
    }
  }, [visible, userId]);

  const loadPaymentMethods = async () => {
    setLoading(true);
    setError('');
    try {
      const allowedMethods = await apiPaymentService.getAllowedMethodsForUser(userId);
      setMethods(allowedMethods);
      setSelected(allowedMethods[0] || null);
    } catch (err) {
      setError('Failed to load payment methods');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async () => {
    if (!selected) {
      setError('Please select a payment method');
      return;
    }

    setError('');
    setProcessing(true);

    try {
      const paymentData = {
        amount,
        method: selected.key,
        userId: userId || undefined,
        notes,
        email: user?.email,
        bookingId: undefined, // This would be populated from context
        coachingId: undefined // This would be populated from context
      };

      const result = await apiPaymentService.processPayment(paymentData);

      if (result.success) {
        const referenceId = result.transactionId || `${selected.key}-${Date.now()}`;
        onSuccess?.({ method: selected.key, amount, referenceId });
        onClose();
      } else {
        setError(result.message || 'Payment failed');
      }
    } catch (err: any) {
      setError(err.message || 'Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-green-600" />
            Complete Payment
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Loading payment methods...</span>
          </div>
        )}

        {!loading && (
          <>
            <div className="bg-white rounded-lg shadow p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                Complete Payment
              </h4>
              <div className="bg-white rounded-lg shadow p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                  Complete Payment
                </h4>
                <div className="bg-white rounded-lg shadow p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2 text-green-600" />
                    Complete Payment
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
