import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, MapPin, Users } from 'lucide-react';
import axios from 'axios';

interface Facility {
  id: string;
  name: string;
  type: 'ground' | 'net';
  pricePerHour: number;
  description: string;
}

interface PricingPackage {
  id: string;
  packageName: string;
  packageType: string;
  durationType: string;
  basePrice: number;
  discountedPrice: number;
}

interface AddOnService {
  id: string;
  serviceName: string;
  basePrice: number;
}

interface Team {
  id: string;
  teamName: string;
  teamCaptainName: string;
  teamSize: number;
}

interface EnhancedBookingCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}

const EnhancedBookingCreateModal: React.FC<EnhancedBookingCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  token
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [pricingPackages, setPricingPackages] = useState<PricingPackage[]>([]);
  const [addOnServices, setAddOnServices] = useState<AddOnService[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);

  const [formData, setFormData] = useState({
    bookingType: 'ground' as 'ground' | 'net',
    facilityId: '',
    pricingPackageId: '',
    bookingDate: '',
    startTime: '',
    endTime: '',
    teamId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfPlayers: 1,
    specialRequirements: '',
  });

  const getAuthConfig = () => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    if (isOpen) {
      fetchFacilities();
      fetchPricingPackages();
      fetchAddOnServices();
      fetchTeams();
    }
  }, [isOpen]);

  const fetchFacilities = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/grounds', getAuthConfig());
      setFacilities(response.data);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const fetchPricingPackages = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/pricing-packages', getAuthConfig());
      setPricingPackages(response.data);
    } catch (error) {
      console.error('Error fetching pricing packages:', error);
    }
  };

  const fetchAddOnServices = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/add-on-services', getAuthConfig());
      setAddOnServices(response.data);
    } catch (error) {
      console.error('Error fetching add-on services:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/teams', getAuthConfig());
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const calculateTotalPrice = () => {
    const selectedPackage = pricingPackages.find(p => p.id === formData.pricingPackageId);
    let basePrice = selectedPackage ? selectedPackage.discountedPrice || selectedPackage.basePrice : 0;
    let addOnsPrice = selectedAddOns.reduce((sum, id) => {
      const addOn = addOnServices.find(service => service.id === id);
      return sum + (addOn ? addOn.basePrice : 0);
    }, 0);
    return basePrice + addOnsPrice;
  };

  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [formData.pricingPackageId, selectedAddOns]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const bookingData = {
        ...formData,
        addOnServices: selectedAddOns,
        totalPrice,
      };

      await axios.post('http://localhost:8080/api/bookings/enhanced', bookingData, getAuthConfig());
      onSuccess();
      resetForm();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      bookingType: 'ground',
      facilityId: '',
      pricingPackageId: '',
      bookingDate: '',
      startTime: '',
      endTime: '',
      teamId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      numberOfPlayers: 1,
      specialRequirements: '',
    });
    setSelectedAddOns([]);
    setTotalPrice(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Create Enhanced Booking</h2>
          <button
            onClick={onClose}
            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
            aria-label="Close modal"
            type="button"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Booking Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, bookingType: 'ground' }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.bookingType === 'ground'
                    ? 'border-green-600 bg-green-50 text-green-900'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              >
                <MapPin className="inline h-4 w-4 mr-2" />
                Ground Booking
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, bookingType: 'net' }))}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.bookingType === 'net'
                    ? 'border-blue-600 bg-blue-50 text-blue-900'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <Users className="inline h-4 w-4 mr-2" />
                Net Practice
              </button>
            </div>
          </div>

          {/* Facility Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Facility</label>
            <select
              value={formData.facilityId}
              onChange={(e) => setFormData(prev => ({ ...prev, facilityId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Select a facility</option>
              {facilities
                .filter(f => f.type === formData.bookingType)
                .map(facility => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name} - ₹{facility.pricePerHour}/hour
                  </option>
                ))}
            </select>
          </div>

          {/* Date and Time Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Booking Date
              </label>
              <input
                type="date"
                value={formData.bookingDate}
                onChange={(e) => setFormData(prev => ({ ...prev, bookingDate: e.target.value }))}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Time Slot
              </label>
              <select
                value={`${formData.startTime}-${formData.endTime}`}
                onChange={(e) => {
                  const [start, end] = e.target.value.split('-');
                  setFormData(prev => ({ ...prev, startTime: start, endTime: end }));
                }}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                required
              >
                <option value="">Select time slot</option>
                {['09:00-10:00', '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00', '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00', '19:00-20:00', '20:00-21:00'].map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Full Name
              </label>
              <input
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Enter customer name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address
              </label>
              <input
                type="email"
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Enter email address"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline h-4 w-4 mr-1" />
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                placeholder="Enter phone number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Number of Players
              </label>
              <input
                type="number"
                value={formData.numberOfPlayers}
                onChange={(e) => setFormData(prev => ({ ...prev, numberOfPlayers: parseInt(e.target.value) }))}
                min="1"
                max="30"
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Special Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Special Requirements</label>
            <textarea
              value={formData.specialRequirements}
              onChange={(e) => setFormData(prev => ({ ...prev, specialRequirements: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              rows={3}
              placeholder="Any special requirements..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedBookingCreateModal;