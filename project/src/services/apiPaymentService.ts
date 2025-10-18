import { apiFetch, API_BASE_URL } from './apiClient';

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
  globalEnabled: Record<PaymentMethodKey, boolean>;
  perUserAllowed: Record<string, PaymentMethodKey[]>;
  restrictions: Record<string, { blocked: boolean; reason?: string }>;
}

export interface PaymentResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  amount?: number;
  method?: string;
}

export interface PaymentRequest {
  amount: number;
  method: PaymentMethodKey;
  userId?: string;
  notes?: string;
  bookingId?: string;
  coachingId?: string;
  email?: string;
}

class ApiPaymentService {
  private baseUrl = `${API_BASE_URL}/api/payments`;

  async getPaymentConfig(): Promise<PaymentConfig> {
    try {
      const response = await apiFetch(`${this.baseUrl}/config`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (typeof data !== 'object' || data === null) {
        console.error('Expected object from /config, got:', data);
        throw new Error('Invalid response format from payment config API');
      }
      return data as PaymentConfig;
    } catch (error) {
      console.error('Error fetching payment config:', error);
      throw error;
    }
  }

  async updatePaymentConfig(config: PaymentConfig): Promise<PaymentConfig> {
    try {
      const response = await apiFetch(`${this.baseUrl}/config`, {
        method: 'PUT',
        body: JSON.stringify(config)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error updating payment config:', error);
      throw error;
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await apiFetch(`${this.baseUrl}/methods`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Expected array from /methods, got:', data);
        throw new Error('Invalid response format from payment methods API');
      }
      return data as PaymentMethod[];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw error;
    }
  }

  async getAllowedMethodsForUser(userId?: string | null): Promise<PaymentMethod[]> {
    if (!userId) {
      const allMethods = await this.getPaymentMethods();
      const config = await this.getPaymentConfig();
      if (!Array.isArray(allMethods)) {
        throw new Error('allMethods is not an array');
      }
      if (!config.globalEnabled) {
        console.warn('config.globalEnabled is missing, using all methods');
        return allMethods;
      }
      return allMethods.filter(method => config.globalEnabled[method.key]);
    }

    try {
      const response = await apiFetch(`${this.baseUrl}/allowed/${userId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        console.error('Expected array from /allowed, got:', data);
        throw new Error('Invalid response format from allowed methods API');
      }
      return data as PaymentMethod[];
    } catch (error) {
      console.error('Error fetching allowed methods for user:', error);
      throw error;
    }
  }

  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await apiFetch(`${this.baseUrl}/process`, {
        method: 'POST',
        body: JSON.stringify(paymentData)
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  }

  async restrictUserPayments(userId: string, blocked: boolean, reason?: string): Promise<void> {
    try {
      const response = await apiFetch(`${this.baseUrl}/restrict/${userId}`, {
        method: 'POST',
        body: JSON.stringify({ blocked, reason })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error restricting user payments:', error);
      throw error;
    }
  }

  async createRazorpayOrder(amount: number, currency: string = 'INR', receipt?: string): Promise<{ orderId: string; amount: number; currency: string }> {
    try {
      const response = await apiFetch(`${this.baseUrl}/razorpay/order`, {
        method: 'POST',
        body: JSON.stringify({ amount, currency, receipt })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Map transactionId to orderId for frontend compatibility
      return {
        orderId: data.transactionId,
        amount: data.amount,
        currency: data.currency
      };
    } catch (error) {
      console.error('Error creating Razorpay order:', error);
      throw error;
    }
  }

  async verifyRazorpayPayment(paymentId: string, orderId: string, signature: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await apiFetch(`${this.baseUrl}/razorpay/verify`, {
        method: 'POST',
        body: JSON.stringify({ paymentId, orderId, signature })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error verifying Razorpay payment:', error);
      throw error;
    }
  }

  async getRazorpayPaymentStatus(paymentId: string): Promise<{ status: string; amount: number; currency: string }> {
    try {
      const response = await apiFetch(`${this.baseUrl}/razorpay/status/${paymentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error getting Razorpay payment status:', error);
      throw error;
    }
  }

  async refundRazorpayPayment(paymentId: string, amount?: number): Promise<{ success: boolean; refundId?: string; message: string }> {
    try {
      const response = await apiFetch(`${this.baseUrl}/razorpay/refund`, {
        method: 'POST',
        body: JSON.stringify({ paymentId, amount })
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error refunding Razorpay payment:', error);
      throw error;
    }
  }


}

export const apiPaymentService = new ApiPaymentService();
