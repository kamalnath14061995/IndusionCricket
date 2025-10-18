import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Mail, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

interface Facility {
  id: string;
  name: string;
  type: string;
  pricePerHour: number;
}

interface Booking {
  id: number;
  bookingType: 'ground' | 'net';
  facilityId: string;
  facilityName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  price: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
}

interface BookingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onSuccess: () => void;
  token: string;
}

const BookingEditModal: React.FC<BookingEditModalProps> = ({
  isOpen,
  onClose,
  booking,
  onSuccess,
  token
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const [formData, setFormData] = useState<Booking | null>(null);

  const getAuthConfig = () => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    if (isOpen && booking) {
      setFormData(booking);
      fetchFacilities();
    }
  }, [isOpen, booking]);

  const fetchFacilities = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/grounds');
      const grounds = response.data.map((g: any) => ({
        id: g.id,
        name: g.name,
        type: 'ground',
        pricePerHour: g.pricePerHour
      }));
      
      const netsResponse = await axios.get('http://localhost:8080/api/nets');
      const nets = netsResponse.data.map((n: any) => ({
        id: n.id,
        name: n.name,
        type: 'net',
        pricePerHour: n.pricePerHour
      }));
      
      setFacilities([...grounds, ...nets]);
    } catch (error) {
      console.error('Error fetching facilities:', error);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!formData?.bookingDate || !formData?.facilityId) return;
    
    try {
      const response = await axios.get('http://localhost:8080/api/bookings/available-slots', {
        params: {
          date: formData.bookingDate,
          facilityId: formData.facilityId
        }
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    fetchAvailableSlots();
  }, [formData?.bookingDate, formData?.facilityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData) return;

      const response = await axios.put(`http://localhost:8080/api/bookings/admin/${formData.id}`, formData, getAuthConfig());
      
      onSuccess();
      resetForm();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to update booking');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(null);
    setError('');
  };

  if (!isOpen || !formData) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Edit Booking</h2>
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
          {/* Facility Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="inline h-4 w-4 mr-1" />
              Select Facility
            </label>
            <select
              value={formData.facilityId}
              onChange={(e) => setFormData(prev => ({ ...prev, facilityId: e.target.value }))}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Select a facility</option>
              {facilities.map(facility => (
                <option key={facility.id} value={facility.id}>
                  {facility.name} - ₹{facility.pricePerHour}/hour
                </option>
              ))}
            </select>
          </div>

          {/* Date Selection */}
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

          {/* Time Slot Selection */}
          {formData.bookingDate && formData.facilityId && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline h-4 w-4 mr-1" />
                Select Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, startTime: slot.split(' - ')[0], endTime: slot.split(' - ')[1] }))}
                    className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                      formData.startTime === slot.split(' - ')[0]
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Customer Information</h3>
            
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
          </div>

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
              {loading ? 'Updating...' : 'Update Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingEditModal;
