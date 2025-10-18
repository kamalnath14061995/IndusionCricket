import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react';

interface CoachingProgram {
  id: number;
  programName: string;
  description: string;
  duration: string;
  price: number;
  level: string;
  category: string;
  isActive: boolean;
  coaches: number[];
  maxParticipants: number;
  startDate: string;
  endDate: string;
}

interface ExpertCoach {
  id: number;
  name: string;
  specialization: string;
  experienceYears: number;
  hourlyRate: number;
}

const AdminCoaching: React.FC = () => {
  const [programs, setPrograms] = useState<CoachingProgram[]>([]);
  const [coaches, setCoaches] = useState<ExpertCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProgram, setEditingProgram] = useState<CoachingProgram | null>(null);
  const [formData, setFormData] = useState({
    programName: '',
    description: '',
    duration: '',
    price: 0,
    level: '',
    category: '',
    isActive: true,
    coachIds: [] as number[],
    maxParticipants: 10,
    startDate: '',
    endDate: ''
  });

  const { token, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!token || !isAuthenticated) {
      return;
    }
    fetchPrograms();
    fetchCoaches();
  }, [token, isAuthenticated]);

  const fetchPrograms = async () => {
    try {
      const response = await axios.get('/api/admin/programs', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrograms(response.data);
    } catch (err) {
      setError('Failed to fetch coaching programs');
    } finally {
      setLoading(false);
    }
  };

  const fetchCoaches = async () => {
    try {
      const response = await axios.get('/api/admin/coaches', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCoaches(response.data);
    } catch (err) {
      console.error('Failed to fetch coaches:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const payload = {
        ...formData,
        coachIds: formData.coachIds || []
      };

      if (editingProgram) {
        await axios.put(`/api/admin/programs/${editingProgram.id}`, payload, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post('/api/admin/programs', payload, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      fetchPrograms();
      resetForm();
      alert(editingProgram ? 'Program updated successfully!' : 'Program created successfully!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to save program';
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this coaching program?')) {
      try {
        await axios.delete(`/api/admin/programs/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPrograms();
        alert('Program deleted successfully!');
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'Failed to delete program';
        setError(errorMessage);
        alert(`Error: ${errorMessage}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      programName: '',
      description: '',
      duration: '',
      price: 0,
      level: '',
      category: '',
      isActive: true,
      coachIds: [],
      maxParticipants: 10,
      startDate: '',
      endDate: ''
    });
    setEditingProgram(null);
    setShowForm(false);
  };

  const handleEdit = (program: CoachingProgram) => {
    setEditingProgram(program);
    setFormData({
      programName: program.programName,
      description: program.description,
      duration: program.duration,
      price: program.price,
      level: program.level,
      category: program.category,
      isActive: program.isActive,
      coachIds: program.coaches,
      maxParticipants: program.maxParticipants,
      startDate: program.startDate,
      endDate: program.endDate
    });
    setShowForm(true);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <BookOpen className="mr-3 h-8 w-8" />
          Manage Coaching Programs
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add New Program
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingProgram ? 'Edit Coaching Program' : 'Add New Coaching Program'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Program Name</label>
                <input
                  type="text"
                  value={formData.programName}
                  onChange={(e) => setFormData({...formData, programName: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Batting">Batting</option>
                  <option value="Bowling">Bowling</option>
                  <option value="Fielding">Fielding</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Mental">Mental</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="e.g., 4 weeks"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                >
                  <option value="">Select Level</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Professional">Professional</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Max Participants</label>
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned Coaches</label>
                <select
                  multiple
                  value={formData.coachIds.map(String)}
                  onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                    setFormData({...formData, coachIds: selectedOptions});
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  size={3}
                >
                  {coaches.map(coach => (
                    <option key={coach.id} value={coach.id.toString()}>
                      {coach.name} - {coach.specialization}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="rounded border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Active Program</span>
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {editingProgram ? 'Update Program' : 'Create Program'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {programs.map((program) => (
              <tr key={program.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{program.programName}</div>
                  <div className="text-sm text-gray-500">{program.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {program.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {program.duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹{program.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {program.level}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    program.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {program.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(program)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(program.id)}
                      className="text-red-600 hover:text-red-900"
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
    </div>
  );
};

export default AdminCoaching;
