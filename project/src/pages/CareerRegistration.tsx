import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Home, Phone, Mail, User, Award, MapPin } from 'lucide-react';
import axios from 'axios';

interface FormData {
  name: string;
  email: string;
  phone: string;
  homeAddress: string;
  experienceYears: string;
  careerDetails: string;
  certifications: string;
  backgroundDetails: string;
  skills: string;
}

const CareerRegistration: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'coach' | 'staff'>('coach');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    homeAddress: '',
    experienceYears: '',
    careerDetails: '',
    certifications: '',
    backgroundDetails: '',
    skills: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = activeTab === 'coach' 
        ? 'http://localhost:8080/api/career/cricket-coach' 
        : 'http://localhost:8080/api/career/ground-staff';

      const payload = activeTab === 'coach' 
        ? {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            homeAddress: formData.homeAddress,
            experienceYears: parseInt(formData.experienceYears) || 0,
            careerDetails: formData.careerDetails,
            certifications: formData.certifications || ''
          }
        : {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            homeAddress: formData.homeAddress,
            experienceYears: parseInt(formData.experienceYears) || 0,
            backgroundDetails: formData.backgroundDetails,
            skills: formData.skills || ''
          };

      console.log('Sending payload:', payload);
      await axios.post(endpoint, payload);
      setShowSuccess(true);
    } catch (error) {
      console.error('Registration failed:', error);
      console.error('Error response:', error.response?.data);
      setShowSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Career Registration</h1>
          <p className="text-lg text-gray-600">
            Join our team of professionals and help shape the future of cricket
          </p>
        </div>

        {showSuccess ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Registration Successful!</h2>
              <p className="text-gray-600 mb-6">
                Thank you for your registration. To know more about your application status, 
                please signup or login to check status and more details. For any queries, contact us.
              </p>
              <button
                onClick={() => {
                setShowSuccess(false);
                setFormData({
                  name: '',
                  email: '',
                  phone: '',
                  homeAddress: '',
                  experienceYears: '',
                  careerDetails: '',
                  certifications: '',
                  backgroundDetails: '',
                  skills: '',
                });
              }}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 mr-4"
              >
                Submit Another Application
              </button>
              <button
                onClick={() => navigate('/')}
                className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700"
              >
                Go to Home
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg">
            <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('coach')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'coach'
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Briefcase className="inline-block w-5 h-5 mr-2" />
                Cricket Coach
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
                Ground Staff
              </button>
            </nav>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline-block w-4 h-4 mr-1" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline-block w-4 h-4 mr-1" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline-block w-4 h-4 mr-1" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Award className="inline-block w-4 h-4 mr-1" />
                  Experience (Years) *
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Home className="inline-block w-4 h-4 mr-1" />
                Home Address *
              </label>
              <textarea
                name="homeAddress"
                value={formData.homeAddress}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            {activeTab === 'coach' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Career Details *
                  </label>
                  <textarea
                    name="careerDetails"
                    value={formData.careerDetails}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Please describe your coaching experience, achievements, and specialties..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Certifications
                  </label>
                  <textarea
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="List any relevant certifications or qualifications..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Background Details *
                  </label>
                  <textarea
                    name="backgroundDetails"
                    value={formData.backgroundDetails}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    placeholder="Please describe your background and relevant experience..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="List any specific skills or areas of expertise..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Registration'}
            </button>
          </form>
        </div>
        )}
      </div>
    </div>
  );
};

export default CareerRegistration;
