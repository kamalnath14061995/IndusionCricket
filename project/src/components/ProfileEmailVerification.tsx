import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Clock, Send } from 'lucide-react';
import { EmailVerificationService } from '../services/emailVerificationService';

interface ProfileEmailVerificationProps {
  email: string;
  onVerificationComplete: () => void;
}

export const ProfileEmailVerification: React.FC<ProfileEmailVerificationProps> = ({
  email,
  onVerificationComplete,
}) => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [verificationToken, setVerificationToken] = useState('');

  useEffect(() => {
    checkVerificationStatus();
  }, [email]);

  // If session is expired, inform user quickly
  const showSessionExpiredIfNeeded = (status: string) => {
    if (status === 'UNAUTHORIZED') {
      setError('Your session has expired. Please log in again to verify your email.');
    }
  };

  // Handle countdown timer for resend
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => (c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const checkVerificationStatus = async () => {
    try {
      const status = await EmailVerificationService.getVerificationStatus();
      setIsVerified(status.verified);
      showSessionExpiredIfNeeded(status.status);
    } catch (error) {
      console.error('Failed to check verification status:', error);
    }
  };

  const handleSendVerification = async () => {
    setIsSending(true);
    setError(null);

    try {
      const response = await EmailVerificationService.sendVerificationEmail();
      if (response.success) {
        setVerificationToken(response.data?.token || '');
        setCountdown(180); // 3 minutes
        setOtp(['', '', '', '', '', '']);
        setShowOtpModal(true);
      } else {
        setError(response.message || 'Failed to send verification email');
      }
    } catch (err) {
      setError('Failed to send verification email');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyOTP = async () => {
    setError(null);
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const response = await EmailVerificationService.verifyOTP(verificationToken, otpCode);
      if (response.success) {
        setIsVerified(true);
        setShowOtpModal(false);
        onVerificationComplete();
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Allow only a single digit 0-9
    const val = value.replace(/[^0-9]/g, '').slice(0, 1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`profile-otp-${index + 1}`) as HTMLInputElement | null;
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`profile-otp-${index - 1}`) as HTMLInputElement | null;
      prevInput?.focus();
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {isVerified ? (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Email Verified</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <span className="text-sm font-medium">Email Not Verified</span>
          </div>
        )}
      </div>

      {!isVerified && (
        <button
          onClick={handleSendVerification}
          disabled={isSending || countdown > 0}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {isSending ? 'Sending...' : 'Verify Email'}
        </button>
      )}

      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900">Verify your email</h3>
            <p className="text-sm text-gray-600 mt-1">Enter the 6-digit code sent to {email}</p>

            {/* OTP Inputs */}
            <div className="mt-4 grid grid-cols-6 gap-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`profile-otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-10 h-12 text-center border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              ))}
            </div>

            {error && (
              <div className="mt-3 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {error}
              </div>
            )}

            {/* Countdown and Resend */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {countdown > 0 ? `Resend available in ${Math.floor(countdown / 60)}m ${countdown % 60}s` : 'You can resend a new code.'}
              </div>
              <button
                className="inline-flex items-center text-green-700 hover:text-green-800 disabled:text-gray-400"
                onClick={handleSendVerification}
                disabled={countdown > 0 || isSending}
              >
                <Send className="h-4 w-4 mr-1" /> Resend OTP
              </button>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyOTP}
                disabled={isLoading}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};