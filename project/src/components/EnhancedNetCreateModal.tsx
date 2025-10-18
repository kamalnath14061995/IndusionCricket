import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Plus, Save, Loader2, Upload, Link } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { HomepageApiService } from '../services/homepageApiService';

interface NetRequestDTO {
  groundId?: number;
  name: string;
  netNumber: string;
  description: string;
  capacity: number;
  locationType: 'INDOOR' | 'OUTDOOR';
  surfaceType: 'TURF' | 'MATTING' | 'CEMENT';
  netLength: number;
  netWidth: number;
  netHeight: number;
  playerCapacityPerNet: number;
  hasBowlingMachine: boolean;
  bowlingMachineSpeedRange: string;
  hasFloodlights: boolean;
  floodlightLuxRating: number;
  hasProtectiveNetting: boolean;
  safetyGearAvailable: string[];
  equipmentRental: string[];
  hasWashrooms: boolean;
  hasChangingRooms: boolean;
  hasDrinkingWater: boolean;
  hasSeatingArea: boolean;
  hasParking: boolean;
  hasFirstAid: boolean;
  coachingAvailable: boolean;
  coachingPricePerHour: number;
  hasCctv: boolean;
  cctvRecordingAvailable: boolean;
  slotDurationMinutes: number;
  individualBookingAllowed: boolean;
  groupBookingAllowed: boolean;
  maxGroupSize: number;
  pricingPerNet: number;
  pricingPerPlayer: number;
  membershipDiscountPercentage: number;
  bulkBookingDiscount: Record<string, number>;
  cancellationPolicy: string;
  onlinePaymentMethods: string[];
  addOnServices: Record<string, number>;
  compatibleBallTypes: string[];
  safetyPaddingDetails: string;
  ventilationSystem: string;
  bookingCalendarEnabled: boolean;
  realTimeAvailability: boolean;
  pricePerHour: number;
  isAvailable: boolean;
  features: string[];
  imageUrl: string;
}

interface EnhancedNetCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  groundId?: number;
  grounds: any[];
  mode?: 'create' | 'edit';
  netId?: number;
  useManagement?: boolean;
}

