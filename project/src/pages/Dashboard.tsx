import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, CreditCard, Trophy, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { DashboardService, ActiveBooking, DashboardStats, CoachingSession, PaymentRecord } from '../services/dashboardService';

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [activeBookings, setActiveBookings] = useState<ActiveBooking[]>([]);
  const [coachingSessions, setCoachingSessions] = useState<CoachingSession[]>([]);
  const [recentPayments, setRecentPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token || !user?.email) return;

      try {
        setLoading(true);
        const [stats, bookings, sessions, payments] = await Promise.all([
          DashboardService.getDashboardStats(token),
          DashboardService.getUserActiveBookings(token, user.email),
          DashboardService.getUserCoachingSessions(token, user.email),
          DashboardService.getUserPaymentHistory(token, user.email)
        ]);

        setDashboardStats(stats);
        setActiveBookings(bookings);
        setCoachingSessions(sessions);
        setRecentPayments(payments);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, user?.email]);

  const upcomingBookings = DashboardService.getUpcomingBookings(activeBookings, 5).map(booking => ({
    id: booking.id,
    type: booking.bookingType === 'net' ? 'Net Practice' : 'Ground Booking',
    ground: booking.groundName,
    date: booking.bookingDate,
    time: `${booking.startTime} - ${booking.endTime}`,
    status: booking.status === 'CONFIRMED' ? 'Confirmed' : booking.status
  }));



  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Here's what's happening with your cricket training.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Bookings</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : dashboardStats?.activeBookings || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Coaching Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : DashboardService.getBookingsByType(activeBookings, 'net').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Trophy className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Skill Level</p>
                <p className="text-2xl font-bold text-gray-900">{user?.experienceLevel}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : `₹${dashboardStats?.monthlyRevenue?.toLocaleString() || 0}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Upcoming Bookings
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading bookings...</div>
              ) : upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{booking.type}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'Confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        {booking.ground}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {booking.date} • {booking.time}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No upcoming bookings</p>
                </div>
              )}
            </div>
          </div>

          {/* Coaching Sessions */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Coaching Sessions
              </h2>
            </div>
            <div className="p-6">
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading coaching sessions...</div>
              ) : coachingSessions.length > 0 ? (
                <div className="space-y-4">
                  {coachingSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{session.title}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {session.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{session.coach}</p>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {session.date} • {session.time}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No coaching sessions scheduled</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Payments */}
        <div className="mt-8 bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
              Recent Payments
            </h2>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading payment history...</div>
            ) : recentPayments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {recentPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <CreditCard className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No payment history available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;