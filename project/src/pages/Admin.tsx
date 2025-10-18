import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Users, Calendar, CreditCard, Settings, BarChart3, Plus, Edit, Trash2, UserCheck, Search, MapPin, Star, Check, Link, Upload, X, Briefcase } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AdminCoaches from './AdminCoaches';
import AdminPrograms from './AdminPrograms';
import AdminPaymentManagement from './AdminPaymentManagement';
import AdminStarPlayers from './AdminStarPlayers';
import AdminFacilities from './AdminFacilities';
import AdminCareerEnquiry from './AdminCareerEnquiry';
import ContactInfoEdit from '../components/ContactInfoEdit';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import PaymentModal from '../components/PaymentModal';
import { PaymentService } from '../services/paymentService';
import EnhancedNetCreateModal from '../components/EnhancedNetCreateModal';

import NetCard from '../components/NetCard';
import GroundCard from '../components/GroundCard';

import SpecificationsSection from '../components/SpecificationsSection';
import ImageUpload from '../components/ImageUpload';
import axios from 'axios';
import { HomepageApiService } from '../services/homepageApiService';
import { DashboardService, ActiveBooking, CoachingSession } from '../services/dashboardService';

// Import absolutize function to convert relative URLs to absolute URLs
const API_ORIGIN = new URL('http://localhost:8080/api/admin/homepage').origin;
const absolutize = (u?: string) => {
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return u.startsWith('/') ? `${API_ORIGIN}${u}` : `${API_ORIGIN}/${u}`;
};



