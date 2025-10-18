import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export interface DashboardStats {
  totalUsers: number;
  activeBookings: number;
  monthlyRevenue: number;
  groundUtilization: number;
}

export interface ActiveBooking {
  id: string;
  bookingType: 'ground' | 'net';
  groundName: string;
  customerName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
  matchType?: string;
}

export interface CoachingSession {
  id: string;
  title: string;
  coach: string;
  date: string;
  time: string;
  category: string;
  status: string;
}

export interface PaymentRecord {
  id: string;
  description: string;
  amount: number;
  date: string;
  status: string;
  type: 'booking' | 'coaching';
}

export class DashboardService {
  private static getAuthConfig(token: string) {
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  }

  static async getActiveBookings(token: string): Promise<ActiveBooking[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/bookings/admin/all`, this.getAuthConfig(token));
      const allBookings = response.data || [];

      // Filter active bookings (confirmed and today or future)
      const today = new Date().toISOString().split('T')[0];

      const activeBookings = allBookings
        .filter((booking: any) => {
          const isConfirmed = booking.status === 'CONFIRMED';
          const isFutureOrToday = booking.bookingDate >= today;
          return isConfirmed && isFutureOrToday;
        })
        .map((booking: any) => ({
          id: booking.id.toString(),
          bookingType: booking.bookingType || (booking.facilityName?.toLowerCase().includes('net') ? 'net' : 'ground'),
          groundName: booking.facilityName || booking.groundName || 'Unknown Facility',
          customerName: booking.customerName || 'Unknown Customer',
          bookingDate: booking.bookingDate,
          startTime: booking.startTime,
          endTime: booking.endTime,
          price: booking.price || 0,
          status: booking.status,
          matchType: booking.matchType || booking.bookingType
        }));

      return activeBookings;
    } catch (error) {
      console.error('Error fetching active bookings:', error);
      return [];
    }
  }

  static async getUserActiveBookings(token: string, userEmail: string): Promise<ActiveBooking[]> {
    try {
      // Use the BookingService to get user-specific bookings, including PENDING
      const { BookingService } = await import('../services/bookingService');
      const activeBookings = await BookingService.getActiveBookings(token, userEmail);
      const pendingBookings = await BookingService.getPendingBookings(token, userEmail);

      // Combine and return unique bookings
      const allBookings = [...activeBookings, ...pendingBookings];
      const uniqueBookings = allBookings.filter((booking, index, self) =>
        index === self.findIndex(b => b.id === booking.id)
      );

      return uniqueBookings;
    } catch (error) {
      console.error('Error fetching user active bookings:', error);
      return [];
    }
  }

  static async getCoachingSessions(token: string): Promise<CoachingSession[]> {
    try {
      const activeBookings = await this.getActiveBookings(token);

      // Filter coaching sessions (bookings with coaching-related match types or net bookings)
      return activeBookings
        .filter((booking: ActiveBooking) =>
          booking.matchType === 'Practice' || booking.bookingType === 'net'
        )
        .map((booking: ActiveBooking) => ({
          ...booking,
          sessionType: booking.bookingType === 'net' ? 'net' : 'practice'
        }));
    } catch (error) {
      console.error('Error fetching coaching sessions:', error);
      return [];
    }
  }

  static async getUserCoachingSessions(token: string, userEmail: string): Promise<CoachingSession[]> {
    try {
      // Try to fetch from user-specific coaching endpoint first
      try {
        const response = await axios.get(`${API_BASE_URL}/users/coaching-sessions`, this.getAuthConfig(token));
        return response.data || [];
      } catch (endpointError) {
        // If endpoint doesn't exist, fall back to filtering user bookings
        console.log('User coaching endpoint not available, falling back to booking data');
      }

      const userBookings = await this.getUserActiveBookings(token, userEmail);

      // Filter coaching sessions (net bookings or practice bookings)
      return userBookings
        .filter((booking: ActiveBooking) =>
          booking.bookingType === 'net' || booking.matchType === 'Practice'
        )
        .map((booking: ActiveBooking) => ({
          id: booking.id,
          title: booking.bookingType === 'net' ? 'Net Practice Session' : 'Practice Session',
          coach: 'Assigned Coach', // Could be enhanced to get actual coach name
          date: booking.bookingDate,
          time: `${booking.startTime} - ${booking.endTime}`,
          category: booking.bookingType === 'net' ? 'Net Practice' : 'Individual Practice',
          status: booking.status
        }));
    } catch (error) {
      console.error('Error fetching user coaching sessions:', error);
      return [];
    }
  }

  static async getUserPaymentHistory(token: string, userEmail: string): Promise<PaymentRecord[]> {
    try {
      // Try to fetch from user-specific payments endpoint
      try {
        const response = await axios.get(`${API_BASE_URL}/users/payments`, this.getAuthConfig(token));
        return response.data || [];
      } catch (endpointError) {
        console.log('User payments endpoint not available, falling back to booking data');
      }

      // Fallback: Get payment history from user bookings
      const { BookingService } = await import('../services/bookingService');
      const allUserBookings = await BookingService.getUserBookings(token, userEmail);

      return allUserBookings
        .filter(booking => booking.status === 'CONFIRMED' || booking.status === 'COMPLETED')
        .map(booking => ({
          id: booking.id,
          description: booking.bookingType === 'net' ? 'Net Practice Session' : 'Ground Booking',
          amount: booking.price,
          date: booking.createdAt || booking.bookingDate,
          status: booking.paymentStatus || 'COMPLETED',
          type: booking.bookingType === 'net' ? 'coaching' : 'booking'
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5); // Return only recent 5 payments
    } catch (error) {
      console.error('Error fetching user payment history:', error);
      return [];
    }
  }

  static async getDashboardStats(token: string): Promise<DashboardStats> {
    try {
      const [bookingsRes, usersRes, groundsRes, netsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/bookings/admin/all`, this.getAuthConfig(token)),
        axios.get(`${API_BASE_URL}/admin/users`, this.getAuthConfig(token)),
        axios.get(`${API_BASE_URL}/admin/grounds/all`, this.getAuthConfig(token)),
        axios.get(`${API_BASE_URL}/admin/nets`, this.getAuthConfig(token))
      ]);

      const allBookings = bookingsRes.data || [];
      const users = usersRes.data?.data || usersRes.data || [];
      const grounds = groundsRes.data || [];
      const nets = netsRes.data || [];

      // Calculate active bookings (confirmed and today or future)
      const today = new Date().toISOString().split('T')[0];
      const activeBookings = allBookings.filter((booking: any) => 
        booking.status === 'CONFIRMED' && booking.bookingDate >= today
      );

      // Calculate monthly revenue (all confirmed bookings this month)
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      const monthlyRevenue = allBookings.reduce((sum: number, booking: any) => {
        if (booking.status === 'CONFIRMED' && booking.bookingDate) {
          const bookingDate = new Date(booking.bookingDate);
          if (bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear) {
            return sum + (booking.price || 0);
          }
        }
        return sum;
      }, 0);

      // Calculate ground utilization based on active bookings vs total facilities
      const totalFacilities = grounds.length + nets.length;
      const groundUtilization = totalFacilities > 0 
        ? Math.min(Math.round((activeBookings.length / totalFacilities) * 100), 100)
        : 0;

      return {
        totalUsers: users.length,
        activeBookings: activeBookings.length,
        monthlyRevenue,
        groundUtilization
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return {
        totalUsers: 0,
        activeBookings: 0,
        monthlyRevenue: 0,
        groundUtilization: 0
      };
    }
  }

  static formatBookingTime(booking: ActiveBooking): string {
    const bookingDate = new Date(booking.bookingDate);
    const now = new Date();
    const isToday = bookingDate.toDateString() === now.toDateString();
    const isTomorrow = bookingDate.toDateString() === new Date(now.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    return bookingDate.toLocaleDateString();
  }

  static getBookingsByType(bookings: ActiveBooking[], type: 'net' | 'ground'): ActiveBooking[] {
    return bookings.filter(booking => booking.bookingType === type);
  }

  static getUpcomingBookings(bookings: ActiveBooking[], limit: number = 5): ActiveBooking[] {
    return bookings
      .sort((a, b) => {
        const dateA = new Date(`${a.bookingDate} ${a.startTime}`);
        const dateB = new Date(`${b.bookingDate} ${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, limit);
  }
}