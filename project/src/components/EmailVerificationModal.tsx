import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailVerificationService } from '../services/emailVerificationService';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export const EmailVerificationModal: React.FC<EmailVerificationModalProps> = ({
  isOpen,
  onClose,
  email,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
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
      const response = await EmailVerificationService.verifyOTP('token', otpCode);
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(response.message || 'Invalid or expired OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Verify Your Email</h2>
        
        {success ? (
          <div className="text-center">
            <div className="text-green-600 mb-4">Email verified successfully!</div>
            <button
              onClick={onClose}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Continue
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="text-gray-600 mb-4">
              Enter the 6-digit code sent to {email}
            </p>
            
            <div className="flex justify-center space-x-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md"
                />
              ))}
            </div>

            {error && (
              <div className="text-red-500 text-sm mb-4">{error}</div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md disabled:opacity-50"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md"
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
