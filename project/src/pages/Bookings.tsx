import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CreditCard, Users, CheckCircle, History, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BookingService, UserBooking } from '../services/bookingService';

interface Facility {
  id: string;
  name: string;
  type: string;
  capacity?: number;
  pricePerHour: number;
  facilities?: string[];
  description?: string;
  features?: string[];
  location?: string;
  isAvailable?: boolean;
  imageUrl?: string;
  // Ground specific fields
  hasFloodlights?: boolean;
  hasPavilion?: boolean;
  hasDressingRooms?: boolean;
  hasWashrooms?: boolean;
  hasParking?: boolean;
  hasShowers?: boolean;
  hasDrinkingWater?: boolean;
  hasFirstAid?: boolean;
  hasRefreshments?: boolean;
  hasPracticeNets?: boolean;
  hasLiveStreaming?: boolean;
  seatingCapacity?: number;
  scoreboardType?: string;
  // Net specific fields
  locationType?: string;
  surfaceType?: string;
  hasBowlingMachine?: boolean;
  hasProtectiveNetting?: boolean;
  netLength?: number;
  netWidth?: number;
  netHeight?: number;
}

const Bookings: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'create' | 'recent' | 'history'>('create');
  const [bookingType, setBookingType] = useState<'ground' | 'net'>('ground');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [matchType, setMatchType] = useState('');
  const [matchOvers, setMatchOvers] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [recentBookings, setRecentBookings] = useState<UserBooking[]>([]);
  const [bookingHistory, setBookingHistory] = useState<UserBooking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState('');
  const clearFieldError = (key: string) => setFieldErrors(prev => { const { [key]: _, ...rest } = prev; return rest; });



  // Refs for focusing/scrolling to fields with errors
  const facilityRef = React.useRef<HTMLDivElement>(null);
  const dateRef = React.useRef<HTMLInputElement>(null);
  const timeSlotsRef = React.useRef<HTMLDivElement>(null);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const emailRef = React.useRef<HTMLInputElement>(null);
  const phoneRef = React.useRef<HTMLInputElement>(null);

  // Fetch facilities based on booking type (from backend)
  const fetchFacilities = async (type: 'ground' | 'net') => {
    try {
      setLoading(true);
      if (type === 'ground') {
        const res = await axios.get('http://localhost:8080/api/grounds');
        const mapped: Facility[] = (res.data || []).map((g: any) => ({
          id: String(g.id),
          name: g.name,
          type: g.description || 'Ground',
          capacity: g.capacity,
          pricePerHour: g.pricePerHour,
          facilities: Array.isArray(g.facilities) ? g.facilities : g.facilities ? JSON.parse(g.facilities) : [],
          location: g.location,
          imageUrl: g.imageUrl,
          isAvailable: g.isActive,
          hasFloodlights: g.hasFloodlights,
          hasPavilion: g.hasPavilion,
          hasDressingRooms: g.hasDressingRooms,
          hasWashrooms: g.hasWashrooms,
          hasParking: g.hasParkingTwoWheeler || g.hasParkingFourWheeler,
          description: g.description,
          // Additional ground features
          hasShowers: g.hasShowers,
          hasDrinkingWater: g.hasDrinkingWater,
          hasFirstAid: g.hasFirstAid,
          hasRefreshments: g.hasRefreshments,
          hasPracticeNets: g.hasPracticeNets,
          hasLiveStreaming: g.hasLiveStreaming,
          seatingCapacity: g.seatingCapacity,
          scoreboardType: g.scoreboardType
        }));
        setFacilities(mapped);
      } else {
        const res = await axios.get('http://localhost:8080/api/nets/all');
        const mapped: Facility[] = (res.data || []).map((n: any) => ({
          id: String(n.id),
          name: n.name,
          type: 'Net',
          capacity: n.capacity,
          pricePerHour: n.pricePerHour,
          features: Array.isArray(n.features) ? n.features : n.features ? JSON.parse(n.features) : [],
          isAvailable: n.isAvailable,
          imageUrl: n.imageUrl,
          description: n.description,
          locationType: n.locationType,
          surfaceType: n.surfaceType,
          hasBowlingMachine: n.hasBowlingMachine,
          hasProtectiveNetting: n.hasProtectiveNetting,
          hasWashrooms: n.hasWashrooms,
          hasParking: n.hasParking,
          netLength: n.netLength,
          netWidth: n.netWidth,
          netHeight: n.netHeight
        }));
        setFacilities(mapped);
      }
    } catch (error) {
      console.error('Error fetching facilities:', error);
      setError('Failed to load facilities');
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  const timeSlots = [
    '6:00 AM - 7:00 AM',
    '7:00 AM - 8:00 AM',
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM'
  ];

  const allTimeSlots = [
    '6:00 AM - 7:00 AM',
    '7:00 AM - 8:00 AM',
    '8:00 AM - 9:00 AM',
    '9:00 AM - 10:00 AM',
    '10:00 AM - 11:00 AM',
    '11:00 AM - 12:00 PM',
    '12:00 PM - 1:00 PM',
    '1:00 PM - 2:00 PM',
    '2:00 PM - 3:00 PM',
    '3:00 PM - 4:00 PM',
    '4:00 PM - 5:00 PM',
    '5:00 PM - 6:00 PM',
    '6:00 PM - 7:00 PM',
    '7:00 PM - 8:00 PM',
    '8:00 PM - 9:00 PM'
  ];

  useEffect(() => {
    fetchFacilities(bookingType);
  }, [bookingType]);

  // Reset selections when booking type changes
  useEffect(() => {
    setSelectedFacility(null);
    setSelectedDate('');
    setSelectedTimeSlot('');
    setAvailableSlots([]);
  }, [bookingType]);

  useEffect(() => {
    if (selectedDate && selectedFacility) {
      fetchAvailableSlots();
    }
  }, [selectedDate, selectedFacility]);

  // Fetch user bookings when component mounts or when switching to recent/history tabs
  useEffect(() => {
    if (token && user?.email && (activeTab === 'recent' || activeTab === 'history')) {
      fetchUserBookings();
    }
  }, [token, user?.email, activeTab]);

  const fetchUserBookings = async () => {
    if (!token || !user?.email) return;

    try {
      setBookingsLoading(true);
      setBookingsError('');

      const [recent, history] = await Promise.all([
        BookingService.getActiveBookings(token, user.email),
        BookingService.getBookingHistory(token, user.email)
      ]);

      setRecentBookings(recent);
      setBookingHistory(history);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      setBookingsError('Failed to load booking data');
    } finally {
      setBookingsLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDate || !selectedFacility) return;

    try {
      const response = await axios.get('http://localhost:8080/api/bookings/available-slots', {
        params: {
          date: selectedDate,
          facilityId: selectedFacility?.id
        }
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    }
  };

  const handleBooking = async () => {
    const newErrors: Record<string, string> = {};

    if (!selectedFacility) newErrors.selectedFacility = 'Please select a facility';
    if (!selectedDate) newErrors.selectedDate = 'Please select a date';
    if (!selectedTimeSlot) newErrors.selectedTimeSlot = 'Please select a time slot';
    if (!customerName.trim()) newErrors.customerName = 'Full name is required';

    const emailTrimmed = customerEmail.trim();
    const emailValid = /^\S+@\S+\.\S+$/.test(emailTrimmed);
    if (!emailTrimmed || !emailValid) newErrors.customerEmail = 'Enter a valid email address';

    const phoneTrimmed = customerPhone.trim();
    const phoneValid = /^[0-9+\-\s()]{7,15}$/.test(phoneTrimmed);
    if (!phoneTrimmed || !phoneValid) newErrors.customerPhone = 'Enter a valid phone number';

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setError('');

      // Focus and scroll to the first invalid field
      const order = ['selectedFacility','selectedDate','selectedTimeSlot','customerName','customerEmail','customerPhone'] as const;
      const firstKey = order.find((k) => newErrors[k]);
      if (firstKey) {
        const behavior: ScrollBehavior = 'smooth';
        switch (firstKey) {
          case 'selectedFacility':
            facilityRef.current?.scrollIntoView({ behavior, block: 'center' });
            break;
          case 'selectedDate':
            dateRef.current?.scrollIntoView({ behavior, block: 'center' });
            dateRef.current?.focus();
            break;
          case 'selectedTimeSlot':
            timeSlotsRef.current?.scrollIntoView({ behavior, block: 'center' });
            break;
          case 'customerName':
            nameRef.current?.scrollIntoView({ behavior, block: 'center' });
            nameRef.current?.focus();
            break;
          case 'customerEmail':
            emailRef.current?.scrollIntoView({ behavior, block: 'center' });
            emailRef.current?.focus();
            break;
          case 'customerPhone':
            phoneRef.current?.scrollIntoView({ behavior, block: 'center' });
            phoneRef.current?.focus();
            break;
        }
      }
      return;
    }

    if (selectedFacility?.isAvailable === false) {
      setError('Selected facility is currently unavailable for booking');
      return;
    }

    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      const parts = selectedTimeSlot.replace(/\s/g, '').split('-');
      const startLabel = parts[0];
      const endLabel = parts[1];
      // Convert to 24h HH:MM if AM/PM present, else passthrough
      const to24hIfNeeded = (label: string) => {
        const hasMeridiem = /AM|PM/i.test(label);
        if (!hasMeridiem) return label; // already HH:MM
        const time = label.replace(/AM|PM/i, '');
        const meridiem = /PM/i.test(label) ? 'PM' : 'AM';
        let [h, m] = time.split(':').map(Number);
        if (meridiem === 'PM' && h !== 12) h += 12;
        if (meridiem === 'AM' && h === 12) h = 0;
        return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
      };
      const startTime = to24hIfNeeded(startLabel);
      const endTime = to24hIfNeeded(endLabel);

      const facility = selectedFacility!;
      const bookingData = {
        bookingType,
        groundId: facility.id,
        groundName: facility.name,
        groundDescription: facility.description || facility.type,
        bookingDate: selectedDate,
        startTime,
        endTime,
        matchType: matchType || undefined,
        matchOvers: matchOvers ? Number(matchOvers) : undefined,
        price: facility.pricePerHour,
        customerName,
        customerEmail,
        customerPhone
      };

      const response = await axios.post('http://localhost:8080/api/bookings', bookingData);
      
      if (response.data) {
        // Navigate to payment page with booking details
        navigate('/payment', {
          state: {
            amount: facility.pricePerHour,
            bookingId: response.data.id || facility.id,
            type: 'booking'
          }
        });
      }
    } catch (error) {
      setError('Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Booking Management</h1>
          <p className="text-lg text-gray-600">Create new bookings and manage your booking history</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('create')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'create'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Calendar className="h-5 w-5 inline mr-2" />
                Create Booking
              </button>
              <button
                onClick={() => setActiveTab('recent')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'recent'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CheckCircle className="h-5 w-5 inline mr-2" />
                Recent Bookings
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <History className="h-5 w-5 inline mr-2" />
                Booking History
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'create' && (
          <div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Type Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Booking Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setBookingType('ground')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    bookingType === 'ground'
                      ? 'border-green-600 bg-green-50 text-green-900'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <MapPin className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-semibold">Ground Booking</div>
                  <div className="text-sm text-gray-600">Full cricket grounds</div>
                </button>
                
                <button
                  onClick={() => setBookingType('net')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    bookingType === 'net'
                      ? 'border-green-600 bg-green-50 text-green-900'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Users className="h-6 w-6 mx-auto mb-2" />
                  <div className="font-semibold">Net Practice</div>
                  <div className="text-sm text-gray-600">Practice nets</div>
                </button>
              </div>
            </div>

            {/* Facility Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Choose {bookingType === 'ground' ? 'Ground' : 'Net'}
              </h2>
              <div className="grid grid-cols-1 gap-4" ref={facilityRef}>
                {fieldErrors.selectedFacility && (
                  <p className="text-red-600 text-sm mb-2">{fieldErrors.selectedFacility}</p>
                )}
                {facilities.map((facility) => (
                  <div
                    key={facility.id}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      facility.isAvailable === false 
                        ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-60'
                        : selectedFacility?.id === facility.id
                        ? 'border-green-600 bg-green-50 cursor-pointer'
                        : 'border-gray-200 hover:border-green-300 cursor-pointer'
                    }`}
                    onClick={() => { if (facility.isAvailable !== false) { setSelectedFacility(facility); clearFieldError('selectedFacility'); } }}
                  >
                    <div className="flex gap-6">
                      {/* Image */}
                      {facility.imageUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={facility.imageUrl}
                            alt={facility.name}
                            className="w-48 h-32 object-cover rounded-lg border shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      
                      {/* Content - Specifications and Features */}
                      <div className="flex-1">
                        <div className="mb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 text-lg">{facility.name}</h3>
                            {facility.isAvailable === false && (
                              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                                Unavailable
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {facility.description || facility.type}
                          </p>
                          {bookingType === 'ground' && facility.location && (
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.location)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-xs text-green-700 hover:text-green-800 underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              📍 View on Google Maps
                            </a>
                          )}
                        </div>
                      </div>
                      
                      {/* Price and Capacity */}
                      <div className="flex-shrink-0 text-right">
                        <div className={`text-xl font-bold mb-1 ${
                          facility.isAvailable === false ? 'text-gray-500' : 'text-green-600'
                        }`}>
                          ₹{facility.pricePerHour}
                        </div>
                        <div className="text-sm text-gray-500 mb-1">per hour</div>
                        {facility.capacity && (
                          <div className="text-sm text-gray-600">
                            👥 {facility.capacity} players
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Specifications */}
                    {bookingType === 'ground' && (
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
                        {facility.location && (
                          <div>📍 {facility.location}</div>
                        )}
                        {facility.capacity && (
                          <div>👥 Capacity: {facility.capacity} players</div>
                        )}
                        <div>🏏 Cricket Ground</div>
                        <div>💰 ₹{facility.pricePerHour}/hour</div>
                      </div>
                    )}
                    {bookingType === 'net' && (
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-600">
                        {facility.locationType && (
                          <div>📍 {facility.locationType}</div>
                        )}
                        {facility.surfaceType && (
                          <div>🏟️ {facility.surfaceType}</div>
                        )}
                        {facility.netLength && facility.netWidth && (
                          <div>📏 {facility.netLength}m x {facility.netWidth}m</div>
                        )}
                        {facility.netHeight && (
                          <div>📐 Height: {facility.netHeight}m</div>
                        )}
                      </div>
                    )}
                    
                    {/* Features */}
                    <div className="space-y-2">
                      {/* Facility-specific features */}
                      <div className="flex flex-wrap gap-1">
                        {bookingType === 'ground' ? (
                          <>
                            {facility.hasFloodlights && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">💡 Floodlights</span>
                            )}
                            {facility.hasPavilion && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🏛️ Pavilion</span>
                            )}
                            {facility.hasDressingRooms && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">👕 Dressing Rooms</span>
                            )}
                            {facility.hasWashrooms && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🚻 Washrooms</span>
                            )}
                            {facility.hasShowers && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🚿 Showers</span>
                            )}
                            {facility.hasDrinkingWater && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">💧 Drinking Water</span>
                            )}
                            {facility.hasFirstAid && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">⚕️ First Aid</span>
                            )}
                            {facility.hasParking && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🅿️ Parking</span>
                            )}
                            {facility.hasRefreshments && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🍽️ Refreshments</span>
                            )}
                            {facility.hasPracticeNets && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🎯 Practice Nets</span>
                            )}
                            {facility.hasLiveStreaming && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">📹 Live Streaming</span>
                            )}
                            {facility.seatingCapacity && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🪑 {facility.seatingCapacity} Seats</span>
                            )}
                            {facility.scoreboardType && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">📊 {facility.scoreboardType} Scoreboard</span>
                            )}
                          </>
                        ) : (
                          <>
                            {facility.hasBowlingMachine && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🎯 Bowling Machine</span>
                            )}
                            {facility.hasProtectiveNetting && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🛡️ Safety Nets</span>
                            )}
                            {facility.hasWashrooms && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🚻 Washrooms</span>
                            )}
                            {facility.hasParking && (
                              <span className="px-2 py-1 bg-blue-50 text-blue-800 text-xs rounded-full">🅿️ Parking</span>
                            )}
                          </>
                        )}
                      </div>
                      
                      {/* Additional features from facilities/features array */}
                      <div className="flex flex-wrap gap-1">
                        {(() => {
                          const featuresArray = bookingType === 'ground' ? facility.facilities : facility.features;
                          return Array.isArray(featuresArray) ? featuresArray.map((feature: string, index: number) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-green-50 text-green-800 border border-green-200 text-xs rounded-full"
                            >
                              {feature}
                            </span>
                          )) : null;
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Select Date
              </h2>
              <input
                ref={dateRef}
                type="date"
                value={selectedDate}
                onChange={(e) => { setSelectedDate(e.target.value); clearFieldError('selectedDate'); }}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full p-3 border rounded-md focus:ring-green-500 focus:border-green-500 ${fieldErrors.selectedDate ? 'border-red-500' : 'border-gray-300'}`}
              />
              {fieldErrors.selectedDate && (
                <p className="text-red-600 text-sm mt-1">{fieldErrors.selectedDate}</p>
              )}
            </div>

            {/* Time Slot Selection */}
            {selectedDate && selectedFacility && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-green-600" />
                  Select Time Slot
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3" ref={timeSlotsRef}>
                  {availableSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => { setSelectedTimeSlot(slot); clearFieldError('selectedTimeSlot'); }}
                      className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                        selectedTimeSlot === slot
                          ? 'border-green-600 bg-green-600 text-white'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                  {fieldErrors.selectedTimeSlot && (
                    <p className="text-red-600 text-sm mt-3">{fieldErrors.selectedTimeSlot}</p>
                  )}
                </div>
              </div>
            )}

            {/* Match Details and Customer Information */}
            {(selectedDate && selectedTimeSlot) && (
              <div className="bg-white rounded-lg shadow p-6">
                {bookingType === 'ground' && (
                  <>
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Match Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Match Type</label>
                        <select
                          value={matchType}
                          onChange={(e) => setMatchType(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                        >
                          <option value="">Select match type</option>
                          <option value="Practice">Practice</option>
                          <option value="Tournament">Tournament</option>
                          <option value="One-day">One-day</option>
                          <option value="Multi-day">Multi-day</option>
                          <option value="T20">T20</option>
                          <option value="T10">T10</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Match Overs (optional)</label>
                        <input
                          type="number"
                          value={matchOvers}
                          onChange={(e) => setMatchOvers(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                          placeholder="e.g., 20, 50"
                          min={1}
                        />
                      </div>
                    </div>
                  </>
                )}
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      ref={nameRef}
                      type="text"
                      value={customerName}
                      onChange={(e) => { setCustomerName(e.target.value); clearFieldError('customerName'); }}
                      className={`w-full p-3 border rounded-md focus:ring-green-500 focus:border-green-500 ${fieldErrors.customerName ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your full name"
                    />
                    {fieldErrors.customerName && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.customerName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      ref={emailRef}
                      type="email"
                      value={customerEmail}
                      onChange={(e) => { setCustomerEmail(e.target.value); clearFieldError('customerEmail'); }}
                      className={`w-full p-3 border rounded-md focus:ring-green-500 focus:border-green-500 ${fieldErrors.customerEmail ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your email"
                    />
                    {fieldErrors.customerEmail && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.customerEmail}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      ref={phoneRef}
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => { setCustomerPhone(e.target.value); clearFieldError('customerPhone'); }}
                      className={`w-full p-3 border rounded-md focus:ring-green-500 focus:border-green-500 ${fieldErrors.customerPhone ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your phone number"
                    />
                    {fieldErrors.customerPhone && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.customerPhone}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              {selectedFacility !== null ?
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Facility:</span>
                    <span className="font-medium">{selectedFacility.name}</span>
                  </div>
                  
                  {selectedDate && (
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(selectedDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {selectedTimeSlot && (
                    <div className="flex justify-between items-center pb-2 border-b">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{selectedTimeSlot}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Price per hour:</span>
                    <span className="font-medium">₹{selectedFacility.pricePerHour}</span>
                  </div>
                  
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">
                      {(() => {
                        if (!selectedTimeSlot) return '';
                        const parts = selectedTimeSlot.split(' - ');
                        if (parts.length !== 2) return '';
                        const to24h = (time: string) => {
                          const [hourMin, meridiem] = time.split(' ');
                          let [hour, min] = hourMin.split(':').map(Number);
                          if (meridiem === 'PM' && hour !== 12) hour += 12;
                          if (meridiem === 'AM' && hour === 12) hour = 0;
                          return hour * 60 + min;
                        };
                        const start = to24h(parts[0]);
                        const end = to24h(parts[1]);
                        const diffMins = end - start;
                        const hours = Math.floor(diffMins / 60);
                        const mins = diffMins % 60;
                        return hours > 0 ? (mins > 0 ? `${hours}h ${mins}m` : `${hours}h`) : `${mins}m`;
                      })()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total Amount:</span>
                    <span className="text-green-600">
                      ₹{selectedTimeSlot ?
                        (selectedFacility.pricePerHour * (() => {
                          if (!selectedTimeSlot) return 1;
                          const parts = selectedTimeSlot.split(' - ');
                          if (parts.length !== 2) return 1;
                          const to24h = (time: string) => {
                            const [hourMin, meridiem] = time.split(' ');
                            let [hour, min] = hourMin.split(':').map(Number);
                            if (meridiem === 'PM' && hour !== 12) hour += 12;
                            if (meridiem === 'AM' && hour === 12) hour = 0;
                            return hour * 60 + min;
                          };
                          const start = to24h(parts[0]);
                          const end = to24h(parts[1]);
                          const diffMins = end - start;
                          return diffMins / 60;
                        })()
                      ) : 0}
                    </span>
                  </div>
                  
              {selectedDate && selectedTimeSlot && (
                <button
                  onClick={handleBooking}
                  className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Proceed to Payment
                </button>
              )}
              {selectedDate && selectedTimeSlot && customerName && (
                <div className="mt-4 p-4 bg-green-50 rounded-md text-green-900 font-semibold">
                  Booking for: {customerName}
                </div>
              )}
            </div>
              :
                <p className="text-gray-500 text-center">Select a facility to see booking summary</p>
              }
            </div>
          </div>
          </div>
        </div>
       )}

        {/* Recent Bookings Tab */}
        {activeTab === 'recent' && (
          <div className="space-y-6">
            {bookingsError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {bookingsError}
              </div>
            )}

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                  Recent Bookings
                </h2>
              </div>
              <div className="p-6">
                {bookingsLoading ? (
                  <div className="text-center py-4 text-gray-500">Loading recent bookings...</div>
                ) : recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {booking.bookingType === 'net' ? 'Net Practice' : 'Ground Booking'}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'CONFIRMED'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.groundName}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4 mr-1" />
                          {booking.bookingDate} • {booking.startTime} - {booking.endTime}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            {booking.matchType && `Type: ${booking.matchType}`}
                          </div>
                          <div className="font-semibold text-green-600">
                            ₹{booking.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent bookings found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Booking History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-6">
            {bookingsError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {bookingsError}
              </div>
            )}

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <History className="h-5 w-5 mr-2 text-blue-600" />
                  Booking History
                </h2>
              </div>
              <div className="p-6">
                {bookingsLoading ? (
                  <div className="text-center py-4 text-gray-500">Loading booking history...</div>
                ) : bookingHistory.length > 0 ? (
                  <div className="space-y-4">
                    {bookingHistory.map((booking) => (
                      <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {booking.bookingType === 'net' ? 'Net Practice' : 'Ground Booking'}
                          </h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'COMPLETED'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : booking.status === 'FAILED'
                              ? 'bg-orange-100 text-orange-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {booking.groundName}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="h-4 w-4 mr-1" />
                          {booking.bookingDate} • {booking.startTime} - {booking.endTime}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            {booking.matchType && `Type: ${booking.matchType}`}
                          </div>
                          <div className="font-semibold text-green-600">
                            ₹{booking.price}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <History className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No booking history found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Bookings;
