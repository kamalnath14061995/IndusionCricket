import React, { useState, useEffect } from 'react';
import { EmailVerificationService } from '../services/emailVerificationService';

export const useEmailVerification = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkVerificationStatus = async (email: string) => {
    try {
      setIsLoading(true);
      const status = await EmailVerificationService.getVerificationStatus();
      setIsVerified(status.verified);
      setError(null);
    } catch (err) {
      setError('Failed to check verification status');
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationEmail = async (email: string) => {
    try {
      setIsLoading(true);
      const response = await EmailVerificationService.sendVerificationEmail();
      return response;
    } catch (err) {
      setError('Failed to send verification email');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (token: string, otp: string) => {
    try {
      setIsLoading(true);
      const response = await EmailVerificationService.verifyOTP(token, otp);
      if (response.success) {
        setIsVerified(true);
        setError(null);
      } else {
        setError(response.message || 'Invalid OTP');
      }
      return response;
    } catch (err) {
      setError('Failed to verify OTP');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isVerified,
    isLoading,
    error,
    checkVerificationStatus,
    sendVerificationEmail,
    verifyOTP,
  };
};
