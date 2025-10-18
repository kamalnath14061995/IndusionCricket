// Client-side payment configuration and processing
// Uses localStorage for configuration with real Razorpay integration

import { razorpayService, RazorpayPaymentResponse } from './razorpayService';

export type PaymentMethodKey =
  | 'CASH'
  | 'CARD_RAZORPAY';

export interface PaymentMethod {
  key: PaymentMethodKey;
  label: string;
  type: 'OFFLINE' | 'ONLINE';
  provider?: 'RAZORPAY' | 'CARD';
}

export interface PaymentConfig {
  // Global enable/disable per method
  globalEnabled: Record<PaymentMethodKey, boolean>;
  // Per-user allowed method keys (if present overrides global; filtered by global on read)
  perUserAllowed: Record<string, PaymentMethodKey[]>; // key = userId
  // Restrict option per user
  restrictions: Record<string, { blocked: boolean; reason?: string }>; // key = userId
}

export interface PaymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
  amount?: number;
  method?: string;
  errorCode?: string;
}

export const defaultPaymentMethods: PaymentMethod[] = [
  { key: 'CASH', label: 'Cash (Offline)', type: 'OFFLINE' },
  { key: 'CARD_RAZORPAY', label: 'Card/UPI (Razorpay)', type: 'ONLINE', provider: 'RAZORPAY' },
];

const STORAGE_KEY = 'paymentConfig';

function buildDefaultConfig(): PaymentConfig {
  const all: Record<PaymentMethodKey, boolean> = {
    CASH: true,
    CARD_RAZORPAY: true, // Enable Razorpay by default
  };
  return { globalEnabled: all, perUserAllowed: {}, restrictions: {} };
}

export const PaymentService = {
  getConfig(): PaymentConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return buildDefaultConfig();
      const parsed = JSON.parse(raw) as PaymentConfig;
      // Ensure new keys are present
      const def = buildDefaultConfig();
      parsed.globalEnabled = { ...def.globalEnabled, ...(parsed.globalEnabled || {}) };
      parsed.perUserAllowed = parsed.perUserAllowed || {};
      parsed.restrictions = parsed.restrictions || {};
      return parsed;
    } catch {
      return buildDefaultConfig();
    }
  },
  saveConfig(cfg: PaymentConfig) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
  },
  getAllMethods(): PaymentMethod[] {
    return defaultPaymentMethods;
  },
  getAllowedMethodsForUser(userId?: string | null): PaymentMethod[] {
    const cfg = this.getConfig();
    const globalEnabled = cfg.globalEnabled;
    const methods = defaultPaymentMethods.filter(m => globalEnabled[m.key]);
    if (!userId) return methods; // no per-user restriction

    const userBlock = cfg.restrictions[userId];
    if (userBlock?.blocked) return []; // fully restricted

    const per = cfg.perUserAllowed[userId];
    if (!per || per.length === 0) return methods;
    const set = new Set(per);
    return methods.filter(m => set.has(m.key));
  },

  async processPayment(amount: number, method: PaymentMethodKey, userData?: {
    name?: string;
    email?: string;
    contact?: string;
  }): Promise<PaymentResult> {
    // Handle offline payments
    if (method === 'CASH') {
      await new Promise(r => setTimeout(r, 600));
      return {
        success: true,
        message: `Payment of ₹${amount} via ${method} successful. Please complete the offline payment process.`,
        amount,
        method
      };
    }

    // Handle Razorpay payments
    if (method === 'CARD_RAZORPAY') {
      try {
        const razorpayResult = await razorpayService.initiatePayment({
          key: 'rzp_test_placeholder', // Will be replaced with actual Razorpay key from environment
          amount: amount * 100, // Convert to paise
          currency: 'INR',
          name: 'Sports Coaching Platform',
          description: `Payment for coaching services`,
          prefill: {
            name: userData?.name,
            email: userData?.email,
            contact: userData?.contact,
          },
          theme: {
            color: '#3399cc'
          }
        });

        if (razorpayResult.success && razorpayResult.paymentId) {
          return {
            success: true,
            message: 'Payment processed successfully via Razorpay',
            transactionId: razorpayResult.paymentId,
            amount,
            method
          };
        } else {
          return {
            success: false,
            message: razorpayResult.message || 'Razorpay payment failed',
            errorCode: razorpayResult.error,
            amount,
            method
          };
        }
      } catch (error) {
        console.error('Razorpay payment error:', error);
        return {
          success: false,
          message: 'Payment processing failed',
          errorCode: 'PROCESSING_ERROR',
          amount,
          method
        };
      }
    }

    // Handle other online payments (mock for now)
    if (method === 'UPI' || method === 'CARD_STRIPE' || method === 'PAYPAL') {
      await new Promise(r => setTimeout(r, 600));
      return {
        success: true,
        message: `Payment of ₹${amount} via ${method} successful (mock).`,
        amount,
        method
      };
    }

    return {
      success: false,
      message: 'Unsupported payment method',
      errorCode: 'UNSUPPORTED_METHOD',
      amount,
      method
    };
  },

  async verifyPayment(paymentId: string, orderId: string, signature: string): Promise<boolean> {
    if (paymentId.startsWith('pay_')) {
      // Razorpay payment verification
      return razorpayService.verifyPayment(paymentId, orderId, signature);
    }
    
    // For other payment methods, assume successful
    return true;
  },

  async refundPayment(paymentId: string, amount?: number): Promise<boolean> {
    if (paymentId.startsWith('pay_')) {
      // Razorpay refund
      return razorpayService.refundPayment(paymentId, amount);
    }
    
    // For other payment methods, mock refund
    console.log('Processing refund for:', paymentId, 'Amount:', amount);
    return true;
  },

  getPaymentStatus(paymentId: string): Promise<'success' | 'failed' | 'pending'> {
    if (paymentId.startsWith('pay_')) {
      return razorpayService.getPaymentStatus(paymentId);
    }
    
    // For other payments, assume success
    return Promise.resolve('success');
  }
};
