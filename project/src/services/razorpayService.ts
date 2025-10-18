import { loadRazorpay } from '../utils/razorpayLoader';
import { apiPaymentService } from './apiPaymentService';

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt?: string;
  status: 'created' | 'attempted' | 'paid' | 'failed';
}

export interface RazorpayPaymentResponse {
  success: boolean;
  orderId?: string;
  paymentId?: string;
  error?: string;
  message?: string;
}

export interface RazorpayConfig {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: any) => void;
  modal?: {
    onDismiss?: () => void;
  };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color: string;
  };
}

class RazorpayService {
  private razorpay: any = null;
  private isInitialized = false;

  async initialize(): Promise<boolean> {
    if (this.isInitialized) return true;

    try {
      this.razorpay = await loadRazorpay();
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize Razorpay:', error);
      return false;
    }
  }

  async createOrder(amount: number, currency: string = 'INR', receipt?: string): Promise<RazorpayOrder> {
    try {
      const response = await apiPaymentService.createRazorpayOrder(amount, currency, receipt);
      return {
        id: response.orderId || '',
        amount: response.amount || amount,
        currency: response.currency || currency,
        receipt,
        status: 'created'
      };
    } catch (error) {
      console.error('Failed to create Razorpay order:', error);
      throw new Error('Failed to create payment order');
    }
  }

  async initiatePayment(config: Omit<RazorpayConfig, 'handler'>): Promise<RazorpayPaymentResponse> {
    if (!this.isInitialized) {
      const initialized = await this.initialize();
      if (!initialized) {
        return {
          success: false,
          error: 'Razorpay not initialized',
          message: 'Payment gateway initialization failed'
        };
      }
    }

    return new Promise((resolve) => {
      const razorpayConfig: RazorpayConfig = {
        ...config,
        handler: (response: any) => {
          if (response.razorpay_payment_id) {
            resolve({
              success: true,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              message: 'Payment successful'
            });
          } else {
            resolve({
              success: false,
              error: response.error?.code || 'PAYMENT_FAILED',
              message: response.error?.description || 'Payment failed'
            });
          }
        },
        modal: {
          onDismiss: () => {
            // Handle modal dismissal as transaction failure
            resolve({
              success: false,
              error: 'MODAL_DISMISSED',
              message: 'Transaction cancelled by user'
            });
          }
        }
      };

      try {
        const razorpayInstance = new (this.razorpay as any)(razorpayConfig);
        razorpayInstance.open();
      } catch (error) {
        resolve({
          success: false,
          error: 'INITIALIZATION_ERROR',
          message: 'Failed to initialize payment'
        });
      }
    });
  }

  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    try {
      const response = await apiPaymentService.verifyRazorpayPayment(paymentId, orderId, signature);
      return response.success;
    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<boolean> {
    // In a real implementation, this would call your backend API
    // to process a refund
    try {
      // Mock implementation - replace with actual API call
      console.log('Processing refund:', { paymentId, amount });
      
      // Simulate refund processing
      return true;
    } catch (error) {
      console.error('Refund failed:', error);
      return false;
    }
  }

  async processPayment(paymentData: {
    transactionId: string;
    amount: number;
    method: string;
    email?: string;
    bookingId?: string;
    coachingId?: string;
  }): Promise<boolean> {
    try {
      const response = await apiPaymentService.processPayment({
        ...paymentData,
        method: 'CARD_RAZORPAY' as const
      });
      return response.success;
    } catch (error) {
      console.error('Failed to process payment:', error);
      return false;
    }
  }

  getPaymentStatus(paymentId: string): Promise<'success' | 'failed' | 'pending'> {
    // In a real implementation, this would check payment status
    return Promise.resolve('success');
  }
}

export const razorpayService = new RazorpayService();
