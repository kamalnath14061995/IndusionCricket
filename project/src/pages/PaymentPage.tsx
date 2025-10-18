import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  CreditCard, 
  Shield, 
  Clock, 
  CheckCircle, 
  User, 
  Mail, 
  Phone, 
  Wallet,
  Banknote,
  Building,
  Smartphone,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiPaymentService, PaymentMethod } from '../services/apiPaymentService';
import RazorpayPayment from '../components/RazorpayPayment';
import PayPalPayment from '../components/PayPalPayment';
import { PaymentService } from '../services/paymentService';

interface PaymentPageProps {
  bookingId?: string;
  amount?: number;
  type?: 'booking' | 'coaching';
}

interface PaymentMethodCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  methods: PaymentMethod[];
}

const PaymentPage: React.FC<PaymentPageProps> = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, user } = useAuth();
  
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: location.state?.amount || 0,
    bookingId: location.state?.bookingId || '',
    type: location.state?.type || 'booking'
  });

  useEffect(() => {
    // Check if user is authenticated before fetching payment methods
    if (!token) {
      navigate('/login', { state: { from: location.pathname, state: location.state } });
      return;
    }
    fetchPaymentMethods();
  }, [token, navigate, location.pathname, location.state]);

  const fetchPaymentMethods = async () => {
    try {
      const methods = await apiPaymentService.getAllowedMethodsForUser();
      setPaymentMethods(methods);
    } catch (error: any) {
      console.error('Error fetching payment methods:', error);
      if (error.message?.includes('401') || error.message?.includes('Unauthorized')) {
        // Token is invalid, redirect to login
        navigate('/login', { state: { from: location.pathname, state: location.state } });
      }
    }
  };

  const handlePayment = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }

    // Handle Razorpay payments separately
    if (selectedMethod === 'CARD_RAZORPAY') {
      setShowRazorpay(true);
      return;
    }

    // Handle PayPal payments separately
    if (selectedMethod === 'PAYPAL') {
      setShowPayPal(true);
      return;
    }

    setLoading(true);
    try {
      const paymentRequest: any = {
        amount: paymentData.amount,
        method: selectedMethod as any,
        email: user?.email,
      };

      // Pass the appropriate ID based on payment type
      if (paymentData.type === 'coaching') {
        paymentRequest.coachingId = paymentData.bookingId;
      } else {
        paymentRequest.bookingId = paymentData.bookingId;
      }

      const result = await apiPaymentService.processPayment(paymentRequest);

      if (result.success) {
        navigate('/dashboard', { state: { paymentSuccess: true } });
      } else {
        setError(result.message || 'Payment failed');
      }
    } catch (error) {
      setError('Payment processing failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRazorpaySuccess = async (razorpayResponse: { paymentId: string; orderId: string }) => {
    // Payment processing is now handled by RazorpayPayment component
    // which redirects to the transaction status page
    setShowRazorpay(false);
  };

  const handleRazorpayError = (errorMessage: string) => {
    setError(errorMessage);
    setShowRazorpay(false);
  };

  const handleRazorpayClose = () => {
    setShowRazorpay(false);
  };

  const handlePayPalSuccess = async (paypalDetails: any) => {
    setLoading(true);
    try {
      const paymentRequest: any = {
        amount: paymentData.amount,
        method: 'PAYPAL' as any,
        transactionId: paypalDetails.id,
        email: user?.email,
      };

      // Pass the appropriate ID based on payment type
      if (paymentData.type === 'coaching') {
        paymentRequest.coachingId = paymentData.bookingId;
      } else {
        paymentRequest.bookingId = paymentData.bookingId;
      }

      const result = await apiPaymentService.processPayment(paymentRequest);

      if (result.success) {
        navigate('/dashboard', { 
          state: { 
            paymentSuccess: true,
            transactionId: paypalDetails.id
          } 
        });
      } else {
        setError(result.message || 'Payment verification failed');
      }
    } catch (error) {
      setError('Payment verification failed');
    } finally {
      setLoading(false);
      setShowPayPal(false);
    }
  };

  const handlePayPalError = (errorMessage: string) => {
    setError(errorMessage);
    setShowPayPal(false);
  };

  const handlePayPalCancel = () => {
    setShowPayPal(false);
  };

  const getPaymentMethodCategories = (): PaymentMethodCategory[] => {
    const categories: Record<string, PaymentMethod[]> = {
      cards: [],
      offline: []
    };

    paymentMethods.forEach(method => {
      if (method.key.includes('CARD')) {
        categories.cards.push(method);
      } else if (method.key === 'CASH') {
        categories.offline.push(method);
      }
    });

    return [
      {
        id: 'cards',
        title: 'Cards & Digital Payments',
        icon: <CreditCard className="h-5 w-5" />,
        methods: categories.cards
      },
      {
        id: 'offline',
        title: 'Offline Payments',
        icon: <Banknote className="h-5 w-5" />,
        methods: categories.offline
      }
    ].filter(category => category.methods.length > 0);
  };

  const getMethodIcon = (methodKey: string) => {
    switch (methodKey) {
      case 'CARD_RAZORPAY':
        return <CreditCard className="h-6 w-6 text-blue-600" />;
      case 'CARD_STRIPE':
        return <CreditCard className="h-6 w-6 text-purple-600" />;
      case 'PAYPAL':
        return <Smartphone className="h-6 w-6 text-blue-500" />;
      case 'UPI':
        return <Wallet className="h-6 w-6 text-green-600" />;
      case 'BANK_TRANSFER':
        return <Building className="h-6 w-6 text-indigo-600" />;
      case 'CASH':
        return <Banknote className="h-6 w-6 text-gray-600" />;
      default:
        return <CreditCard className="h-6 w-6 text-gray-600" />;
    }
  };

  const getUserData = () => ({
    name: user?.name,
    email: user?.email,
    contact: user?.phone
  });

  const categories = getPaymentMethodCategories();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6 text-white">
            <h1 className="text-3xl font-bold">Complete Payment</h1>
            <p className="mt-2">Secure payment for your booking</p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Summary</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold">₹{paymentData.amount}</span>
                </div>
                {user && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <User className="h-4 w-4 mr-2" />
                      {user.name}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                    {user.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {showRazorpay ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">Razorpay Payment</h3>
                <RazorpayPayment
                  amount={paymentData.amount}
                  userData={getUserData()}
                  onSuccess={handleRazorpaySuccess}
                  onError={handleRazorpayError}
                  onClose={handleRazorpayClose}
                />
              </div>
            ) : showPayPal ? (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-4">PayPal Payment</h3>
                <PayPalPayment
                  amount={paymentData.amount}
                  currency="USD"
                  onSuccess={handlePayPalSuccess}
                  onError={handlePayPalError}
                  onCancel={handlePayPalCancel}
                />
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Choose Payment Method</h2>
                  <p className="text-gray-600 mb-6">Select your preferred payment method to complete your transaction securely.</p>

                  {categories.map(category => (
                    <div key={category.id} className="mb-6">
                      <div className="flex items-center mb-4">
                        {category.icon}
                        <h3 className="ml-2 text-lg font-medium text-gray-900">{category.title}</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.methods.map(method => (
                          <label
                            key={method.key}
                            className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                              selectedMethod === method.key
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="paymentMethod"
                              value={method.key}
                              checked={selectedMethod === method.key}
                              onChange={(e) => setSelectedMethod(e.target.value)}
                              className="sr-only"
                            />
                            <div className="flex items-center w-full">
                              <div className="mr-3">
                                {getMethodIcon(method.key)}
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{method.label}</div>
                                <div className="text-sm text-gray-600">{method.type}</div>
                              </div>
                              {selectedMethod === method.key && (
                                <CheckCircle className="h-5 w-5 text-blue-600" />
                              )}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    onClick={handlePayment}
                    disabled={loading || !selectedMethod}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <Clock className="h-5 w-5 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-5 w-5 mr-2" />
                        Pay Now - ₹{paymentData.amount}
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
