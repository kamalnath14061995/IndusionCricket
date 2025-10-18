import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface BookingStatus {
  PENDING: 'PENDING';
  CONFIRMED: 'CONFIRMED';
  COMPLETED: 'COMPLETED';
  CANCELLED: 'CANCELLED';
  FAILED: 'FAILED';
  REFUNDED: 'REFUNDED';
}

export interface UserBooking {
  id: string;
  bookingType: 'ground' | 'net';
  groundName: string;
  customerName: string;
  customerEmail: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  price: number;
  status: keyof BookingStatus;
  matchType?: string;
  paymentStatus?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingFilters {
  status?: string[];
  bookingType?: 'ground' | 'net';
  dateFrom?: string;
  dateTo?: string;
}

export class BookingService {
  private static getAuthConfig(token: string) {
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  /**
   * Get bookings for a specific user by email
   */
  static async getUserBookings(token: string, email: string): Promise<UserBooking[]> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/bookings/email/${encodeURIComponent(email)}`,
        this.getAuthConfig(token)
      );
      return this.transformBookings(response.data || []);
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return [];
    }
  }

  /**
   * Get bookings with filters
   */
  static async getFilteredBookings(
    token: string,
    email: string,
    filters: BookingFilters
  ): Promise<UserBooking[]> {
    try {
      const bookings = await this.getUserBookings(token, email);
      return this.applyFilters(bookings, filters);
    } catch (error) {
      console.error('Error fetching filtered bookings:', error);
      return [];
    }
  }

  /**
   * Get active bookings (confirmed and future bookings)
   */
  static async getActiveBookings(token: string, email: string): Promise<UserBooking[]> {
    try {
      const bookings = await this.getUserBookings(token, email);
      const today = new Date().toISOString().split('T')[0];

      return bookings.filter(booking => {
        const isConfirmed = booking.status === 'CONFIRMED';
        const isFutureOrToday = booking.bookingDate >= today;
        return isConfirmed && isFutureOrToday;
      });
    } catch (error) {
      console.error('Error fetching active bookings:', error);
      return [];
    }
  }

  /**
   * Get booking history (completed, failed, cancelled bookings)
   */
  static async getBookingHistory(token: string, email: string): Promise<UserBooking[]> {
    try {
      const bookings = await this.getUserBookings(token, email);
      const today = new Date().toISOString().split('T')[0];

      return bookings.filter(booking => {
        const isPastBooking = booking.bookingDate < today;
        const isCompleted = booking.status === 'COMPLETED';
        const isFailed = booking.status === 'FAILED';
        const isCancelled = booking.status === 'CANCELLED';
        const isRefunded = booking.status === 'REFUNDED';

        return isPastBooking || isCompleted || isFailed || isCancelled || isRefunded;
      });
    } catch (error) {
      console.error('Error fetching booking history:', error);
      return [];
    }
  }

  /**
   * Get pending bookings
   */
  static async getPendingBookings(token: string, email: string): Promise<UserBooking[]> {
    try {
      const bookings = await this.getUserBookings(token, email);
      return bookings.filter(booking => booking.status === 'PENDING');
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      return [];
    }
  }

  /**
   * Get failed bookings
   */
  static async getFailedBookings(token: string, email: string): Promise<UserBooking[]> {
    try {
      const bookings = await this.getUserBookings(token, email);
      return bookings.filter(booking => booking.status === 'FAILED');
    } catch (error) {
      console.error('Error fetching failed bookings:', error);
      return [];
    }
  }

  /**
   * Get completed bookings
   */
  static async getCompletedBookings(token: string, email: string): Promise<UserBooking[]> {
    try {
      const bookings = await this.getUserBookings(token, email);
      return bookings.filter(booking => booking.status === 'COMPLETED');
    } catch (error) {
      console.error('Error fetching completed bookings:', error);
      return [];
    }
  }

  /**
   * Transform raw booking data to UserBooking interface
   */
  private static transformBookings(bookings: any[]): UserBooking[] {
    return bookings.map(booking => ({
      id: booking.id?.toString() || '',
      bookingType: booking.bookingType || (booking.facilityName?.toLowerCase().includes('net') ? 'net' : 'ground'),
      groundName: booking.facilityName || booking.groundName || 'Unknown Facility',
      customerName: booking.customerName || 'Unknown Customer',
      customerEmail: booking.customerEmail || '',
      bookingDate: booking.bookingDate || '',
      startTime: booking.startTime || '',
      endTime: booking.endTime || '',
      price: booking.price || booking.totalPrice || 0,
      status: booking.status || 'PENDING',
      matchType: booking.matchType || booking.bookingType,
      paymentStatus: booking.paymentStatus || 'PENDING',
      createdAt: booking.createdAt || booking.bookingDate || '',
      updatedAt: booking.updatedAt || booking.bookingDate || ''
    }));
  }

  /**
   * Apply filters to bookings
   */
  private static applyFilters(bookings: UserBooking[], filters: BookingFilters): UserBooking[] {
    let filteredBookings = [...bookings];

    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filteredBookings = filteredBookings.filter(booking =>
        filters.status!.includes(booking.status)
      );
    }

    // Filter by booking type
    if (filters.bookingType) {
      filteredBookings = filteredBookings.filter(booking =>
        booking.bookingType === filters.bookingType
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filteredBookings = filteredBookings.filter(booking =>
        booking.bookingDate >= filters.dateFrom!
      );
    }

    if (filters.dateTo) {
      filteredBookings = filteredBookings.filter(booking =>
        booking.bookingDate <= filters.dateTo!
      );
    }

    return filteredBookings;
  }

  /**
   * Format booking date for display
   */
  static formatBookingDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isTomorrow = date.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();

    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return date.toLocaleDateString();
  }

  /**
   * Get status color for UI
   */
  static getStatusColor(status: keyof BookingStatus): string {
    switch (status) {
      case 'CONFIRMED':
        return 'text-green-600 bg-green-50';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50';
      case 'COMPLETED':
        return 'text-blue-600 bg-blue-50';
      case 'FAILED':
        return 'text-red-600 bg-red-50';
      case 'CANCELLED':
        return 'text-gray-600 bg-gray-50';
      case 'REFUNDED':
        return 'text-purple-600 bg-purple-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  }

  /**
   * Get status icon for UI
   */
  static getStatusIcon(status: keyof BookingStatus): string {
    switch (status) {
      case 'CONFIRMED':
        return '✓';
      case 'PENDING':
        return '⏳';
      case 'COMPLETED':
        return '✅';
      case 'FAILED':
        return '❌';
      case 'CANCELLED':
        return '🚫';
      case 'REFUNDED':
        return '💰';
      default:
        return '📋';
    }
  }
}
