import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, Clock, Send } from 'lucide-react';
import { EmailVerificationService } from '../services/emailVerificationService';
import { useAuth } from '../contexts/AuthContext';

interface EmailVerificationFieldProps {
  email: string;
  onVerificationComplete: () => void;
}

export const EmailVerificationField: React.FC<EmailVerificationFieldProps> = ({
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

  const { user } = useAuth();

  useEffect(() => {
    checkVerificationStatus();
  }, [email]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const checkVerificationStatus = async () => {
    try {
      const status = await EmailVerificationService.getVerificationStatus();
      setIsVerified(status.verified);
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
        setCountdown(180);
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
    setIsLoading(true);
    setError(null);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP');
      setIsLoading(false);
      return;
    }

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
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`profile-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isVerified) {
    return (
      <div className="flex items-center space-x-2 text-green-600">
        <CheckCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Email Verified</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 text-red-600">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm font-medium">Email Not Verified</span>
      </div>
      
      <button
        onClick={handleSendVerification}
        disabled={isSending || countdown > 0}
        className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      >
        <Send className="h-4 w-4" />
        <span>{isSending ? 'Sending...' : 'Verify Email'}</span>
      </button>

      {countdown > 0 && (
        <p className="text-xs text-gray-500">
          Resend available in {formatTime(countdown)}
        </p>
      )}

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Enter Verification Code</h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a 6-digit code to {email}
            </p>

            <div className="flex justify-center space-x-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`profile-otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-10 h-10 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            <div className="flex space-x-2">
              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otp.join('').length !== 6}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtp(['', '', '', '', '', '']);
                  setError(null);
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
