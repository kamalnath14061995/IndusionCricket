import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, Trophy, Camera, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileEmailVerification } from '../components/ProfileEmailVerification';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    age: user?.age || 0,
    experienceLevel: user?.experienceLevel || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, this would update the user profile via API
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const experienceLevels = ['Beginner', 'Intermediate', 'Advanced', 'Professional'];

  const stats = [
    { label: 'Sessions Attended', value: '24', icon: Trophy },
    { label: 'Hours Practiced', value: '48', icon: Calendar },
    { label: 'Grounds Booked', value: '12', icon: User },
    { label: 'Net Sessions', value: '18', icon: Phone }
  ];

  const bookingHistory = [
    {
      id: '1',
      type: 'Ground Booking',
      facility: 'Main Ground A',
      date: '2024-01-15',
      time: '10:00 AM - 12:00 PM',
      amount: '₹500',
      status: 'Completed'
    },
    {
      id: '2',
      type: 'Net Practice',
      facility: 'Net 1-3',
      date: '2024-01-12',
      time: '6:00 PM - 7:00 PM',
      amount: '₹150',
      status: 'Completed'
    },
    {
      id: '3',
      type: 'Coaching Session',
      facility: 'Practice Ground B',
      date: '2024-01-10',
      time: '4:00 PM - 5:00 PM',
      amount: '₹300',
      status: 'Completed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-green-600" />
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-shadow">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
                  <p className="text-gray-600">{user?.email}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Member since 2024</span>
                    <span>•</span>
                    <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Active Member
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            {/* Profile Details */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-md">
                      <User className="h-5 w-5 text-gray-400 mr-3" />
                      <span>{user?.name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span>{user?.email}</span>
                      </div>
                      <ProfileEmailVerification 
                        email={user?.email || ''} 
                        onVerificationComplete={() => {
                          // Refresh user data after verification
                          window.location.reload();
                        }} 
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-md">
                      <Phone className="h-5 w-5 text-gray-400 mr-3" />
                      <span>{user?.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    />
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-md">
                      <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                      <span>{user?.age} years old</span>
                    </div>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  {isEditing ? (
                    <select
                      name="experienceLevel"
                      value={formData.experienceLevel}
                      onChange={handleChange}
                      className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      {experienceLevels.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center p-3 bg-gray-50 rounded-md">
                      <Trophy className="h-5 w-5 text-gray-400 mr-3" />
                      <span>{user?.experienceLevel}</span>
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSave}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {/* Booking History */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Booking History</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Facility
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookingHistory.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {booking.facility}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {booking.date}<br />
                          {booking.time}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Stats and Quick Actions */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <stat.icon className="h-5 w-5 text-green-600 mr-3" />
                      <span className="text-sm text-gray-600">{stat.label}</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                  Book Ground
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                  Schedule Coaching
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-colors">
                  View Payment History
                </button>
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-red-300 hover:bg-red-50 transition-colors text-red-600">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;