function HeroImageSettings({ token }: { token: string }) {
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  // Fetch current hero image URL on component mount
  useEffect(() => {
    const fetchCurrentUrl = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch('http://localhost:8080/api/admin/homepage/hero-image', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const currentUrl = await response.text();
          setUrl(currentUrl || '');
        }
      } catch (error) {
        console.error('Failed to fetch current hero image URL:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUrl();
  }, [token]);

  const save = async () => {
    if (!token) return setMessage('Not authenticated');
    try {
      setSaving(true);
      setMessage(null);
      await HomepageApiService.adminSetHeroImageUrl(token, url.trim());
      setMessage('Hero image URL saved');
    } catch (e: any) {
      setMessage(e?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!token) return setMessage('Not authenticated');
    try {
      setSaving(true);
      setMessage(null);
      await HomepageApiService.adminDeleteHeroImage(token);
      setUrl('');
      setMessage('Hero image deleted');
    } catch (e: any) {
      setMessage(e?.message || 'Failed to delete');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mb-8">
      <h4 className="text-md font-semibold text-gray-800 mb-2">Homepage Hero Image</h4>
      <p className="text-sm text-gray-600 mb-3">Set the image URL to show on the Homepage hero section.</p>

      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
          <span className="text-sm text-gray-600">Loading current image URL...</span>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/your-image.jpg"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={remove}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}

      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}

      {url && !loading && (
        <div className="mt-3 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600 mb-2">Current image preview:</p>
          <img
            src={url}
            alt="Current hero image"
            className="max-w-full h-32 object-cover rounded-md border"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  const { user, token, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [activeTab, setActiveTab] = useState(() => {
    const pathParts = location.pathname.split('/');
    const module = pathParts[2] || 'overview';
    return module === 'admin' ? 'overview' : module;
  });
  const [currentAction, setCurrentAction] = useState(() => {
    const pathParts = location.pathname.split('/');
    return pathParts[3] || 'list';
  });
  const [currentId, setCurrentId] = useState(() => {
    const pathParts = location.pathname.split('/');
    return pathParts[4] || null;
  });
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState('');

  const [users, setUsers] = useState<any[]>([]);
  const [grounds, setGrounds] = useState<any[]>([]);
  const [nets, setNets] = useState<any[]>([]);
  const [newGround, setNewGround] = useState({
    name: '',
    description: '',
    location: '',
    mapsUrl: '',
    capacity: '',
    pricePerHour: '',
    imageUrl: '',
    isActive: true,
    details: {
      basic: {
        groundType: 'Cricket' as 'Cricket' | 'Football' | 'Hockey' | 'Multi-purpose',
        groundSize: '',
        boundaryDimensions: '',
        pitchType: [] as string[],
        numberOfPitches: ''
      },
      cricket: {
        turfType: '' as '' | 'Natural Grass' | 'Artificial Turf' | 'Hybrid',
        pitchQuality: '' as '' | 'Hard' | 'Medium' | 'Soft',
        grassType: '' as '' | 'Bermuda' | 'Kentucky Bluegrass' | 'Perennial Ryegrass' | 'Tall Fescue',
        drainageSystem: false,
        lightingQuality: '' as '' | 'Standard' | 'High Quality' | 'Broadcast Quality',
        seatingTypes: [] as string[],
        mediaFacilities: [] as string[],
        practiceFacilities: [] as string[],
        safetyFeatures: [] as string[]
      },
      facilities: {
        floodlights: false,
        pavilion: false,
        dressingRooms: false,
        washrooms: false,
        showers: false,
        drinkingWater: false,
        firstAid: false,
        parkingTwoWheeler: false,
        parkingFourWheeler: false,
        refreshments: false,
        seatingCapacity: '',
        practiceNets: false,
        scoreboard: '' as '' | 'Manual' | 'Digital',
        liveStreaming: false
      },
      specs: {
        groundDimensions: '',
        pitchLength: '22 yards',
        oversPerSlot: '',
        ballType: '' as '' | 'Tennis' | 'Leather' | 'Both',
        safetyNets: false,
        rainCovers: false,
        groundStaffAvailable: false
      }
    }
  });
  const [newNet, setNewNet] = useState({
    name: '',
    netNumber: '',
    description: '',
    capacity: '',
    pricePerHour: '',
    features: '', // comma-separated
    groundId: '',
    netType: 'INDOOR' as 'INDOOR' | 'OUTDOOR',
    surfaceType: 'TURF' as 'TURF' | 'MATTING' | 'CEMENT' | 'GRASS',
    lighting: false,
    bowlingMachine: false,
    videoAnalysis: false,
    coachingAvailable: false,
    equipmentRental: false,
    ballType: 'TENNIS' as 'TENNIS' | 'LEATHER' | 'BOTH',
    netLength: '',
    netWidth: '',
    imageUrl: ''
  });

  // State for Users module (edit/delete)
  const [showUserEditModal, setShowUserEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showUserDeleteDialog, setShowUserDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // State for Grounds module (edit/delete)
  const [showGroundEditModal, setShowGroundEditModal] = useState(false);
  const [editingGround, setEditingGround] = useState<any>(null);
  const [showGroundDeleteDialog, setShowGroundDeleteDialog] = useState(false);
  const [groundToDelete, setGroundToDelete] = useState<number | null>(null);

  // Ground image upload state
  const [groundUploading, setGroundUploading] = useState(false);
  const [groundUploadError, setGroundUploadError] = useState('');

  // State for chat box in ground specs
  const [chatBoxVisible, setChatBoxVisible] = useState(false);
  const [chatBoxContent, setChatBoxContent] = useState('');
  const [chatBoxPosition, setChatBoxPosition] = useState({ x: 0, y: 0 });

  // State for Nets module (edit/delete)
  const [showNetEditModal, setShowNetEditModal] = useState(false);
  const [editingNet, setEditingNet] = useState<any>(null);
  const [showNetDeleteDialog, setShowNetDeleteDialog] = useState(false);
  const [netToDelete, setNetToDelete] = useState<number | null>(null);

  // Net image upload state
  const [netUploading, setNetUploading] = useState(false);
  const [netUploadError, setNetUploadError] = useState('');
  const [netUrlInput, setNetUrlInput] = useState('');
  const [newNetImageUrl, setNewNetImageUrl] = useState('');

  // Create Net image upload state
  const [createNetUploading, setCreateNetUploading] = useState(false);
  const [createNetUploadError, setCreateNetUploadError] = useState('');

  // Enhanced Net Create Modal state
  const [showEnhancedNetCreateModal, setShowEnhancedNetCreateModal] = useState(false);
  const [selectedGroundForNet, setSelectedGroundForNet] = useState<number | null>(null);

  // Helper function to get axios config with headers
  const getAuthConfig = () => ({
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  // Helper function to update ground details
  const updateDetails = (section: string, field: string, value: any) => {
    setEditingGround({
      ...editingGround,
      details: {
        ...editingGround.details,
        [section]: {
          ...editingGround.details[section],
          [field]: value
        }
      }
    });
  };

  // Helper function to show chat box with definition
  const showChatBox = (definition: string, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setChatBoxPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setChatBoxContent(definition);
    setChatBoxVisible(true);
  };

  // Helper function to hide chat box
  const hideChatBox = () => {
    setChatBoxVisible(false);
  };

  // Helper functions to handle actions based on URL
  const handleCreateAction = (module: string) => {
    switch (module) {
      case 'grounds':
        setEditingGround({
          ...newGround,
          id: '',
          name: '',
          description: '',
          location: '',
          mapsUrl: '',
          capacity: '',
          pricePerHour: '',
          imageUrl: '',
          isActive: true,
          details: {
            basic: {
              groundType: 'Cricket' as 'Cricket' | 'Football' | 'Hockey' | 'Multi-purpose',
              groundSize: '',
              boundaryDimensions: '',
              pitchType: ['Turf'],
              numberOfPitches: '1'
            },
            cricket: {
              turfType: 'Natural Grass' as 'Natural Grass' | 'Artificial Turf' | 'Hybrid',
              pitchQuality: 'Medium' as 'Hard' | 'Medium' | 'Soft',
              grassType: 'Bermuda' as 'Bermuda' | 'Kentucky Bluegrass' | 'Perennial Ryegrass' | 'Tall Fescue',
              drainageSystem: true,
              lightingQuality: 'Standard' as 'Standard' | 'High Quality' | 'Broadcast Quality',
              seatingTypes: ['Basic seating'],
              mediaFacilities: [],
              practiceFacilities: ['Practice nets'],
              safetyFeatures: ['Boundary fencing']
            },
            facilities: {
              floodlights: true,
              pavilion: true,
              dressingRooms: true,
              washrooms: true,
              showers: true,
              drinkingWater: true,
              firstAid: true,
              parkingTwoWheeler: true,
              parkingFourWheeler: true,
              refreshments: true,
              seatingCapacity: '200',
              practiceNets: true,
              scoreboard: 'Digital' as 'Manual' | 'Digital',
              liveStreaming: false
            },
            specs: {
              groundDimensions: '',
              pitchLength: '22 yards',
              oversPerSlot: '20',
              ballType: 'Tennis' as 'Tennis' | 'Leather' | 'Both',
              safetyNets: true,
              rainCovers: false,
              groundStaffAvailable: true
            }
          }
        });
        setShowGroundEditModal(true);
        break;
      case 'nets':
        setShowEnhancedNetCreateModal(true);
        break;
      case 'coaches':
        // Coaches create action is handled by AdminCoaches component
        break;
      case 'programs':
        // Programs create action is handled by AdminPrograms component
        break;
      case 'starPlayers':
        // Star Players create action is handled by AdminStarPlayers component
        break;
      case 'facilities':
        // Facilities create action is handled by AdminFacilities component
        break;
      case 'users':
        // Handle user creation if needed
        break;
      default:
        break;
    }
  };

  const handleEditAction = async (module: string, id: string) => {
    const numericId = parseInt(id);
    switch (module) {
      case 'grounds':
        const ground = grounds.find(g => g.id === numericId);
        if (ground) {
          handleEditGround(ground);
        }
        break;
      case 'nets':
        const net = nets.find(n => n.id === numericId);
        if (net) {
          handleEditNet(net);
        }
        break;
      case 'coaches':
        // Coaches edit action is handled by AdminCoaches component
        break;
      case 'programs':
        // Programs edit action is handled by AdminPrograms component
        break;
      case 'starPlayers':
        // Star Players edit action is handled by AdminStarPlayers component
        break;
      case 'facilities':
        // Facilities edit action is handled by AdminFacilities component
        break;
      case 'users':
        const user = users.find(u => u.id === numericId);
        if (user) {
          handleEditUser(user);
        }
        break;
      default:
        break;
    }
  };

  const handleDeleteAction = (module: string, id: string) => {
    const numericId = parseInt(id);
    switch (module) {
      case 'grounds':
        handleDeleteGround(numericId);
        break;
      case 'nets':
        handleDeleteNet(numericId);
        break;
      case 'coaches':
        // Coaches delete action is handled by AdminCoaches component
        break;
      case 'programs':
        // Programs delete action is handled by AdminPrograms component
        break;
      case 'starPlayers':
        // Star Players delete action is handled by AdminStarPlayers component
        break;
      case 'facilities':
        // Facilities delete action is handled by AdminFacilities component
        break;
      case 'users':
        handleDeleteUser(numericId);
        break;
      default:
        break;
    }
  };

  // Helper function to navigate to specific action
  const navigateToAction = (module: string, action: string, id?: number) => {
    if (action === 'list') {
      navigate(`/admin/${module}`);
    } else if (id) {
      navigate(`/admin/${module}/${action}/${id}`);
    } else {
      navigate(`/admin/${module}/${action}`);
    }
  };

  // Remove the local SpecificationsSection component to avoid conflict with imported one

  // Handle URL changes
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const module = pathParts[2] || 'overview';
    const action = pathParts[3] || 'list';
    const id = pathParts[4] || null;
    
    const newTab = module === 'admin' ? 'overview' : module;
    setActiveTab(newTab);
    setCurrentAction(action);
    setCurrentId(id);
    
    // Handle automatic modal opening based on action
    if (action === 'create') {
      handleCreateAction(module);
    } else if (action === 'edit' && id) {
      handleEditAction(module, id);
    } else if (action === 'delete' && id) {
      handleDeleteAction(module, id);
    }
  }, [location.pathname]);

  // Fetch dynamic dashboard data
  const fetchDashboardData = async () => {
    if (!token) return;
    
    setDashboardLoading(true);
    try {
      const [activeBookingsList, coachingSessionsList, dashboardStats] = await Promise.all([
        DashboardService.getActiveBookings(token),
        DashboardService.getCoachingSessions(token),
        DashboardService.getDashboardStats(token)
      ]);
      
      setActiveBookings(activeBookingsList);
      setCoachingSessions(coachingSessionsList);
      
      // Update stats with real data
      setStats([
        { label: 'Total Users', value: dashboardStats.totalUsers.toString(), change: '+12%', changeType: 'increase' as 'increase' | 'decrease' },
        { label: 'Active Bookings', value: dashboardStats.activeBookings.toString(), change: '+5%', changeType: 'increase' as 'increase' | 'decrease' },
        { label: 'Monthly Revenue', value: `₹${dashboardStats.monthlyRevenue.toLocaleString()}`, change: '+18%', changeType: 'increase' as 'increase' | 'decrease' },
        { label: 'Ground Utilization', value: `${dashboardStats.groundUtilization}%`, change: dashboardStats.groundUtilization > 70 ? '+3%' : '-3%', changeType: (dashboardStats.groundUtilization > 70 ? 'increase' : 'decrease') as 'increase' | 'decrease' }
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setDashboardLoading(false);
      setLastRefresh(new Date());
    }
  };

  // Fetch grounds, nets, bookings, and users on mount
  useEffect(() => {
    if (!token) return;
    fetchGrounds();
    fetchNets();
    fetchBookings(); // keep overview stats recent
    fetchUsers();
    // Delay dashboard data fetch to ensure other data is loaded first
    setTimeout(() => {
      fetchDashboardData();
    }, 500);
  }, [token]);

  // Manual refresh function
  const handleRefreshDashboard = () => {
    // Refresh all data including bookings
    fetchBookings();
    fetchDashboardData();
  };

  // Auto-refresh dashboard data every 5 minutes
  useEffect(() => {
    if (activeTab === 'overview' && token) {
      const interval = setInterval(() => {
        fetchDashboardData();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [activeTab, token]);

  // Update stats when data changes (moved below after state declarations)
  // (placeholder to preserve line numbers)

  const fetchGrounds = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/grounds/all', getAuthConfig());
      setGrounds(res.data);
    } catch (e) {
      console.error('Failed to load grounds', e);
    }
  };

  const fetchNets = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/nets', getAuthConfig());
      setNets(res.data);
    } catch (e) {
      console.error('Failed to load nets', e);
    }
  };

  const fetchBookings = async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/bookings/admin/all', getAuthConfig());
      setBookings(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setError('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: BarChart3 },
    { id: 'grounds', name: 'Grounds', icon: MapPin },
    { id: 'nets', name: 'Nets', icon: Users },
    { id: 'users', name: 'Users', icon: Users },
    { id: 'coaches', name: 'Coaches', icon: UserCheck },
    { id: 'programs', name: 'Programs', icon: Calendar },
    { id: 'starPlayers', name: 'Star Players', icon: Star },
    { id: 'facilities', name: 'Facilities', icon: Check },
    { id: 'careerEnquiry', name: 'Career Enquiry', icon: Briefcase },
    { id: 'contactInfo', name: 'Contact Info', icon: MapPin },
    { id: 'payments', name: 'Payments', icon: CreditCard },
    { id: 'settings', name: 'Settings', icon: Settings }
  ];

  // Dynamic stats state
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);
  const [coachingSessions, setCoachingSessions] = useState<CoachingSession[]>([]);
  const [bookingViewType, setBookingViewType] = useState<'nets' | 'grounds'>('nets');
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [stats, setStats] = useState<Array<{
    label: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
  }>>([
    { label: 'Total Users', value: '0', change: '+0%', changeType: 'increase' },
    { label: 'Active Bookings', value: '0', change: '+0%', changeType: 'increase' },
    { label: 'Monthly Revenue', value: '₹0', change: '+0%', changeType: 'increase' },
    { label: 'Ground Utilization', value: '0%', change: '+0%', changeType: 'decrease' }
  ]);

  // Handler functions for booking operations
  const handleEditBooking = (booking: any) => {
    // Format the booking data for editing
    const formattedBooking = {
      ...booking,
      bookingDate: booking.bookingDate,
      startTime: booking.startTime,
      endTime: booking.endTime,
      customerName: booking.customerName,
      facilityName: booking.facilityName,
      status: booking.status
    };
    setEditingBooking(formattedBooking);
    setShowEditModal(true);
  };

  const handleDeleteBooking = (bookingId: number) => {
    setBookingToDelete(bookingId);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!token || !bookingToDelete) return;
    
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/bookings/admin/${bookingToDelete}`, getAuthConfig());
      setBookings(bookings.filter(booking => booking.id !== bookingToDelete));
      setError('');
      setShowDeleteDialog(false);
      setBookingToDelete(null);
    } catch (error) {
      console.error('Error deleting booking:', error);
      setError('Failed to delete booking');
      setShowDeleteDialog(false);
      setBookingToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setBookingToDelete(null);
  };

  const handleSaveBooking = async () => {
    if (!token || !editingBooking) return;
    
    try {
      setLoading(true);
      const updateData = {
        bookingType: editingBooking.bookingType,
        facilityId: editingBooking.facilityId,
        facilityName: editingBooking.facilityName,
        bookingDate: editingBooking.bookingDate,
        startTime: editingBooking.startTime,
        endTime: editingBooking.endTime,
        price: editingBooking.price,
        customerName: editingBooking.customerName,
        customerEmail: editingBooking.customerEmail,
        customerPhone: editingBooking.customerPhone,
        userId: editingBooking.userId,
        status: editingBooking.status
      };

      const response = await axios.put(
        `http://localhost:8080/api/bookings/admin/${editingBooking.id}`,
        updateData,
        getAuthConfig()
      );

      // Update the booking in the local state
      setBookings(bookings.map(booking => 
        booking.id === editingBooking.id ? response.data : booking
      ));
      
      setShowEditModal(false);
      setEditingBooking(null);
      setError('');
    } catch (error) {
      console.error('Error updating booking:', error);
      setError('Failed to update booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setShowEditModal(false);
    setEditingBooking(null);
    setError('');
  };

  
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/users', getAuthConfig());
      // Backend wraps response in ApiResponse<T>
      setUsers(res.data?.data ?? []);
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setError('Session expired. Please log in again.');
        await logout();
        return;
      }
      console.error('Failed to load users', e);
      setError('Failed to load users');
    }
  };

  // --- Users: Handlers ---
  const handleEditUser = (u: any) => {
    setEditingUser({ ...u });
    setShowUserEditModal(true);
  };

  const handleCancelUserEdit = () => {
    setShowUserEditModal(false);
    setEditingUser(null);
    navigateToAction('users', 'list');
  };

  const handleSaveUser = async () => {
    if (!token || !editingUser) return;
    try {
      setLoading(true);
      const updateData = {
        name: editingUser.name,
        phone: editingUser.phone,
        age: editingUser.age,
        experienceLevel: editingUser.experienceLevel,
        status: editingUser.status,
        email: editingUser.email,
        role: editingUser.role,
      };
      
      const res = await axios.put(
        `http://localhost:8080/api/admin/users/edit/${editingUser.id}`,
        updateData,
        getAuthConfig()
      );
      
      // Handle both response formats (ApiResponse wrapper or direct data)
      const updatedUser = res.data?.data || res.data;
      
      // Update local state
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? { ...user, ...updatedUser } : user
      ));
      
      setShowUserEditModal(false);
      setEditingUser(null);
      setError('');
      navigateToAction('users', 'list');
      
      // Show success message
      setSuccessMessage('User updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setError('Session expired. Please log in again.');
        await logout();
        return;
      }
      
      // Handle validation errors
      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError('Failed to update user. Please check your input.');
      }
      
      console.error('Failed to update user', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUserToDelete(id);
    setShowUserDeleteDialog(true);
  };

  const handleCancelDeleteUser = () => {
    setShowUserDeleteDialog(false);
    setUserToDelete(null);
    navigateToAction('users', 'list');
  };

  const handleConfirmDeleteUser = async () => {
    if (!token || !userToDelete) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/admin/users/delete/${userToDelete}`, getAuthConfig());
      setUsers(prev => prev.filter(user => user.id !== userToDelete));
      setShowUserDeleteDialog(false);
      setUserToDelete(null);
      setError('');
      navigateToAction('users', 'list');
      
      // Show success message
      setSuccessMessage('User deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setError('Session expired. Please log in again.');
        await logout();
        return;
      }
      
      // Handle specific error cases
      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError('Failed to delete user. This user may have associated bookings.');
      }
      
      console.error('Failed to delete user', e);
      setShowUserDeleteDialog(false);
      setUserToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  // --- Grounds: Handlers ---
  const handleEditGround = (ground: any) => {
    // Parse facilities if it's a string
    let parsedFacilities = ground.facilities;
    if (typeof ground.facilities === 'string') {
      try {
        parsedFacilities = JSON.parse(ground.facilities);
      } catch (e) {
        parsedFacilities = {
          basic: { groundType: '', groundSize: '', boundaryDimensions: '', pitchType: [], numberOfPitches: '' },
          facilities: { floodlights: false, pavilion: false, dressingRooms: false, washrooms: false, showers: false, drinkingWater: false, firstAid: false, parkingTwoWheeler: false, parkingFourWheeler: false, refreshments: false, seatingCapacity: '', practiceNets: false, scoreboard: 'Manual', liveStreaming: false },
          specs: { groundDimensions: '', pitchLength: '22 yards', oversPerSlot: '', ballType: 'Tennis', safetyNets: false, rainCovers: false, groundStaffAvailable: false }
        };
      }
    }

    // Merge backend flat fields into details so UI shows correct state
    const mergedFacilities = {
      ...(parsedFacilities?.facilities || {}),
      floodlights: ground.hasFloodlights ?? parsedFacilities?.facilities?.floodlights ?? false,
      pavilion: ground.hasPavilion ?? parsedFacilities?.facilities?.pavilion ?? false,
      dressingRooms: ground.hasDressingRooms ?? parsedFacilities?.facilities?.dressingRooms ?? false,
      washrooms: ground.hasWashrooms ?? parsedFacilities?.facilities?.washrooms ?? false,
      showers: ground.hasShowers ?? parsedFacilities?.facilities?.showers ?? false,
      drinkingWater: ground.hasDrinkingWater ?? parsedFacilities?.facilities?.drinkingWater ?? true,
      firstAid: ground.hasFirstAid ?? parsedFacilities?.facilities?.firstAid ?? true,
      parkingTwoWheeler: ground.hasParkingTwoWheeler ?? parsedFacilities?.facilities?.parkingTwoWheeler ?? true,
      parkingFourWheeler: ground.hasParkingFourWheeler ?? parsedFacilities?.facilities?.parkingFourWheeler ?? true,
      refreshments: ground.hasRefreshments ?? parsedFacilities?.facilities?.refreshments ?? false,
      seatingCapacity: ground.seatingCapacity ?? parsedFacilities?.facilities?.seatingCapacity ?? '',
      practiceNets: ground.hasPracticeNets ?? parsedFacilities?.facilities?.practiceNets ?? false,
      scoreboard: ground.scoreboardType ?? parsedFacilities?.facilities?.scoreboard ?? 'Manual',
      liveStreaming: ground.hasLiveStreaming ?? parsedFacilities?.facilities?.liveStreaming ?? false,
    } as any;

    const mergedCricket = {
      ...(parsedFacilities?.cricket || {}),
      turfType: ground.turfType ?? parsedFacilities?.cricket?.turfType ?? 'Natural Grass',
      pitchQuality: ground.pitchQuality ?? parsedFacilities?.cricket?.pitchQuality ?? 'Medium',
      grassType: ground.grassType ?? parsedFacilities?.cricket?.grassType ?? 'Bermuda',
      drainageSystem: ground.drainageSystem ?? parsedFacilities?.cricket?.drainageSystem ?? false,
      lightingQuality: ground.lightingQuality ?? parsedFacilities?.cricket?.lightingQuality ?? 'Standard',
    } as any;

    const mergedBasic = {
      ...(parsedFacilities?.basic || {}),
      groundType: ground.groundType ?? parsedFacilities?.basic?.groundType ?? 'Cricket',
      groundSize: ground.groundSize ?? parsedFacilities?.basic?.groundSize ?? '',
      boundaryDimensions: ground.boundaryDimensions ?? parsedFacilities?.basic?.boundaryDimensions ?? '',
      pitchType: parsedFacilities?.basic?.pitchType ?? [],
      numberOfPitches: ground.numberOfPitches ?? parsedFacilities?.basic?.numberOfPitches ?? '',
    } as any;

    const mergedSpecs = {
      ...(parsedFacilities?.specs || {}),
      groundDimensions: ground.groundDimensions ?? parsedFacilities?.specs?.groundDimensions ?? '',
      pitchLength: ground.pitchLength ?? parsedFacilities?.specs?.pitchLength ?? '22 yards',
      oversPerSlot: ground.oversPerSlot ?? parsedFacilities?.specs?.oversPerSlot ?? '',
      ballType: ground.ballType ?? parsedFacilities?.specs?.ballType ?? 'Tennis',
      safetyNets: ground.hasSafetyNets ?? parsedFacilities?.specs?.safetyNets ?? false,
      rainCovers: ground.hasRainCovers ?? parsedFacilities?.specs?.rainCovers ?? false,
      groundStaffAvailable: ground.hasGroundStaffAvailable ?? parsedFacilities?.specs?.groundStaffAvailable ?? false,
    } as any;

    const finalDetails = {
      basic: mergedBasic,
      cricket: mergedCricket,
      facilities: mergedFacilities,
      specs: mergedSpecs,
    };

    setEditingGround({
      ...ground,
      capacity: ground.capacity?.toString() || '',
      pricePerHour: ground.pricePerHour?.toString() || '',
      details: finalDetails,
    });
    setShowGroundEditModal(true);
  };

  const handleCancelGroundEdit = () => {
    setShowGroundEditModal(false);
    setEditingGround(null);
    navigateToAction('grounds', 'list');
  };

  const handleSaveGround = async () => {
    if (!token || !editingGround) return;
    try {
      setLoading(true);
      // Map nested UI details to backend fields so booleans are sent correctly
      const basic = editingGround.details?.basic || {};
      const cricket = editingGround.details?.cricket || {};
      const facilities = editingGround.details?.facilities || {};
      const specs = editingGround.details?.specs || {};

      const updateData = {
        name: editingGround.name,
        location: editingGround.location,
        capacity: editingGround.capacity ? Number(editingGround.capacity) : null,
        pricePerHour: editingGround.pricePerHour ? Number(editingGround.pricePerHour) : 0,
        description: editingGround.description,
        imageUrl: editingGround.imageUrl || '',
        isActive: editingGround.isActive,

        // Basic Ground Specs
        groundType: basic.groundType || 'Cricket',
        groundSize: basic.groundSize || '',
        boundaryDimensions: basic.boundaryDimensions || '',
        pitchType: basic.pitchType ? JSON.stringify(basic.pitchType) : undefined,
        numberOfPitches: basic.numberOfPitches ? Number(basic.numberOfPitches) : undefined,

        // Cricket Specs
        turfType: cricket.turfType || 'Natural Grass',
        pitchQuality: cricket.pitchQuality || 'Medium',
        grassType: cricket.grassType || 'Bermuda',
        drainageSystem: !!cricket.drainageSystem,
        lightingQuality: cricket.lightingQuality || 'Standard',

        // Facilities
        hasFloodlights: !!facilities.floodlights,
        hasPavilion: !!facilities.pavilion,
        hasDressingRooms: !!facilities.dressingRooms,
        hasWashrooms: !!facilities.washrooms,
        hasShowers: !!facilities.showers,
        hasDrinkingWater: facilities.drinkingWater !== undefined ? !!facilities.drinkingWater : true,
        hasFirstAid: facilities.firstAid !== undefined ? !!facilities.firstAid : true,
        hasParkingTwoWheeler: facilities.parkingTwoWheeler !== undefined ? !!facilities.parkingTwoWheeler : true,
        hasParkingFourWheeler: facilities.parkingFourWheeler !== undefined ? !!facilities.parkingFourWheeler : true,
        hasRefreshments: !!facilities.refreshments,
        seatingCapacity: facilities.seatingCapacity ? Number(facilities.seatingCapacity) : undefined,
        hasPracticeNets: !!facilities.practiceNets,
        scoreboardType: facilities.scoreboard || 'Manual',
        hasLiveStreaming: !!facilities.liveStreaming,

        // Specs
        groundDimensions: specs.groundDimensions || '',
        pitchLength: specs.pitchLength || '22 yards',
        oversPerSlot: specs.oversPerSlot || '',
        ballType: specs.ballType || 'Tennis',
        hasSafetyNets: !!specs.safetyNets,
        hasRainCovers: !!specs.rainCovers,
        hasGroundStaffAvailable: !!specs.groundStaffAvailable,

        // Keep for backward compatibility
        facilities: JSON.stringify(editingGround.details)
      };

      let res: any;
      if (!editingGround.id) {
        // Create new ground
        res = await axios.post(
          `http://localhost:8080/api/admin/grounds/create`,
          updateData,
          getAuthConfig()
        );
        // Add new ground to local state
        setGrounds(prev => [...prev, res.data]);
      } else {
        // Update existing ground
        res = await axios.put(
          `http://localhost:8080/api/admin/grounds/edit/${editingGround.id}`,
          updateData,
          getAuthConfig()
        );
        // Update local state
        setGrounds(prev => prev.map(ground =>
          ground.id === editingGround.id ? { ...ground, ...res.data } : ground
        ));
      }
      
      setShowGroundEditModal(false);
      setEditingGround(null);
      setError('');
      navigateToAction('grounds', 'list');
      
      // Show success message
      setSuccessMessage(!editingGround.id ? 'Ground created successfully!' : 'Ground updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setError('Session expired. Please log in again.');
        await logout();
        return;
      }
      
      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError(!editingGround.id ? 'Failed to create ground. Please check your input.' : 'Failed to update ground. Please check your input.');
      }
      
      console.error('Failed to save ground', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGround = (id: number) => {
    setGroundToDelete(id);
    setShowGroundDeleteDialog(true);
  };

  const handleCancelDeleteGround = () => {
    setShowGroundDeleteDialog(false);
    setGroundToDelete(null);
    navigateToAction('grounds', 'list');
  };

  const handleConfirmDeleteGround = async () => {
    if (!token || !groundToDelete) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/admin/grounds/delete/${groundToDelete}`, getAuthConfig());
      setGrounds(prev => prev.filter(ground => ground.id !== groundToDelete));
      setShowGroundDeleteDialog(false);
      setGroundToDelete(null);
      setError('');
      navigateToAction('grounds', 'list');

      // Show success message
      setSuccessMessage('Ground deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setError('Session expired. Please log in again.');
        await logout();
        return;
      }

      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError('Failed to delete ground. This ground may have associated bookings.');
      }

      console.error('Failed to delete ground', e);
      setShowGroundDeleteDialog(false);
      setGroundToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  // Ground image upload handlers
  const handleGroundFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setGroundUploading(true);
    setGroundUploadError('');

    try {
      const uploadedUrl = await HomepageApiService.uploadImage(token, file);
      setEditingGround({ ...editingGround, imageUrl: uploadedUrl });
    } catch (error: any) {
      setGroundUploadError(error.message || 'Upload failed');
    } finally {
      setGroundUploading(false);
    }
  };

  const handleGroundUrlUpload = async (url: string) => {
    if (!token) return;

    setGroundUploading(true);
    setGroundUploadError('');

    try {
      // Ensure URL has protocol
      let processedUrl = url.trim();
      if (processedUrl && !processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = 'https://' + processedUrl;
      }

      const uploadedUrl = await HomepageApiService.uploadFromUrl(token, processedUrl);
      setEditingGround({ ...editingGround, imageUrl: absolutize(uploadedUrl) });
    } catch (error: any) {
      setGroundUploadError(error.message || 'URL upload failed');
    } finally {
      setGroundUploading(false);
    }
  };

  // Net image upload handlers
  const handleNetFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setNetUploading(true);
    setNetUploadError('');

    try {
      const uploadedUrl = await HomepageApiService.uploadImage(token, file);
      setEditingNet({ ...editingNet, imageUrl: absolutize(uploadedUrl) });
    } catch (error: any) {
      setNetUploadError(error.message || 'Upload failed');
    } finally {
      setNetUploading(false);
    }
  };

  const handleNetUrlUpload = async (url?: string) => {
    if (!token) return;

    const urlToUpload = url || netUrlInput;
    if (!urlToUpload || !urlToUpload.trim()) {
      setNetUploadError('Please enter a valid URL');
      return;
    }

    setNetUploading(true);
    setNetUploadError('');

    try {
      // Ensure URL has protocol
      let processedUrl = urlToUpload.trim();
      if (processedUrl && !processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = 'https://' + processedUrl;
      }

      const uploadedUrl = await HomepageApiService.uploadFromUrl(token, processedUrl);
      setEditingNet({ ...editingNet, imageUrl: absolutize(uploadedUrl) });
      setNetUrlInput(''); // Clear the input after successful upload
    } catch (error: any) {
      setNetUploadError(error.message || 'URL upload failed');
    } finally {
      setNetUploading(false);
    }
  };

  // Create Net image upload handlers
  const handleNetCreateFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setCreateNetUploading(true);
    setCreateNetUploadError('');

    try {
      const uploadedUrl = await HomepageApiService.uploadImage(token, file);
      const absUrl = absolutize(uploadedUrl);
      setNewNetImageUrl(absUrl);
      setNewNet(prev => ({ ...prev, imageUrl: absUrl }));
    } catch (error: any) {
      setCreateNetUploadError(error.message || 'Upload failed');
    } finally {
      setCreateNetUploading(false);
    }
  };

  const handleNetCreateUrlUpload = async (url: string) => {
    if (!token) return;

    if (!url || !url.trim()) {
      setCreateNetUploadError('Please enter a valid URL');
      return;
    }

    setCreateNetUploading(true);
    setCreateNetUploadError('');

    try {
      // Ensure URL has protocol
      let processedUrl = url.trim();
      if (processedUrl && !processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = 'https://' + processedUrl;
      }

      const uploadedUrl = await HomepageApiService.uploadFromUrl(token, processedUrl);
      const absUrl = absolutize(uploadedUrl);
      setNewNetImageUrl(absUrl);
      setNewNet(prev => ({ ...prev, imageUrl: absUrl }));
    } catch (error: any) {
      setCreateNetUploadError(error.message || 'URL upload failed');
    } finally {
      setCreateNetUploading(false);
    }
  };

  // --- Nets: Handlers ---
  const handleEditNet = (net: any) => {
    // Parse features if it's a string
    let featuresString = '';
    if (Array.isArray(net.features)) {
      featuresString = net.features.join(', ');
    } else if (typeof net.features === 'string') {
      try {
        const parsed = JSON.parse(net.features);
        featuresString = Array.isArray(parsed) ? parsed.join(', ') : net.features;
      } catch (e) {
        featuresString = net.features;
      }
    }

    // Map backend fields to frontend fields
    setEditingNet({
      ...net,
      capacity: net.capacity?.toString() || '',
      pricePerHour: net.pricePerHour?.toString() || '',
      netLength: net.netLength?.toString() || '',
      netWidth: net.netWidth?.toString() || '',
      features: featuresString,
      groundId: net.groundId?.toString() || '',
      netType: net.locationType || 'INDOOR', // Map locationType to netType
      surfaceType: net.surfaceType || 'TURF',
      lighting: net.hasFloodlights || false,
      bowlingMachine: net.hasBowlingMachine || false,
      videoAnalysis: false, // Not in backend, default to false
      coachingAvailable: net.coachingAvailable || false,
      equipmentRental: net.equipmentRental && net.equipmentRental.length > 0,
      ballType: net.compatibleBallTypes && net.compatibleBallTypes.length > 0 ? net.compatibleBallTypes[0] : 'TENNIS',
      netNumber: net.netNumber || ''
    });
    setNetUrlInput('');
    setNetUploadError('');
    setShowNetEditModal(true);
  };

  const handleCancelNetEdit = () => {
    setShowNetEditModal(false);
    setEditingNet(null);
    setNetUrlInput('');
    setNetUploadError('');
    navigateToAction('nets', 'list');
  };

  const handleSaveNet = async () => {
    if (!token || !editingNet) return;
    try {
      setLoading(true);
      const updateData = {
        groundId: editingNet.groundId ? Number(editingNet.groundId) : null,
        name: editingNet.name,
        netNumber: editingNet.netNumber || '',
        description: editingNet.description,
        imageUrl: editingNet.imageUrl || '',
        capacity: editingNet.capacity ? Number(editingNet.capacity) : 1,
        locationType: editingNet.netType || 'INDOOR',
        surfaceType: editingNet.surfaceType || 'TURF',
        netLength: editingNet.netLength ? Number(editingNet.netLength) : 22.0,
        netWidth: editingNet.netWidth ? Number(editingNet.netWidth) : 12.0,
        netHeight: 10.0,
        playerCapacityPerNet: editingNet.capacity ? Number(editingNet.capacity) : 1,
        hasBowlingMachine: editingNet.bowlingMachine || false,
        bowlingMachineSpeedRange: editingNet.bowlingMachine ? '40-150 kmph' : null,
        hasFloodlights: editingNet.lighting || false,
        floodlightLuxRating: editingNet.lighting ? 500 : null,
        hasProtectiveNetting: true,
        safetyGearAvailable: ['Helmets', 'Pads', 'Gloves'],
        equipmentRental: editingNet.equipmentRental ? ['Basic equipment'] : [],
        hasWashrooms: false,
        hasChangingRooms: false,
        hasDrinkingWater: true,
        hasSeatingArea: true,
        hasParking: true,
        hasFirstAid: true,
        coachingAvailable: editingNet.coachingAvailable || false,
        coachingPricePerHour: editingNet.coachingAvailable ? 500.0 : null,
        hasCctv: false,
        cctvRecordingAvailable: false,
        slotDurationMinutes: 60,
        individualBookingAllowed: true,
        groupBookingAllowed: true,
        maxGroupSize: editingNet.capacity ? Number(editingNet.capacity) : 1,
        pricingPerNet: editingNet.pricePerHour ? Number(editingNet.pricePerHour) : 0,
        pricingPerPlayer: 50.0,
        membershipDiscountPercentage: 10.0,
        bulkBookingDiscount: { weekly: 10, monthly: 20 },
        cancellationPolicy: 'Free cancellation up to 24 hours before booking',
        onlinePaymentMethods: ['UPI', 'Credit Card', 'Debit Card'],
        addOnServices: { bowlingMachine: 100, coach: 500 },
        compatibleBallTypes: editingNet.ballType ? [editingNet.ballType] : ['TENNIS'],
        safetyPaddingDetails: 'Full safety padding on all sides',
        ventilationSystem: 'Natural ventilation with fans',
        bookingCalendarEnabled: true,
        realTimeAvailability: true,
        pricePerHour: editingNet.pricePerHour ? Number(editingNet.pricePerHour) : 0,
        isAvailable: true,
        features: editingNet.features ? editingNet.features.split(',').map((s: string) => s.trim()) : []
      };
      
      const res = await axios.put(
        `http://localhost:8080/api/admin/nets/edit/${editingNet.id}`,
        updateData,
        getAuthConfig()
      );
      
      // Refresh nets data to get updated information
      await fetchNets();
      
      setShowNetEditModal(false);
      setEditingNet(null);
      setError('');
      navigateToAction('nets', 'list');
      
      // Show success message
      setSuccessMessage('Net updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setError('Session expired. Please log in again.');
        await logout();
        return;
      }
      
      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError('Failed to update net. Please check your input.');
      }
      
      console.error('Failed to update net', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNet = (id: number) => {
    setNetToDelete(id);
    setShowNetDeleteDialog(true);
  };

  const handleCancelDeleteNet = () => {
    setShowNetDeleteDialog(false);
    setNetToDelete(null);
    navigateToAction('nets', 'list');
  };

  const handleConfirmDeleteNet = async () => {
    if (!token || !netToDelete) return;
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/admin/nets/delete/${netToDelete}`, getAuthConfig());
      setNets(prev => prev.filter(net => net.id !== netToDelete));
      setShowNetDeleteDialog(false);
      setNetToDelete(null);
      setError('');
      navigateToAction('nets', 'list');
      
      // Show success message
      setSuccessMessage('Net deleted successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e: any) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setError('Session expired. Please log in again.');
        await logout();
        return;
      }
      
      if (e.response?.data?.message) {
        setError(e.response.data.message);
      } else {
        setError('Failed to delete net. This net may have associated bookings.');
      }
      
      console.error('Failed to delete net', e);
      setShowNetDeleteDialog(false);
      setNetToDelete(null);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Dashboard Overview</h3>
            <p className="text-sm text-gray-600">
              Real-time data for your cricket academy
              {lastRefresh && (
                <span className="ml-2 text-gray-500">
                  • Last updated: {lastRefresh.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleRefreshDashboard}
            disabled={dashboardLoading}
            className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm disabled:opacity-50"
          >
            {dashboardLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Refreshing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="text-sm font-medium text-gray-500">{stat.label}</div>
            {dashboardLoading ? (
              <div className="flex items-center mt-2">
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</div>
            )}
            <div className={`text-sm mt-2 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
              {dashboardLoading ? (
                <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
              ) : (
                <>{stat.change} from last month</>
              )}
            </div>
            {/* Debug info for Active Bookings */}
            {stat.label === 'Active Bookings' && !dashboardLoading && (
              <div className="text-xs text-gray-400 mt-1">
                Raw count: {activeBookings.length}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Debug Section - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Debug Info</h4>
          <div className="text-xs text-yellow-700">
            <p>Total bookings in state: {bookings.length}</p>
            <p>Active bookings: {activeBookings.length}</p>
            <p>Coaching sessions: {coachingSessions.length}</p>
            <p>Last refresh: {lastRefresh?.toLocaleTimeString() || 'Never'}</p>
          </div>
        </div>
      )}

      {/* Active Bookings and Coaching Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Active Bookings</h3>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setBookingViewType('nets')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    bookingViewType === 'nets'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Nets
                </button>
                <button
                  onClick={() => setBookingViewType('grounds')}
                  className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                    bookingViewType === 'grounds'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grounds
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Total: {DashboardService.getBookingsByType(activeBookings, bookingViewType === 'nets' ? 'net' : 'ground').length} active {bookingViewType} bookings
              <span className="ml-2 text-gray-500">({activeBookings.length} total active)</span>
            </p>
          </div>
          <div className="p-6">
            {dashboardLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                <span className="ml-2 text-sm text-gray-600">Loading bookings...</span>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {DashboardService.getUpcomingBookings(
                  DashboardService.getBookingsByType(activeBookings, bookingViewType === 'nets' ? 'net' : 'ground'),
                  5
                ).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-600">{booking.groundName}</div>
                      <div className="text-sm text-gray-500">
                        {DashboardService.formatBookingTime(booking)} • {booking.startTime} - {booking.endTime}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.bookingType === 'net' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {booking.bookingType === 'net' ? 'Net' : 'Ground'}
                      </span>
                      <div className="text-sm text-gray-500 mt-1">₹{booking.price}</div>
                    </div>
                  </div>
                ))}
                {DashboardService.getBookingsByType(activeBookings, bookingViewType === 'nets' ? 'net' : 'ground').length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No active {bookingViewType} bookings
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Coaching Sessions</h3>
              <span className="text-sm text-gray-600">
                {coachingSessions.length} active sessions
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Practice sessions and net bookings
            </p>
          </div>
          <div className="p-6">
            {dashboardLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
                <span className="ml-2 text-sm text-gray-600">Loading sessions...</span>
              </div>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                {DashboardService.getUpcomingBookings(coachingSessions, 5).map((session: CoachingSession) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{session.customerName}</div>
                      <div className="text-sm text-gray-600">{session.groundName}</div>
                      <div className="text-sm text-gray-500">
                        {DashboardService.formatBookingTime(session)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">
                        {session.startTime} - {session.endTime}
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                        session.sessionType === 'practice' 
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {session.matchType || (session.sessionType === 'net' ? 'Net Practice' : 'Practice')}
                      </span>
                    </div>
                  </div>
                ))}
                {coachingSessions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No active coaching sessions
                  </div>
                )}
              </div>
            )}
            
            {/* Quick Actions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <button 
                  onClick={() => navigateToAction('grounds', 'create')}
                  className="w-full flex items-center justify-center px-3 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Ground
                </button>
                <button 
                  onClick={() => navigateToAction('nets', 'create')}
                  className="w-full flex items-center justify-center px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Net
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Grounds Management ---
  const renderGrounds = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Grounds Management</h3>
            <p className="text-sm text-gray-600">Manage cricket grounds and their specifications</p>
          </div>
          <button
            onClick={() => navigateToAction('grounds', 'create')}
            className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Ground
          </button>
        </div>
      </div>

      {/* Grounds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {grounds.map(g => (
          <div key={g.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group">
            {/* Image Section */}
            <div className="relative h-48 bg-gray-100 overflow-hidden">
              {g.imageUrl ? (
                <img
                  src={absolutize(g.imageUrl)}
                  alt={g.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-blue-100', 'to-purple-100');
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <MapPin className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-sm text-green-700 font-medium">No Image</p>
                  </div>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  g.isActive
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    g.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  {g.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{g.name}</h4>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{g.description || 'No description available'}</p>

                {/* Key Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="line-clamp-1">{g.location || 'Location not specified'}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Capacity: {g.capacity || 'N/A'} players</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                    <span>₹{g.pricePerHour || 'N/A'}/hour</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigateToAction('grounds', 'edit', g.id)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => navigateToAction('grounds', 'delete', g.id)}
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {grounds.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No grounds found</h3>
          <p className="text-sm text-gray-600 mb-6">Get started by creating your first cricket ground</p>
          <button
            onClick={() => navigateToAction('grounds', 'create')}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Ground
          </button>
        </div>
      )}
    </div>
  );

  // --- Nets Management ---
  const renderNets = () => (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Nets Management</h3>
            <p className="text-sm text-gray-600">Manage cricket practice nets and their specifications</p>
          </div>
          <button
            onClick={() => navigateToAction('nets', 'create')}
            className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Net
          </button>
        </div>
      </div>

      {/* Create Net Form - Now using Enhanced Modal */}
      <div className="bg-white rounded-lg shadow p-6 hidden">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Enhanced Net</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="border p-2 rounded" placeholder="Name" value={newNet.name} onChange={e=>setNewNet({...newNet,name:e.target.value})} />
          <select className="border p-2 rounded" value={newNet.groundId} onChange={e=>setNewNet({...newNet,groundId:e.target.value})}>
            <option value="">Select Ground</option>
            {grounds.map(g=> <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <input className="border p-2 rounded" placeholder="Capacity" value={newNet.capacity} onChange={e=>setNewNet({...newNet,capacity:e.target.value})} />
          <input className="border p-2 rounded" placeholder="Price Per Hour" value={newNet.pricePerHour} onChange={e=>setNewNet({...newNet,pricePerHour:e.target.value})} />
          
          <select className="border p-2 rounded" value={newNet.netType} onChange={e=>setNewNet({...newNet,netType:e.target.value as 'INDOOR' | 'OUTDOOR'})}>
            <option value="INDOOR">Indoor</option>
            <option value="OUTDOOR">Outdoor</option>
          </select>
          
          <select className="border p-2 rounded" value={newNet.surfaceType} onChange={e=>setNewNet({...newNet,surfaceType:e.target.value as 'TURF' | 'MATTING' | 'CEMENT' | 'GRASS'})}>
            <option value="TURF">Turf</option>
            <option value="MATTING">Matting</option>
            <option value="CEMENT">Cement</option>
            <option value="GRASS">Grass</option>
          </select>
          
          <select className="border p-2 rounded" value={newNet.ballType} onChange={e=>setNewNet({...newNet,ballType:e.target.value as 'TENNIS' | 'LEATHER' | 'BOTH'})}>
            <option value="TENNIS">Tennis</option>
            <option value="LEATHER">Leather</option>
            <option value="BOTH">Both</option>
          </select>
          
          <input className="border p-2 rounded" placeholder="Net Length (m)" value={newNet.netLength} onChange={e=>setNewNet({...newNet,netLength:e.target.value})} />
          <input className="border p-2 rounded" placeholder="Net Width (m)" value={newNet.netWidth} onChange={e=>setNewNet({...newNet,netWidth:e.target.value})} />
          
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={newNet.lighting} onChange={e=>setNewNet({...newNet,lighting:e.target.checked})} />
                <span className="text-sm">Lighting</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={newNet.bowlingMachine} onChange={e=>setNewNet({...newNet,bowlingMachine:e.target.checked})} />
                <span className="text-sm">Bowling Machine</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={newNet.videoAnalysis} onChange={e=>setNewNet({...newNet,videoAnalysis:e.target.checked})} />
                <span className="text-sm">Video Analysis</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={newNet.coachingAvailable} onChange={e=>setNewNet({...newNet,coachingAvailable:e.target.checked})} />
                <span className="text-sm">Coaching Available</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" checked={newNet.equipmentRental} onChange={e=>setNewNet({...newNet,equipmentRental:e.target.checked})} />
                <span className="text-sm">Equipment Rental</span>
              </label>
            </div>
          </div>
          
          <input className="border p-2 rounded md:col-span-2" placeholder="Features (comma separated)" value={newNet.features} onChange={e=>setNewNet({...newNet,features:e.target.value})} />
          <textarea className="border p-2 rounded md:col-span-2" placeholder="Description" value={newNet.description} onChange={e=>setNewNet({...newNet,description:e.target.value})} />
          
          {/* Net Image Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Net Image</label>
            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                  <Upload className="w-4 h-4 mr-1" />
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file || !token) return;
                      setNetUploading(true);
                      setNetUploadError('');
                      HomepageApiService.uploadImage(token, file)
                        .then(url => {
                          setNewNetImageUrl(url);
                          setNewNet(prev => ({ ...prev, imageUrl: url }));
                        })
                        .catch(err => setNetUploadError(err.message || 'Upload failed'))
                        .finally(() => setNetUploading(false));
                    }}
                    className="hidden"
                    disabled={netUploading}
                  />
                </label>
                <span className="text-sm text-gray-500">or</span>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL"
                    className="border rounded-md px-3 py-2 flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.currentTarget as HTMLInputElement;
                        if (!token) return;
                        setNetUploading(true);
                        setNetUploadError('');
                        HomepageApiService.uploadFromUrl(token, input.value)
                          .then(url => {
                            setNewNetImageUrl(url);
                            setNewNet(prev => ({ ...prev, imageUrl: url }));
                          })
                          .catch(err => setNetUploadError(err.message || 'URL upload failed'))
                          .finally(() => setNetUploading(false));
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[placeholder*="Paste image URL"]') as HTMLInputElement;
                      if (!token || !input) return;
                      setNetUploading(true);
                      setNetUploadError('');
                      HomepageApiService.uploadFromUrl(token, input.value)
                        .then(url => {
                          setNewNetImageUrl(url);
                          setNewNet(prev => ({ ...prev, imageUrl: url }));
                        })
                        .catch(err => setNetUploadError(err.message || 'URL upload failed'))
                        .finally(() => setNetUploading(false));
                    }}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={netUploading}
                  >
                    <Link className="w-4 h-4 mr-1" />
                    Fetch
                  </button>
                </div>
              </div>

              {netUploading && <div className="text-sm text-blue-600">Uploading...</div>}
              {netUploadError && <div className="text-sm text-red-600">{netUploadError}</div>}
              {newNetImageUrl && (
                <div className="mt-2">
                  <div className="text-sm text-green-600">Image uploaded successfully!</div>
                  <img
                    src={newNetImageUrl}
                    alt="Net preview"
                    className="w-20 h-20 object-cover rounded-md border mt-1"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            onClick={async ()=>{
              try{
                const payload = {
                  name: newNet.name,
                  description: newNet.description,
                  capacity: newNet.capacity ? Number(newNet.capacity) : 1,
                  locationType: newNet.netType || 'INDOOR', // Map netType to locationType
                  surfaceType: newNet.surfaceType || 'TURF',
                  netLength: newNet.netLength ? Number(newNet.netLength) : null,
                  netWidth: newNet.netWidth ? Number(newNet.netWidth) : null,
                  netHeight: 10.0, // Default height
                  playerCapacityPerNet: newNet.capacity ? Number(newNet.capacity) : 1,
                  hasBowlingMachine: newNet.bowlingMachine || false,
                  hasFloodlights: newNet.lighting || false,
                  coachingAvailable: newNet.coachingAvailable || false,
                  slotDurationMinutes: 60, // Default slot duration
                  pricingPerNet: newNet.pricePerHour ? Number(newNet.pricePerHour) : 0,
                  pricePerHour: newNet.pricePerHour ? Number(newNet.pricePerHour) : 0,
                  isAvailable: true,
                  features: newNet.features ? newNet.features.split(',').map(s => s.trim()) : [],
                  compatibleBallTypes: newNet.ballType ? [newNet.ballType] : ['TENNIS'],
                  equipmentRental: newNet.equipmentRental ? ['Basic equipment'] : [],
                  hasProtectiveNetting: true,
                  hasDrinkingWater: true,
                  hasSeatingArea: true,
                  hasParking: true,
                  hasFirstAid: true,
                  individualBookingAllowed: true,
                  groupBookingAllowed: true,
                  maxGroupSize: newNet.capacity ? Number(newNet.capacity) : 1,
                  bookingCalendarEnabled: true,
                  realTimeAvailability: true,
                  imageUrl: newNet.imageUrl || ''
                };
                await axios.post(`http://localhost:8080/api/nets/ground/${newNet.groundId}`, payload, getAuthConfig());
                await fetchNets();
                setNewNet({
                  name:'',netNumber:'',description:'',capacity:'',pricePerHour:'',features:'',groundId:'',
                  netType:'INDOOR',surfaceType:'TURF',lighting:false,bowlingMachine:false,
                  videoAnalysis:false,coachingAvailable:false,equipmentRental:false,
                  ballType:'TENNIS',netLength:'',netWidth:'', imageUrl: ''
                });
                setNewNetImageUrl('');
              }catch(e){
                console.error('Failed to create net', e);
                setError('Failed to create net');
              }
            }}
          >Save Enhanced Net</button>
        </div>
      </div>

      {/* Nets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nets.map(n => (
                <div key={n.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden group">
                  {/* Image Section */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {n.imageUrl ? (
                      <img
                        src={absolutize(n.imageUrl)}
                        alt={n.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-blue-100', 'to-purple-100');
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <p className="text-sm text-green-700 font-medium">No Image</p>
                        </div>
                      </div>
                    )}

              {/* Status Badge */}
              <div className="absolute top-3 right-3">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  n.isAvailable
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-red-100 text-red-800 border border-red-200'
                }`}>
                  <div className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                    n.isAvailable ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  {n.isAvailable ? 'Available' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
              <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{n.name}</h4>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{n.description || 'No description available'}</p>

                {/* Key Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="line-clamp-1">{n.locationType} • {n.surfaceType}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Capacity: {n.capacity} players</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <CreditCard className="w-4 h-4 mr-2 text-gray-400" />
                    <span>₹{n.pricePerHour || 'N/A'}/hour</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="line-clamp-1">Ground: {n.groundName || 'N/A'}</span>
                  </div>
                </div>

                {/* Features Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {n.hasFloodlights && <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Lighting</span>}
                  {n.hasBowlingMachine && <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Bowling Machine</span>}
                  {n.hasCctv && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">CCTV</span>}
                  {n.coachingAvailable && <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">Coaching</span>}
                  {n.equipmentRental && n.equipmentRental.length > 0 && <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded">Equipment Rental</span>}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => navigateToAction('nets', 'edit', n.id)}
                  className="flex-1 inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={() => navigateToAction('nets', 'delete', n.id)}
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {nets.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No nets found</h3>
          <p className="text-sm text-gray-600 mb-6">Get started by creating your first cricket practice net</p>
          <button
            onClick={() => navigateToAction('nets', 'create')}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create First Net
          </button>
        </div>
      )}
    </div>
  );

  const renderBookings = () => {
    const filteredBookings = bookings.filter(booking => {
      const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.facilityName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      
      const matchesDate = !dateFilter || booking.bookingDate === dateFilter;
      
      return matchesSearch && matchesStatus && matchesDate;
    });

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Booking
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                >
                  <option value="all">All Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLATION_PENDING">Cancellation Pending</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                />
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('');
                  }}
                  className="w-full px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{booking.customerName}</div>
                      <div className="text-sm text-gray-500">{booking.customerEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.facilityName}</div>
                      <div className="text-sm text-gray-500">{booking.bookingType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.bookingDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {booking.startTime} - {booking.endTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ₹{booking.price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED' 
                          ? 'bg-green-100 text-green-800' 
                          : booking.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditBooking(booking)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit booking"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete booking"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredBookings.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No bookings found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 
                      user.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {user.status || 'PENDING'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button onClick={() => navigateToAction('users', 'edit', user.id)} className="text-indigo-600 hover:text-indigo-900" title="Edit user">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => navigateToAction('users', 'delete', user.id)} className="text-red-600 hover:text-red-900" title="Delete user">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Welcome, {user?.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex space-x-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setCurrentAction('list');
                      setCurrentId(null);
                      navigate(`/admin/${tab.id}`);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {successMessage && (
              <div className="fixed top-0 left-0 right-0 z-[9999] bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-b-md shadow-lg">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                  <span className="block sm:inline font-medium">{successMessage}</span>
                  <button
                    onClick={() => setSuccessMessage('')}
                    className="ml-4 text-green-700 hover:text-green-900 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {activeTab === 'overview' && renderOverview()}
            {activeTab === 'grounds' && renderGrounds()}
            {activeTab === 'nets' && renderNets()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'coaches' && (
              <div className="space-y-6">
                <AdminCoaches />
              </div>
            )}
            {activeTab === 'programs' && (
              <div className="space-y-6">
                <AdminPrograms />
              </div>
            )}
            {activeTab === 'starPlayers' && <AdminStarPlayers />}
            {activeTab === 'facilities' && <AdminFacilities />}
            {activeTab === 'careerEnquiry' && <AdminCareerEnquiry />}
            {activeTab === 'contactInfo' && <ContactInfoEdit />}
            {activeTab === 'payments' && <AdminPaymentManagement />}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Settings</h3>

                {/* Hero Image URL Setter */}
                <HeroImageSettings token={token || ''} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingBooking && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Booking</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveBooking(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    value={editingBooking.customerName}
                    onChange={(e) => setEditingBooking({...editingBooking, customerName: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editingBooking.status}
                    onChange={(e) => setEditingBooking({...editingBooking, status: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showUserEditModal && editingUser && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit User</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveUser(); }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={editingUser.name || ''}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Age</label>
                  <input
                    type="number"
                    value={editingUser.age || ''}
                    onChange={(e) => setEditingUser({...editingUser, age: parseInt(e.target.value) || 0})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    min="1"
                    max="120"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Experience Level</label>
                  <select
                    value={editingUser.experienceLevel || 'BEGINNER'}
                    onChange={(e) => setEditingUser({...editingUser, experienceLevel: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={editingUser.status || 'PENDING'}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancelUserEdit}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialogs */}
      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Booking"
        message="Are you sure you want to delete this booking? This action cannot be undone."
      />

      <DeleteConfirmationDialog
        isOpen={showUserDeleteDialog}
        onClose={handleCancelDeleteUser}
        onConfirm={handleConfirmDeleteUser}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone and will remove all associated bookings."
      />

      {/* Ground Edit Modal */}
      {showGroundEditModal && editingGround && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-full overflow-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{!editingGround.id ? 'Create Ground' : 'Edit Ground'}</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveGround(); }}>
              <div className="space-y-6">
                {/* Basic Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ground Name</label>
                    <input
                      type="text"
                      value={editingGround.name || ''}
                      onChange={(e) => setEditingGround({...editingGround, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    <input
                      type="text"
                      value={editingGround.location || ''}
                      onChange={(e) => setEditingGround({...editingGround, location: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Capacity</label>
                    <input
                      type="number"
                      value={editingGround.capacity || ''}
                      onChange={(e) => setEditingGround({...editingGround, capacity: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price Per Hour (₹)</label>
                    <input
                      type="number"
                      value={editingGround.pricePerHour || ''}
                      onChange={(e) => setEditingGround({...editingGround, pricePerHour: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editingGround.description || ''}
                      onChange={(e) => setEditingGround({...editingGround, description: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingGround.isActive || false}
                        onChange={(e) => setEditingGround({...editingGround, isActive: e.target.checked})}
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                  </div>
                </div>

                {/* Ground Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ground Image</label>
                  <div className="mt-2 space-y-3">
                    {/* Current Image Display */}
                    {editingGround.imageUrl && (
                      <div className="relative">
                        <div className="text-sm text-green-600 font-medium mb-2">Image uploaded successfully!</div>
                        <div className="relative inline-block">
                        <img
                          src={absolutize(editingGround.imageUrl)}
                          alt="Ground preview"
                          className="w-48 h-32 object-cover rounded-lg border-2 border-green-200 shadow-sm"
                          onError={(e) => {
                            (e.currentTarget as HTMLElement).style.opacity = '0.5';
                            (e.currentTarget as HTMLElement).style.filter = 'grayscale(100%)';
                            if (e.currentTarget.nextElementSibling) {
                              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'flex';
                            }
                          }}
                          onLoad={(e) => {
                            (e.currentTarget as HTMLElement).style.opacity = '1';
                            (e.currentTarget as HTMLElement).style.filter = 'none';
                            if (e.currentTarget.nextElementSibling) {
                              (e.currentTarget.nextElementSibling as HTMLElement).style.display = 'none';
                            }
                          }}
                        />
                          <div className="absolute inset-0 hidden items-center justify-center bg-gray-100 bg-opacity-75 rounded-lg pointer-events-none">
                            <div className="text-center">
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-1">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                              </div>
                              <p className="text-xs text-gray-600">Image failed to load</p>
                            </div>
                          </div>
                          <button
                            onClick={() => setEditingGround({...editingGround, imageUrl: ''})}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Upload Controls */}
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                        <Upload className="w-4 h-4 mr-1" />
                        Upload File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleGroundFileUpload}
                          className="hidden"
                          disabled={groundUploading}
                        />
                      </label>
                      <span className="text-sm text-gray-500">or</span>
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Paste image URL"
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              const input = e.currentTarget as HTMLInputElement;
                              handleGroundUrlUpload(input.value);
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            const input = document.querySelector('input[placeholder*="Paste image URL"]') as HTMLInputElement;
                            if (input) handleGroundUrlUpload(input.value);
                          }}
                          className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                          disabled={groundUploading}
                        >
                          <Link className="w-4 h-4 mr-2" />
                          Fetch URL
                        </button>
                      </div>
                    </div>

                    {groundUploading && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Uploading image...</span>
                      </div>
                    )}
                    {groundUploadError && (
                      <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                        {groundUploadError}
                      </div>
                    )}
                  </div>
                </div>

                {/* Basic Ground Specs */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <Settings className="w-4 h-4 text-purple-600" />
                    </div>
                    Basic Ground Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ground Type</label>
                      <select
                        value={editingGround.details?.basic?.groundType || 'Cricket'}
                        onChange={(e) => updateDetails('basic', 'groundType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                      >
                        <option value="Cricket">Cricket</option>
                        <option value="Football">Football</option>
                        <option value="Hockey">Hockey</option>
                        <option value="Multi-purpose">Multi-purpose</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">The primary sport or activity this ground is designed for</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ground Size</label>
                      <input
                        type="text"
                        value={editingGround.details?.basic?.groundSize || ''}
                        onChange={(e) => updateDetails('basic', 'groundSize', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                        placeholder="e.g., Standard cricket ground"
                      />
                      <p className="text-xs text-gray-500 mt-1">The overall size of the ground</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Boundary Dimensions</label>
                      <input
                        type="text"
                        value={editingGround.details?.basic?.boundaryDimensions || ''}
                        onChange={(e) => updateDetails('basic', 'boundaryDimensions', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                        placeholder="e.g., 65m square boundary"
                      />
                      <p className="text-xs text-gray-500 mt-1">Distance from pitch center to boundary</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Number of Pitches</label>
                      <input
                        type="number"
                        value={editingGround.details?.basic?.numberOfPitches || ''}
                        onChange={(e) => updateDetails('basic', 'numberOfPitches', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors duration-200"
                        placeholder="1"
                        min="1"
                      />
                      <p className="text-xs text-gray-500 mt-1">Total number of playable pitches on this ground</p>
                    </div>
                  </div>
                </div>

                {/* Cricket Specs */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    </div>
                    Cricket Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Turf Type</label>
                      <select
                        value={editingGround.details?.cricket?.turfType || 'Natural Grass'}
                        onChange={(e) => updateDetails('cricket', 'turfType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      >
                        <option value="Natural Grass">Natural Grass</option>
                        <option value="Artificial Turf">Artificial Turf</option>
                        <option value="Hybrid">Hybrid</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Type of playing surface</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pitch Quality</label>
                      <select
                        value={editingGround.details?.cricket?.pitchQuality || 'Medium'}
                        onChange={(e) => updateDetails('cricket', 'pitchQuality', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      >
                        <option value="Hard">Hard</option>
                        <option value="Medium">Medium</option>
                        <option value="Soft">Soft</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Quality rating of the pitch</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Grass Type</label>
                      <select
                        value={editingGround.details?.cricket?.grassType || 'Bermuda'}
                        onChange={(e) => updateDetails('cricket', 'grassType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      >
                        <option value="Bermuda">Bermuda</option>
                        <option value="Kentucky Bluegrass">Kentucky Bluegrass</option>
                        <option value="Perennial Ryegrass">Perennial Ryegrass</option>
                        <option value="Tall Fescue">Tall Fescue</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Type of grass used on the ground</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Lighting Quality</label>
                      <select
                        value={editingGround.details?.cricket?.lightingQuality || 'Standard'}
                        onChange={(e) => updateDetails('cricket', 'lightingQuality', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                      >
                        <option value="Standard">Standard</option>
                        <option value="High Quality">High Quality</option>
                        <option value="Broadcast Quality">Broadcast Quality</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Quality of lighting for evening matches</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="drainage-system"
                          checked={editingGround.details?.cricket?.drainageSystem || false}
                          onChange={(e) => updateDetails('cricket', 'drainageSystem', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Drainage System</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Facilities */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    Facilities & Amenities
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.floodlights || false}
                          onChange={(e) => updateDetails('facilities', 'floodlights', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Floodlights</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.pavilion || false}
                          onChange={(e) => updateDetails('facilities', 'pavilion', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Pavilion</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.dressingRooms || false}
                          onChange={(e) => updateDetails('facilities', 'dressingRooms', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Dressing Rooms</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.washrooms || false}
                          onChange={(e) => updateDetails('facilities', 'washrooms', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Washrooms</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.showers || false}
                          onChange={(e) => updateDetails('facilities', 'showers', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Showers</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.drinkingWater || false}
                          onChange={(e) => updateDetails('facilities', 'drinkingWater', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Drinking Water</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.firstAid || false}
                          onChange={(e) => updateDetails('facilities', 'firstAid', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">First Aid</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.parkingTwoWheeler || false}
                          onChange={(e) => updateDetails('facilities', 'parkingTwoWheeler', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Two-Wheeler Parking</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.parkingFourWheeler || false}
                          onChange={(e) => updateDetails('facilities', 'parkingFourWheeler', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Four-Wheeler Parking</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.refreshments || false}
                          onChange={(e) => updateDetails('facilities', 'refreshments', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Refreshments</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.practiceNets || false}
                          onChange={(e) => updateDetails('facilities', 'practiceNets', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Practice Nets</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.facilities?.liveStreaming || false}
                          onChange={(e) => updateDetails('facilities', 'liveStreaming', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Live Streaming</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seating Capacity</label>
                      <input
                        type="number"
                        value={editingGround.details?.facilities?.seatingCapacity || ''}
                        onChange={(e) => updateDetails('facilities', 'seatingCapacity', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="200"
                      />
                      <p className="text-xs text-gray-500 mt-1">Total seating capacity for spectators</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Scoreboard Type</label>
                      <select
                        value={editingGround.details?.facilities?.scoreboard || 'Manual'}
                        onChange={(e) => updateDetails('facilities', 'scoreboard', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                      >
                        <option value="Manual">Manual</option>
                        <option value="Digital">Digital</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Type of scoreboard available</p>
                    </div>
                  </div>
                </div>

                {/* Additional Specs */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    Additional Specifications
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ground Dimensions</label>
                      <input
                        type="text"
                        value={editingGround.details?.specs?.groundDimensions || ''}
                        onChange={(e) => updateDetails('specs', 'groundDimensions', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        placeholder="e.g., 150m x 120m"
                      />
                      <p className="text-xs text-gray-500 mt-1">Overall dimensions of the ground</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Pitch Length</label>
                      <input
                        type="text"
                        value={editingGround.details?.specs?.pitchLength || '22 yards'}
                        onChange={(e) => updateDetails('specs', 'pitchLength', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                      />
                      <p className="text-xs text-gray-500 mt-1">Length of the cricket pitch</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Overs Per Slot</label>
                      <input
                        type="number"
                        value={editingGround.details?.specs?.oversPerSlot || ''}
                        onChange={(e) => updateDetails('specs', 'oversPerSlot', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                        placeholder="20"
                      />
                      <p className="text-xs text-gray-500 mt-1">Maximum overs allowed per booking slot</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ball Type</label>
                      <select
                        value={editingGround.details?.specs?.ballType || 'Tennis'}
                        onChange={(e) => updateDetails('specs', 'ballType', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                      >
                        <option value="Tennis">Tennis</option>
                        <option value="Leather">Leather</option>
                        <option value="Both">Both</option>
                      </select>
                      <p className="text-xs text-gray-500 mt-1">Type of balls allowed on this ground</p>
                    </div>
                    <div className="space-y-4">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.specs?.safetyNets || false}
                          onChange={(e) => updateDetails('specs', 'safetyNets', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Safety Nets</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.specs?.rainCovers || false}
                          onChange={(e) => updateDetails('specs', 'rainCovers', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Rain Covers</span>
                      </label>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={editingGround.details?.specs?.groundStaffAvailable || false}
                          onChange={(e) => updateDetails('specs', 'groundStaffAvailable', e.target.checked)}
                        />
                        <span className="text-sm font-medium text-gray-700">Ground Staff Available</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelGroundEdit}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : (!editingGround.id ? 'Create Ground' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Net Edit Modal */}
      {showNetEditModal && editingNet && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-full overflow-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Net</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveNet(); }}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Net Name</label>
                    <input
                      type="text"
                      value={editingNet.name || ''}
                      onChange={(e) => setEditingNet({...editingNet, name: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Net Number</label>
                    <input
                      type="text"
                      value={editingNet.netNumber || ''}
                      onChange={(e) => setEditingNet({...editingNet, netNumber: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Capacity</label>
                    <input
                      type="number"
                      value={editingNet.capacity || ''}
                      onChange={(e) => setEditingNet({...editingNet, capacity: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price Per Hour (₹)</label>
                    <input
                      type="number"
                      value={editingNet.pricePerHour || ''}
                      onChange={(e) => setEditingNet({...editingNet, pricePerHour: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ground</label>
                    <select
                      value={editingNet.groundId || ''}
                      onChange={(e) => setEditingNet({...editingNet, groundId: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Ground</option>
                      {grounds.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Net Type</label>
                    <select
                      value={editingNet.netType || 'INDOOR'}
                      onChange={(e) => setEditingNet({...editingNet, netType: e.target.value as 'INDOOR' | 'OUTDOOR'})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="INDOOR">Indoor</option>
                      <option value="OUTDOOR">Outdoor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Surface Type</label>
                    <select
                      value={editingNet.surfaceType || 'TURF'}
                      onChange={(e) => setEditingNet({...editingNet, surfaceType: e.target.value as 'TURF' | 'MATTING' | 'CEMENT' | 'GRASS'})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="TURF">Turf</option>
                      <option value="MATTING">Matting</option>
                      <option value="CEMENT">Cement</option>
                      <option value="GRASS">Grass</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Ball Type</label>
                    <select
                      value={editingNet.ballType || 'TENNIS'}
                      onChange={(e) => setEditingNet({...editingNet, ballType: e.target.value as 'TENNIS' | 'LEATHER' | 'BOTH'})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="TENNIS">Tennis</option>
                      <option value="LEATHER">Leather</option>
                      <option value="BOTH">Both</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Net Length (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingNet.netLength || ''}
                      onChange={(e) => setEditingNet({...editingNet, netLength: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Net Width (m)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={editingNet.netWidth || ''}
                      onChange={(e) => setEditingNet({...editingNet, netWidth: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Features (comma separated)</label>
                    <input
                      type="text"
                      value={editingNet.features || ''}
                      onChange={(e) => setEditingNet({...editingNet, features: e.target.value})}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      placeholder="e.g., High nets, Side protection, Ball machine"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                      value={editingNet.description || ''}
                      onChange={(e) => setEditingNet({...editingNet, description: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Net Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Net Image</label>
                  <div className="mt-2 space-y-3">
                    {editingNet.imageUrl && (
                      <div className="relative">
                        <div className="text-sm text-green-600 font-medium mb-2">Image uploaded successfully!</div>
                        <div className="relative inline-block">
                          <img
                            src={absolutize(editingNet.imageUrl)}
                            alt="Net preview"
                            className="w-48 h-32 object-cover rounded-lg border-2 border-green-200 shadow-sm"
                            onError={(e) => {
                              (e.currentTarget as HTMLElement).style.opacity = '0.5';
                              (e.currentTarget as HTMLElement).style.filter = 'grayscale(100%)';
                            }}
                          />
                          <button
                            onClick={() => setEditingNet({...editingNet, imageUrl: ''})}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                        <Upload className="w-4 h-4 mr-1" />
                        Upload File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleNetFileUpload}
                          className="hidden"
                          disabled={netUploading}
                        />
                      </label>
                      <span className="text-sm text-gray-500">or</span>
                      <div className="flex-1 flex items-center gap-3">
                        <input
                          type="text"
                          placeholder="Paste image URL"
                          value={netUrlInput}
                          onChange={(e) => setNetUrlInput(e.target.value)}
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleNetUrlUpload();
                            }
                          }}
                        />
                        <button
                          onClick={() => handleNetUrlUpload()}
                          className="inline-flex items-center px-4 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200"
                          disabled={netUploading}
                        >
                          <Link className="w-4 h-4 mr-2" />
                          Fetch URL
                        </button>
                      </div>
                    </div>

                    {netUploading && (
                      <div className="flex items-center space-x-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        <span>Uploading image...</span>
                      </div>
                    )}
                    {netUploadError && (
                      <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                        {netUploadError}
                      </div>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingNet.lighting || false}
                        onChange={(e) => setEditingNet({...editingNet, lighting: e.target.checked})}
                      />
                      <span className="text-sm">Lighting</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingNet.bowlingMachine || false}
                        onChange={(e) => setEditingNet({...editingNet, bowlingMachine: e.target.checked})}
                      />
                      <span className="text-sm">Bowling Machine</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingNet.videoAnalysis || false}
                        onChange={(e) => setEditingNet({...editingNet, videoAnalysis: e.target.checked})}
                      />
                      <span className="text-sm">Video Analysis</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingNet.coachingAvailable || false}
                        onChange={(e) => setEditingNet({...editingNet, coachingAvailable: e.target.checked})}
                      />
                      <span className="text-sm">Coaching Available</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingNet.equipmentRental || false}
                        onChange={(e) => setEditingNet({...editingNet, equipmentRental: e.target.checked})}
                      />
                      <span className="text-sm">Equipment Rental</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelNetEdit}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Net Create Modal */}
      <EnhancedNetCreateModal
        isOpen={showEnhancedNetCreateModal}
        onClose={() => setShowEnhancedNetCreateModal(false)}
        onSuccess={() => {
          setShowEnhancedNetCreateModal(false);
          fetchNets();
        }}
        grounds={grounds}
        token={token || ''}
      />

      {/* Create Booking Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Booking</h3>
            <form onSubmit={(e) => { e.preventDefault(); /* Handle create booking */ }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Facility Type</label>
                  <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                    <option value="net">Net</option>
                    <option value="ground">Ground</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialogs */}
      <DeleteConfirmationDialog
        isOpen={showGroundDeleteDialog}
        onClose={handleCancelDeleteGround}
        onConfirm={handleConfirmDeleteGround}
        title="Delete Ground"
        message="Are you sure you want to delete this ground? This action cannot be undone and will remove all associated bookings and nets."
      />

      <DeleteConfirmationDialog
        isOpen={showNetDeleteDialog}
        onClose={handleCancelDeleteNet}
        onConfirm={handleConfirmDeleteNet}
        title="Delete Net"
        message="Are you sure you want to delete this net? This action cannot be undone and will remove all associated bookings."
      />

      {/* Chat Box */}
      {chatBoxVisible && (
        <div
          className="fixed bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-50 max-w-xs"
          style={{ left: chatBoxPosition.x, top: chatBoxPosition.y }}
        >
          <div className="text-sm text-gray-700">{chatBoxContent}</div>
          <button
            onClick={hideChatBox}
            className="absolute top-1 right-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
                  