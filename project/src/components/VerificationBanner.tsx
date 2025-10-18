import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, X } from 'lucide-react';
import { EmailVerificationService } from '../services/emailVerificationService';
import { useAuth } from '../contexts/AuthContext';

export const VerificationBanner: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const status = await EmailVerificationService.getVerificationStatus();
      setIsVerified(status.verified);
    } catch (error) {
      console.error('Failed to check verification status:', error);
    }
  };

  const handleSendVerification = async () => {
    setIsLoading(true);
    try {
      await EmailVerificationService.sendVerificationEmail();
      alert('Verification email sent! Please check your inbox.');
    } catch (error) {
      alert('Failed to send verification email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isVerified || !showBanner || !user) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <Mail className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Email verification required</strong>
          </p>
          <p className="text-sm text-yellow-600 mt-1">
            Please verify your email address to access all features.
          </p>
          <div className="mt-2 flex items-center space-x-4">
            <button
              onClick={handleSendVerification}
              disabled={isLoading}
              className="text-sm font-medium text-yellow-700 hover:text-yellow-600 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Resend verification email'}
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Dismiss
            </button>
          </div>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={() => setShowBanner(false)}
            className="inline-flex rounded-md p-1 hover:bg-yellow-100"
          >
            <X className="h-4 w-4 text-yellow-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
