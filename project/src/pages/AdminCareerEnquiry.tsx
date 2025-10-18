import React, { useState, useEffect } from 'react';
import { Users, Briefcase, Edit, Trash2, Eye, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';

interface CricketCoach {
  id: number;
  name: string;
  email: string;
  phone: string;
  careerDetails: string;
  homeAddress: string;
  certifications: string;
  experienceYears: number;
  onboardStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ONBOARDED';
  jobStatus: 'APPLIED' | 'UNDER_REVIEW' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED' | 'HIRED';
  createdAt: string;
  updatedAt: string;
}

interface GroundStaff {
  id: number;
  name: string;
  email: string;
  phone: string;
  backgroundDetails: string;
  homeAddress: string;
  skills: string;
  experienceYears: number;
  onboardStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ONBOARDED';
  jobStatus: 'APPLIED' | 'UNDER_REVIEW' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED' | 'HIRED';
  createdAt: string;
  updatedAt: string;
}

const AdminCareerEnquiry: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'coaches' | 'staff'>('coaches');
  const [coaches, setCoaches] = useState<CricketCoach[]>([]);
  const [staff, setStaff] = useState<GroundStaff[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CricketCoach | GroundStaff | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'coaches') {
        const response = await axios.get('http://localhost:8080/api/career/cricket-coaches');
        setCoaches(response.data);
      } else {
        const response = await axios.get('http://localhost:8080/api/career/ground-staff');
        setStaff(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, type: 'onboard' | 'job', status: string) => {
    try {
      const endpoint = activeTab === 'coaches' ? 'cricket-coach' : 'ground-staff';
      await axios.put(`http://localhost:8080/api/career/${endpoint}/${id}/${type}-status?status=${status}`);
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteItem = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        const endpoint = activeTab === 'coaches' ? 'cricket-coach' : 'ground-staff';
        await axios.delete(`http://localhost:8080/api/career/${endpoint}/${id}`);
        fetchData();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': case 'APPLIED': return 'bg-yellow-100 text-yellow-800';
      case 'APPROVED': case 'SELECTED': case 'HIRED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'UNDER_REVIEW': case 'INTERVIEW_SCHEDULED': return 'bg-blue-100 text-blue-800';
      case 'ONBOARDED': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTable = () => {
    const data = activeTab === 'coaches' ? coaches : staff;
    
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Onboard Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.email}</div>
                  <div className="text-sm text-gray-500">{item.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{item.experienceYears} years</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={item.onboardStatus}
                    onChange={(e) => updateStatus(item.id, 'onboard', e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.onboardStatus)}`}
                  >
                    <option value="PENDING">Pending</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="ONBOARDED">Onboarded</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={item.jobStatus}
                    onChange={(e) => updateStatus(item.id, 'job', e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(item.jobStatus)}`}
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                    <option value="SELECTED">Selected</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="HIRED">Hired</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(item.createdAt)}
                  </div>
                  {item.updatedAt !== item.createdAt && (
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      Updated: {formatDate(item.updatedAt)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => { setSelectedItem(item); setShowModal(true); }}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Career Enquiry Management</h1>
        <p className="text-gray-600">Manage cricket coach and ground staff applications</p>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('coaches')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'coaches'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="inline-block w-5 h-5 mr-2" />
              Cricket Coaches ({coaches.length})
            </button>
            <button
              onClick={() => setActiveTab('staff')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'staff'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="inline-block w-5 h-5 mr-2" />
              Ground Staff ({staff.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            renderTable()
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Application Details</h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <p className="text-sm text-gray-900">{selectedItem.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{selectedItem.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <p className="text-sm text-gray-900">{selectedItem.phone}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Experience</label>
                    <p className="text-sm text-gray-900">{selectedItem.experienceYears} years</p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Home Address</label>
                  <p className="text-sm text-gray-900">{selectedItem.homeAddress}</p>
                </div>
                
                {activeTab === 'coaches' && 'careerDetails' in selectedItem && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Career Details</label>
                      <p className="text-sm text-gray-900">{selectedItem.careerDetails}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Certifications</label>
                      <p className="text-sm text-gray-900">{selectedItem.certifications || 'None specified'}</p>
                    </div>
                  </>
                )}
                
                {activeTab === 'staff' && 'backgroundDetails' in selectedItem && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Background Details</label>
                      <p className="text-sm text-gray-900">{selectedItem.backgroundDetails}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Skills</label>
                      <p className="text-sm text-gray-900">{selectedItem.skills || 'None specified'}</p>
                    </div>
                  </>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Onboard Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(selectedItem.onboardStatus)}`}>
                      {selectedItem.onboardStatus}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Status</label>
                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(selectedItem.jobStatus)}`}>
                      {selectedItem.jobStatus}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Applied On</label>
                    <p>{formatDate(selectedItem.createdAt)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                    <p>{formatDate(selectedItem.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCareerEnquiry;