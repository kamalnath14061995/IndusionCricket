import React, { useState, useEffect } from 'react';
import { CreditCard, Users, Settings, Shield, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiPaymentService, PaymentMethodKey } from '../services/apiPaymentService';
import axios from 'axios';

interface PaymentMethod {
  key: string;
  label: string;
  type: 'OFFLINE' | 'ONLINE';
  provider?: string;
}

interface PaymentConfig {
  globalEnabled: Record<string, boolean>;
  perUserAllowed: Record<string, PaymentMethodKey[]>;
  restrictions: Record<string, { blocked: boolean; reason?: string }>;
}

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  phone?: string;
  role?: string;
  age?: number;
  experienceLevel?: string;
}

const AdminPaymentManagement: React.FC = () => {
  const { token, logout } = useAuth();
  const [config, setConfig] = useState<PaymentConfig>({
    globalEnabled: {},
    perUserAllowed: {},
    restrictions: {}
  });
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const paymentMethods: PaymentMethod[] = [
    { key: 'CASH', label: 'Cash (Offline)', type: 'OFFLINE' },
    { key: 'CARD_RAZORPAY', label: 'Card/UPI (Razorpay)', type: 'ONLINE', provider: 'RAZORPAY' }
  ];

  // Helper function to get axios config with headers
  const getAuthConfig = () => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    if (token) {
      fetchPaymentConfig();
      fetchUsers();
    }
  }, [token]);

  const fetchPaymentConfig = async () => {
    try {
      setLoading(true);
      const response = await apiPaymentService.getPaymentConfig();
      // Ensure the response has the expected structure
      const safeConfig: PaymentConfig = {
        globalEnabled: response?.globalEnabled || {},
        perUserAllowed: response?.perUserAllowed || {},
        restrictions: response?.restrictions || {}
      };
      setConfig(safeConfig);
    } catch (error) {
      setError('Failed to fetch payment configuration');
      // Keep the default config on error
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:8080/api/admin/users', getAuthConfig());
      // Backend wraps response in ApiResponse<T>
      const userData = res.data?.data ?? [];
      setUsers(userData);
      setError('');
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setError('Session expired. Please log in again.');
        await logout();
        return;
      }
      console.error('Failed to load users', e);
      setError('Failed to fetch users from database');
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentConfig = async (newConfig: PaymentConfig) => {
    try {
      setLoading(true);
      await apiPaymentService.updatePaymentConfig(newConfig);
      setConfig(newConfig);
      setSuccess('Payment configuration updated successfully');
    } catch (error) {
      setError('Failed to update payment configuration');
    } finally {
      setLoading(false);
    }
  };

  const toggleGlobalPaymentMethod = (methodKey: string) => {
    const newConfig = { ...config };
    if (!newConfig.globalEnabled) {
      newConfig.globalEnabled = {};
    }
    newConfig.globalEnabled[methodKey] = !newConfig.globalEnabled[methodKey];
    updatePaymentConfig(newConfig);
  };

  const toggleUserPaymentMethod = (userId: string, methodKey: string) => {
    const newConfig = { ...config };
    if (!newConfig.perUserAllowed[userId]) {
      newConfig.perUserAllowed[userId] = [];
    }
    
    const userMethods = newConfig.perUserAllowed[userId];
    if (userMethods.includes(methodKey as PaymentMethodKey)) {
      newConfig.perUserAllowed[userId] = userMethods.filter(m => m !== methodKey);
    } else {
      newConfig.perUserAllowed[userId] = [...userMethods, methodKey as PaymentMethodKey];
    }
    
    updatePaymentConfig(newConfig);
  };

  const toggleUserRestriction = (userId: string) => {
    const newConfig = { ...config };
    if (newConfig.restrictions[userId]) {
      delete newConfig.restrictions[userId];
    } else {
      newConfig.restrictions[userId] = { blocked: true, reason: 'Admin restriction' };
    }
    updatePaymentConfig(newConfig);
  };

  const getUserAllowedMethods = (userId: string) => {
    const globalEnabled = config.globalEnabled
      ? Object.entries(config.globalEnabled)
          .filter(([_, enabled]) => enabled)
          .map(([key]) => key)
      : [];

    if (config.restrictions?.[userId]?.blocked) {
      return [];
    }

    if (config.perUserAllowed?.[userId]) {
      return config.perUserAllowed[userId].filter(method => globalEnabled.includes(method));
    }

    return globalEnabled;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Management</h3>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Global Payment Methods */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <Settings className="h-5 w-5 mr-2" />
              Global Payment Methods
            </h4>
            <div className="space-y-2">
              {paymentMethods.map(method => (
                <div key={method.key} className="flex items-center justify-between p-3 bg-white rounded-md">
                  <div>
                    <div className="font-medium text-gray-900">{method.label}</div>
                    <div className="text-sm text-gray-500">{method.type}</div>
                  </div>
                  <button
                    onClick={() => toggleGlobalPaymentMethod(method.key)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      config.globalEnabled?.[method.key]
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {config.globalEnabled?.[method.key] ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* User Payment Access */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              User Payment Access
              {loading && (
                <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              )}
            </h4>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select User
              </label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={loading}
              >
                <option value="">
                  {loading ? 'Loading users...' : users.length === 0 ? 'No users found' : 'Select a user'}
                </option>
                {users.map(user => (
                  <option key={user.id} value={user.id.toString()}>
                    {user.name} ({user.email}) - {user.role || 'user'}
                  </option>
                ))}
              </select>
            </div>

            {selectedUser && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">User Restrictions</span>
                  <button
                    onClick={() => toggleUserRestriction(selectedUser)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      config.restrictions[selectedUser]?.blocked
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {config.restrictions[selectedUser]?.blocked ? 'Restricted' : 'Allowed'}
                  </button>
                </div>

                {!config.restrictions[selectedUser]?.blocked && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Allowed Payment Methods</span>
                    <div className="mt-2 space-y-2">
                      {paymentMethods.map(method => (
                        <div key={method.key} className="flex items-center justify-between p-2 bg-white rounded">
                          <span className="text-sm">{method.label}</span>
                          <button
                            onClick={() => toggleUserPaymentMethod(selectedUser, method.key)}
                            className={`px-2 py-1 rounded text-xs ${
                              getUserAllowedMethods(selectedUser).includes(method.key)
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {getUserAllowedMethods(selectedUser).includes(method.key) ? 'Allowed' : 'Denied'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="text-md font-semibold text-blue-900 mb-2 flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Configuration Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Global Methods:</span>
              <span className="ml-2">
                {Object.entries(config.globalEnabled).filter(([_, enabled]) => enabled).length} enabled
              </span>
            </div>
            <div>
              <span className="font-medium">Restricted Users:</span>
              <span className="ml-2">{Object.keys(config.restrictions).length}</span>
            </div>
            <div>
              <span className="font-medium">Custom User Configs:</span>
              <span className="ml-2">{Object.keys(config.perUserAllowed).length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPaymentManagement;
