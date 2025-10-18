import { apiFetch, API_BASE_URL } from './apiClient';

export interface VerificationResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface VerificationStatus {
  verified: boolean;
  status: string;
}

export class EmailVerificationService {
  private static getAuthHeader() {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
  }

  static async sendVerificationEmail(): Promise<VerificationResponse> {
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/verify/send-otp`, {
        method: 'POST',
        headers: this.getAuthHeader(),
      });

      if (response.status === 401 || response.status === 403) {
        return { success: false, message: 'Unauthorized. Session expired. Please log in again.' };
      }

      const raw = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          message: raw?.message || 'Failed to send verification email',
        };
      }

      return {
        success: !!raw?.success,
        message: raw?.message,
        data: { token: raw?.token },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Failed to send verification email',
      };
    }
  }

  static async verifyOTP(token: string, otp: string): Promise<VerificationResponse> {
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/verify/verify-otp`, {
        method: 'POST',
        headers: this.getAuthHeader(),
        body: JSON.stringify({ token, otp }),
      });

      if (response.status === 401 || response.status === 403) {
        return { success: false, message: 'Unauthorized. Session expired. Please log in again.' };
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        return {
          success: false,
          message: data?.message || 'Failed to verify OTP',
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Failed to verify OTP',
      };
    }
  }

  static async getVerificationStatus(): Promise<VerificationStatus> {
    try {
      const response = await apiFetch(`${API_BASE_URL}/api/verify/status`, {
        method: 'GET',
        headers: this.getAuthHeader(),
      });

      if (response.status === 401 || response.status === 403) {
        return { verified: false, status: 'UNAUTHORIZED' };
      }

      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        return {
          verified: !!data.verified,
          status: data.status,
        };
      }
      return {
        verified: false,
        status: data?.status || 'UNKNOWN',
      };
    } catch (error) {
      return {
        verified: false,
        status: 'ERROR',
      };
    }
  }
}