const EnhancedNetCreateModal: React.FC<EnhancedNetCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  groundId,
  grounds,
  mode = 'create',
  netId,
  useManagement = false
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [netUploading, setNetUploading] = useState(false);
  const [netUploadError, setNetUploadError] = useState('');
  const [netUrlInput, setNetUrlInput] = useState('');

  const [formData, setFormData] = useState<NetRequestDTO>({
    name: '',
    netNumber: '',
    description: '',
    capacity: 4,
    locationType: 'OUTDOOR',
    surfaceType: 'TURF',
    netLength: 22,
    netWidth: 12,
    netHeight: 12,
    playerCapacityPerNet: 4,
    hasBowlingMachine: false,
    bowlingMachineSpeedRange: '',
    hasFloodlights: false,
    floodlightLuxRating: 500,
    hasProtectiveNetting: true,
    safetyGearAvailable: ['Helmets', 'Pads', 'Gloves'],
    equipmentRental: ['Bats', 'Balls', 'Stumps'],
    hasWashrooms: false,
    hasChangingRooms: false,
    hasDrinkingWater: true,
    hasSeatingArea: true,
    hasParking: true,
    hasFirstAid: true,
    coachingAvailable: false,
    coachingPricePerHour: 0,
    hasCctv: false,
    cctvRecordingAvailable: false,
    slotDurationMinutes: 60,
    individualBookingAllowed: true,
    groupBookingAllowed: true,
    maxGroupSize: 6,
    pricingPerNet: 150,
    pricingPerPlayer: 50,
    membershipDiscountPercentage: 10,
    bulkBookingDiscount: { weekly: 10, monthly: 20 },
    cancellationPolicy: 'Free cancellation up to 24 hours before booking',
    onlinePaymentMethods: ['UPI', 'Credit Card', 'Debit Card'],
    addOnServices: { bowlingMachine: 100, coach: 500, videoAnalysis: 200 },
    compatibleBallTypes: ['Leather', 'Tennis', 'Synthetic'],
    safetyPaddingDetails: 'Full safety padding on all sides',
    ventilationSystem: 'Natural ventilation with fans',
    bookingCalendarEnabled: true,
    realTimeAvailability: true,
    pricePerHour: 150,
    isAvailable: true,
    features: ['Professional Setup', 'Safety Features'],
    imageUrl: ''
  });

  const [selectedGroundId, setSelectedGroundId] = useState<number | null>(groundId || null);

  // Fetch existing net data when editing
  useEffect(() => {
    if (mode === 'edit' && netId && token) {
      fetchExistingNet();
    }
  }, [mode, netId, token]);

  const fetchExistingNet = async () => {
    if (!netId || !token) return;

    try {
      const base = useManagement ? 'http://localhost:8080/api/admin/nets' : 'http://localhost:8080/api/nets';
      const response = await axios.get(`${base}/${netId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const netData = response.data;

      // Populate form with existing data
      setFormData({
        name: netData.name || '',
        netNumber: netData.netNumber || '',
        description: netData.description || '',
        capacity: netData.capacity || 4,
        locationType: netData.locationType || 'OUTDOOR',
        surfaceType: netData.surfaceType || 'TURF',
        netLength: netData.netLength || 22,
        netWidth: netData.netWidth || 12,
        netHeight: netData.netHeight || 12,
        playerCapacityPerNet: netData.playerCapacityPerNet || 4,
        hasBowlingMachine: netData.hasBowlingMachine || false,
        bowlingMachineSpeedRange: netData.bowlingMachineSpeedRange || '',
        hasFloodlights: netData.hasFloodlights || false,
        floodlightLuxRating: netData.floodlightLuxRating || 500,
        hasProtectiveNetting: netData.hasProtectiveNetting !== undefined ? netData.hasProtectiveNetting : true,
        safetyGearAvailable: netData.safetyGearAvailable || ['Helmets', 'Pads', 'Gloves'],
        equipmentRental: netData.equipmentRental || ['Bats', 'Balls', 'Stumps'],
        hasWashrooms: netData.hasWashrooms || false,
        hasChangingRooms: netData.hasChangingRooms || false,
        hasDrinkingWater: netData.hasDrinkingWater !== undefined ? netData.hasDrinkingWater : true,
        hasSeatingArea: netData.hasSeatingArea !== undefined ? netData.hasSeatingArea : true,
        hasParking: netData.hasParking !== undefined ? netData.hasParking : true,
        hasFirstAid: netData.hasFirstAid !== undefined ? netData.hasFirstAid : true,
        coachingAvailable: netData.coachingAvailable || false,
        coachingPricePerHour: netData.coachingPricePerHour || 0,
        hasCctv: netData.hasCctv || false,
        cctvRecordingAvailable: netData.cctvRecordingAvailable || false,
        slotDurationMinutes: netData.slotDurationMinutes || 60,
        individualBookingAllowed: netData.individualBookingAllowed !== undefined ? netData.individualBookingAllowed : true,
        groupBookingAllowed: netData.groupBookingAllowed !== undefined ? netData.groupBookingAllowed : true,
        maxGroupSize: netData.maxGroupSize || 6,
        pricingPerNet: netData.pricingPerNet || 150,
        pricingPerPlayer: netData.pricingPerPlayer || 50,
        membershipDiscountPercentage: netData.membershipDiscountPercentage || 10,
        bulkBookingDiscount: netData.bulkBookingDiscount || { weekly: 10, monthly: 20 },
        cancellationPolicy: netData.cancellationPolicy || 'Free cancellation up to 24 hours before booking',
        onlinePaymentMethods: netData.onlinePaymentMethods || ['UPI', 'Credit Card', 'Debit Card'],
        addOnServices: netData.addOnServices || { bowlingMachine: 100, coach: 500, videoAnalysis: 200 },
        compatibleBallTypes: netData.compatibleBallTypes || ['Leather', 'Tennis', 'Synthetic'],
        safetyPaddingDetails: netData.safetyPaddingDetails || 'Full safety padding on all sides',
        ventilationSystem: netData.ventilationSystem || 'Natural ventilation with fans',
        bookingCalendarEnabled: netData.bookingCalendarEnabled !== undefined ? netData.bookingCalendarEnabled : true,
        realTimeAvailability: netData.realTimeAvailability !== undefined ? netData.realTimeAvailability : true,
        pricePerHour: netData.pricePerHour || 150,
        isAvailable: netData.isAvailable !== undefined ? netData.isAvailable : true,
        features: netData.features || ['Professional Setup', 'Safety Features'],
        imageUrl: netData.imageUrl || ''
      });

      // Set the selected ground ID from existing net
      setSelectedGroundId(netData.groundId);

    } catch (error) {
      console.error('Failed to fetch existing net:', error);
      setError('Failed to load net data for editing');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate that a ground is selected
    if (!selectedGroundId) {
      setError('Please select a ground for the net');
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      const payload = { ...formData, groundId: selectedGroundId };

      // Choose base route: management vs admin
      const base = useManagement ? 'http://localhost:8080/api/admin/nets' : 'http://localhost:8080/api/nets';

      if (mode === 'edit' && netId) {
        // Update existing net
        const editEndpoint = useManagement ? `${base}/edit/${netId}` : `${base}/${netId}`;
        await axios.put(editEndpoint, payload, config);
        toast.success('Net updated successfully!');
      } else if (useManagement) {
        // Create via admin route with groundId in payload
        await axios.post(`${base}/create`, payload, config);
        toast.success('Net created successfully!');
      } else if (selectedGroundId) {
        // Public route supports creating under a specific ground
        await axios.post(`${base}/ground/${selectedGroundId}`, payload, config);
        toast.success('Net created successfully!');
      } else {
        // Public route without specific ground
        await axios.post(base, payload, config);
        toast.success('Net created successfully!');
      }

      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || `Failed to ${mode === 'edit' ? 'update' : 'create'} net`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlUpload = async (url: string) => {
    if (!token) return;

    setNetUploading(true);
    setNetUploadError('');

    try {
      const uploadedUrl = await HomepageApiService.uploadFromUrl(token, url);
      setFormData(prev => ({ ...prev, imageUrl: uploadedUrl }));
    } catch (error: any) {
      setNetUploadError(error.message || 'URL upload failed');
    } finally {
      setNetUploading(false);
    }
  };

  const handleInputChange = (field: keyof NetRequestDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: keyof NetRequestDTO, value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
  };

  const handleObjectChange = (field: keyof NetRequestDTO, key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: { ...(prev[field] as any), [key]: numValue }
    }));
  };

if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-auto relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{mode === 'edit' ? 'Edit Cricket Net' : 'Create Cricket Net'}</h2>
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
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net Number</label>
              <input
                type="text"
                value={formData.netNumber}
                onChange={(e) => handleInputChange('netNumber', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ground *</label>
              <select
                value={selectedGroundId || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setSelectedGroundId(value === '' ? null : Number(value));
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={!!groundId}
                required
              >
                <option value="">Select Ground</option>
                {grounds.map(ground => (
                  <option key={ground.id} value={ground.id}>{ground.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="1"
                max="50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={netUrlInput}
                onChange={(e) => setNetUrlInput(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://example.com/net-image.jpg"
              />
              <button
                type="button"
                onClick={() => {
                  handleUrlUpload(netUrlInput);
                }}
                className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                disabled={netUploading}
              >
                <Link className="w-4 h-4 mr-1" />
                Fetch
              </button>
            </div>
            {netUploading && <div className="text-sm text-blue-600 mt-1">Uploading...</div>}
            {netUploadError && <div className="text-sm text-red-600 mt-1">{netUploadError}</div>}
            {formData.imageUrl && (
              <div className="mt-2">
                <img
                  src={formData.imageUrl}
                  alt="Net preview"
                  className="max-w-xs h-32 object-cover rounded-md border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Image File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Net Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                // Upload file to backend or cloud storage
                const formDataUpload = new FormData();
                formDataUpload.append('file', file);
                try {
                  const response = await fetch('http://localhost:8080/api/nets/upload-image', {
                    method: 'POST',
                    headers: {
                      'Authorization': `Bearer ${token}`
                    },
                    body: formDataUpload
                  });
                  if (response.ok) {
                    const data = await response.json();
                    handleInputChange('imageUrl', data.url);
                  } else {
                    alert('Failed to upload image');
                  }
                } catch (error) {
                  alert('Error uploading image');
                }
              }}
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </div>

          {/* Location & Surface */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location Type</label>
              <select
                value={formData.locationType}
                onChange={(e) => handleInputChange('locationType', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="OUTDOOR">Outdoor</option>
                <option value="INDOOR">Indoor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Surface Type</label>
              <select
                value={formData.surfaceType}
                onChange={(e) => handleInputChange('surfaceType', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="TURF">Turf</option>
                <option value="MATTING">Matting</option>
                <option value="CEMENT">Cement</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Hour *</label>
              <input
                type="number"
                value={formData.pricePerHour}
                onChange={(e) => handleInputChange('pricePerHour', parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net Length (m)</label>
              <input
                type="number"
                value={formData.netLength}
                onChange={(e) => handleInputChange('netLength', parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="10"
                max="50"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net Width (m)</label>
              <input
                type="number"
                value={formData.netWidth}
                onChange={(e) => handleInputChange('netWidth', parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="5"
                max="25"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Net Height (m)</label>
              <input
                type="number"
                value={formData.netHeight}
                onChange={(e) => handleInputChange('netHeight', parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                min="5"
                max="20"
                step="0.1"
              />
            </div>
          </div>

          {/* Facilities */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Facilities & Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasBowlingMachine}
                    onChange={(e) => handleInputChange('hasBowlingMachine', e.target.checked)}
                    className="mr-2"
                  />
                  Bowling Machine
                </label>
                
                {formData.hasBowlingMachine && (
                  <input
                    type="text"
                    placeholder="Speed range (e.g., 40-150 kmph)"
                    value={formData.bowlingMachineSpeedRange}
                    onChange={(e) => handleInputChange('bowlingMachineSpeedRange', e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 ml-4"
                  />
                )}

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.hasFloodlights}
                    onChange={(e) => handleInputChange('hasFloodlights', e.target.checked)}
                    className="mr-2"
                  />
                  Floodlights
                </label>

                {formData.hasFloodlights && (
                  <input
                    type="number"
                    placeholder="Lux rating"
                    value={formData.floodlightLuxRating}
                    onChange={(e) => handleInputChange('floodlightLuxRating', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 ml-4"
                  />
                )}

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.coachingAvailable}
                    onChange={(e) => handleInputChange('coachingAvailable', e.target.checked)}
                    className="mr-2"
                  />
                  Coaching Available
                </label>

                {formData.coachingAvailable && (
                  <input
                    type="number"
                    placeholder="Price per hour"
                    value={formData.coachingPricePerHour}
                    onChange={(e) => handleInputChange('coachingPricePerHour', parseFloat(e.target.value))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 ml-4"
                  />
                )}
              </div>

              <div className="space-y-2">
                {[
                  { key: 'hasWashrooms', label: 'Washrooms' },
                  { key: 'hasChangingRooms', label: 'Changing Rooms' },
                  { key: 'hasDrinkingWater', label: 'Drinking Water' },
                  { key: 'hasSeatingArea', label: 'Seating Area' },
                  { key: 'hasParking', label: 'Parking' },
                  { key: 'hasFirstAid', label: 'First Aid' },
                  { key: 'hasCctv', label: 'CCTV' },
                  { key: 'hasProtectiveNetting', label: 'Protective Netting' }
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData[key as keyof NetRequestDTO] as boolean}
                      onChange={(e) => handleInputChange(key as keyof NetRequestDTO, e.target.checked)}
                      className="mr-2"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Configuration */}
          <div className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">Booking Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slot Duration (minutes)</label>
                <select
                  value={formData.slotDurationMinutes}
                  onChange={(e) => handleInputChange('slotDurationMinutes', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Group Size</label>
                <input
                  type="number"
                  value={formData.maxGroupSize}
                  onChange={(e) => handleInputChange('maxGroupSize', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  min="1"
                  max="20"
                />
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 mt-6">
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
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === 'edit' ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {mode === 'edit' ? 'Update Net' : 'Create Net'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnhancedNetCreateModal;




