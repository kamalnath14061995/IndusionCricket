import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle, AlertCircle, Clock, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const EmailVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [verificationToken, setVerificationToken] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const email = location.state?.email || user?.email;

  useEffect(() => {
    if (!email) {
      navigate('/register');
      return;
    }

    // Send initial verification email
    handleSendVerification();
  }, [email, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleSendVerification = async () => {
    setIsSending(true);
    setError('');
    
    try {
      const response = await fetch('/api/verify/send-otp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setVerificationToken(data.token);
        setCountdown(180);
      } else {
        setError(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      setError('An error occurred while sending verification email');
    } finally {
      setIsSending(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter a 6-digit OTP');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/verify/verify-otp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken, otp: otpCode }),
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Invalid or expired OTP');
      }
    } catch (error) {
      setError('An error occurred while verifying OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendVerification = async () => {
    setIsSending(true);
    setError('');
    
    try {
      const response = await fetch('/api/verify/send-otp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setVerificationToken(data.token);
        setCountdown(180);
      } else {
        setError(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      setError('An error occurred while sending verification email');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Email Verified!</h2>
            <p className="text-gray-600 mb-6">Your email has been successfully verified. Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Mail className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to <strong>{email}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Verification Code
              </label>
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {countdown > 0 ? (
                  <span>Code expires in {formatTime(countdown)}</span>
                ) : (
                  <span>Code expired</span>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleSendVerification}
                disabled={isSending || countdown > 0}
                className="text-green-600 hover:text-green-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <span className="flex items-center">
                    <Send className="h-4 w-4 mr-1 animate-pulse" />
                    Sending...
                  </span>
                ) : countdown > 0 ? (
                  'Resend code'
                ) : (
                  'Resend code'
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="text-green-600 hover:text-green-500"
              >
                register with a different email
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
