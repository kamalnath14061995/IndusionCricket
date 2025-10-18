import React, { useState, useEffect, useRef } from 'react';
import { Mail, CheckCircle, AlertCircle, Clock, Send, X } from 'lucide-react';
import { EmailVerificationService } from '../services/emailVerificationService';

interface EnhancedEmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerificationComplete: () => void;
}

export const EnhancedEmailVerificationModal: React.FC<EnhancedEmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
  onVerificationComplete,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(180);
  const [verificationToken, setVerificationToken] = useState('');
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      handleSendOTP();
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendOTP = async () => {
    setIsSending(true);
    setError(null);
    setCountdown(180);
    setCanResend(false);

    try {
      const response = await EmailVerificationService.sendVerificationEmail();
      if (response.success) {
        setVerificationToken(response.data?.token || '');
      } else {
        setError(response.message || 'Failed to send verification email');
      }
    } catch (err) {
      setError('Failed to send verification email');
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        setSuccess(true);
        setTimeout(() => {
          onClose();
          onVerificationComplete();
        }, 2000);
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Verified!</h3>
            <p className="text-gray-600">Your email has been successfully verified.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-600 mb-6">
              Enter the 6-digit code sent to <span className="font-semibold">{email}</span>
            </p>

            <div className="flex justify-center space-x-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
            )}

            <div className="flex items-center justify-between mb-6">
              <span className="text-sm text-gray-600">
                {countdown > 0 ? (
                  <>
                    <Clock className="inline h-4 w-4 mr-1" />
                    {formatTime(countdown)}
                  </>
                ) : (
                  <span>OTP expired</span>
                )}
              </span>
              <button
                type="button"
                onClick={handleSendOTP}
                disabled={!canResend || isSending}
                className="text-green-600 hover:text-green-700 text-sm font-medium disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Resend OTP'}
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading || otp.some(d => !d)}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
