import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Users, Clock, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UPLOAD_URL } from '../services/homepageApiService';

// Build absolute URLs for backend-served uploads
const API_ORIGIN = new URL(UPLOAD_URL).origin;
const toAbsolute = (u?: string) => {
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return u.startsWith('/') ? `${API_ORIGIN}${u}` : `${API_ORIGIN}/${u}`;
};

interface ApiProgram {
  id: number;
  programName: string;
  description: string;
  duration: string;
  price: number;
  level: string;
  category: string;
  icon?: string;
  ageGroup?: string;
  focusAreas?: string;
  format?: string;
  isSuggested?: boolean;
  isActive: boolean;
  coaches?: number[];
}

const Coaching: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [programs, setPrograms] = useState<ApiProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const categories = [
    { name: 'All', description: 'All coaching programs', ageRange: '' },
    { name: 'Kids', description: 'Fun cricket for young players', ageRange: '5-10 years' },
    { name: 'Youth', description: 'Skill development for youth players', ageRange: '11-15 years' },
    { name: 'Teens', description: 'Competitive training for teenagers', ageRange: '16-19 years' },
    { name: 'Elite', description: 'High-performance training', ageRange: '19+ / Pro pathway' },
    { name: 'Girls & Women', description: 'Specialized coaching for girls and women', ageRange: 'All ages' },
    { name: 'Adults (Amateur)', description: 'Recreational coaching for adults', ageRange: '18+ years' }
  ];
  const navigate = useNavigate();

  // Dynamic coaches loaded from backend (admin-added)
  interface ApiCoach {
    id: number;
    name: string;
    email?: string;
    phone?: string;
    specialization?: string;
    experienceYears?: number;
    certifications?: string;
    bio?: string;
    profileImageUrl?: string;
    hourlyRate?: number;
    isAvailable?: boolean;
    specifications?: string;
    programs?: number[];
  }

  const [coaches, setCoaches] = useState<ApiCoach[]>([]);
  const [expandedCoaches, setExpandedCoaches] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const { data } = await axios.get<ApiCoach[]>('/api/coaches/available');
        setCoaches(Array.isArray(data) ? data : []);
      } catch (e) {
        // Fail silently for coaches to avoid blocking programs
        setCoaches([]);
      }
    };
    fetchCoaches();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        setLoading(true);
        setError(null);

        // Always fetch all active programs and filter client-side
        const { data } = await axios.get<ApiProgram[]>('/api/programs/active');
        setPrograms(Array.isArray(data) ? data : []);
      } catch (e: any) {
        setError('Failed to load available programs');
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const filteredPrograms = useMemo(() => {
    if (selectedCategory === 'All') return programs;
    
    const filtered = programs.filter(p => {
      // Check if program matches the selected age group category
      const ageGroup = p.ageGroup || '';
      
      switch (selectedCategory) {
        case 'Kids':
          return ageGroup.includes('Kids (5–10 yrs)') || ageGroup.includes('Kids (5-10 yrs)') || ageGroup.toLowerCase().includes('kids');
        case 'Youth':
          return ageGroup.includes('Youth (11–15 yrs)') || ageGroup.includes('Youth (11-15 yrs)') || ageGroup.toLowerCase().includes('youth');
        case 'Teens':
          return ageGroup.includes('Teens (16–19 yrs)') || ageGroup.includes('Teens (16-19 yrs)') || ageGroup.toLowerCase().includes('teens');
        case 'Elite':
          return ageGroup.includes('Elite (19+ / Pro pathway)') || ageGroup.toLowerCase().includes('elite');
        case 'Girls & Women':
          return ageGroup.includes('Girls & Women') || ageGroup.toLowerCase().includes('girls') || ageGroup.toLowerCase().includes('women');
        case 'Adults (Amateur)':
          return ageGroup.includes('Adults (Amateur)') || ageGroup.toLowerCase().includes('adults');
        default:
          return false;
      }
    });
    
    console.log(`Filtering for category: ${selectedCategory}`);
    console.log('All programs:', programs.map(p => ({ name: p.programName, ageGroup: p.ageGroup })));
    console.log('Filtered programs:', filtered.map(p => ({ name: p.programName, ageGroup: p.ageGroup })));
    
    return filtered;
  }, [programs, selectedCategory]);

  const filteredCoaches = coaches;

  const formatPrice = (value: number) => {
    try {
      return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2 }).format(value);
    } catch {
      return `₹${value}`;
    }
  };

  const handleEnrollNow = (program: ApiProgram) => {
    navigate('/payment', { 
      state: { 
        amount: program.price, 
        bookingId: program.id.toString(), 
        type: 'coaching' 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Coaching Programs</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional cricket coaching for all ages and skill levels. Learn from experienced coaches
            and take your game to the next level.
          </p>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <div className="overflow-x-auto">
            <div className="flex gap-3 pb-2" style={{minWidth: 'max-content'}}>
              {categories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => setSelectedCategory(category.name)}
                  className={`px-4 py-3 rounded-full border-2 transition-all duration-200 whitespace-nowrap ${
                    selectedCategory === category.name
                      ? 'border-green-600 bg-green-600 text-white shadow-lg'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50'
                  }`}
                >
                  <div className="text-sm font-semibold">{category.name}</div>
                  {category.ageRange && (
                    <div className="text-xs opacity-90">{category.ageRange}</div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coaches Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Expert Coaches</h2>
          <div className="space-y-6">
            {filteredCoaches.map((coach) => (
              <div key={coach.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="grid grid-cols-12 items-center gap-4 p-3">
                  {/* Coach Image - Round */}
                  <div className="col-span-2">
                    {coach.profileImageUrl ? (
                      <img
                        src={toAbsolute(coach.profileImageUrl)}
                        alt={coach.name}
                        className="w-16 h-16 object-cover rounded-full mx-auto"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto">
                        <span className="text-lg text-gray-500">{coach.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Coach Details */}
                  <div className="col-span-4">
                    <h3 className="text-lg font-bold text-gray-900 truncate">{coach.name}</h3>
                    <p className="text-green-600 font-medium text-sm">{coach.specialization || 'Coach'}</p>
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                      <span>Experience: {coach.experienceYears ?? 0} years</span>
                      {coach.hourlyRate && <span className="text-green-600 font-medium">₹{coach.hourlyRate}/hr</span>}
                    </div>
                  </div>
                  
                  {/* Features/Specialties in the middle */}
                  <div className="col-span-4 text-center">
                    {(() => {
                      let allFeatures: string[] = [];
                      
                      if (coach.specifications) {
                        try {
                          const specs = JSON.parse(coach.specifications);
                          allFeatures = Object.values(specs).flat() as string[];
                        } catch {
                          // If parsing fails, ignore
                        }
                      }
                      
                      if (allFeatures.length === 0 && coach.certifications) {
                        allFeatures = coach.certifications.split(',').map(cert => cert.trim()).filter(cert => cert);
                      }
                      
                      return allFeatures.length > 0 ? (
                        <div>
                          <h4 className="text-xs font-medium text-gray-700 mb-1">Features</h4>
                          <div className="overflow-x-auto">
                            <div className="flex gap-1 justify-center" style={{minWidth: 'max-content'}}>
                              {expandedCoaches.has(coach.id) ? (
                                <>
                                  {allFeatures.map((feature: string, idx: number) => (
                                    <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded whitespace-nowrap">
                                      {feature}
                                    </span>
                                  ))}
                                  <button 
                                    onClick={() => setExpandedCoaches(prev => 
                                      new Set([...prev].filter(id => id !== coach.id))
                                    )}
                                    className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
                                  >
                                    Show less
                                  </button>
                                </>
                              ) : (
                                <>
                                  {allFeatures.slice(0, 3).map((feature: string, idx: number) => (
                                    <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded whitespace-nowrap">
                                      {feature}
                                    </span>
                                  ))}
                                  {allFeatures.length > 3 && (
                                    <button 
                                      onClick={() => setExpandedCoaches(prev => 
                                        new Set([...prev, coach.id])
                                      )}
                                      className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap"
                                    >
                                      +{allFeatures.length - 3} more
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <h4 className="text-xs font-medium text-gray-700 mb-1">Features</h4>
                          <span className="text-xs text-gray-500">No features listed</span>
                        </div>
                      );
                    })()}
                  </div>
                  
                  {/* Availability Status */}
                  <div className="col-span-2 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      coach.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {coach.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Programs Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Available Programs</h2>

          {loading && (
            <div className="text-center py-8 text-gray-600">Loading programs...</div>
          )}
          {error && (
            <div className="text-center py-8 text-red-600">{error}</div>
          )}

          {!loading && !error && (
            <div className="space-y-4">
              {filteredPrograms.map((program) => (
                <div key={program.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                  <div className="flex items-center p-4">
                    {/* Program Icon */}
                    <div className="flex-shrink-0 mr-4">
                      {program.icon ? (
                        <span className="text-3xl">{program.icon}</span>
                      ) : (
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-lg text-green-600 font-bold">{program.programName.charAt(0)}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Program Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="text-lg font-bold text-gray-900 truncate mr-2">{program.programName}</h3>
                            {program.isSuggested && <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Suggested</span>}
                          </div>
                          {program.description && (
                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">{program.description}</p>
                          )}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${
                          program.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {program.isActive ? 'Available' : 'Unavailable'}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                          <Clock className="h-3 w-3 inline mr-1" />
                          {program.duration || 'Flexible'}
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {program.level || 'All levels'}
                        </span>
                        {program.ageGroup && (
                          <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                            {program.ageGroup}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Price and Action */}
                    <div className="flex-shrink-0 text-right ml-4">
                      <div className="mb-2">
                        <span className="text-xl font-bold text-green-600">{formatPrice(program.price)}</span>
                      </div>
                      <button 
                        onClick={() => handleEnrollNow(program)}
                        className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        disabled={!program.isActive}
                      >
                        Enroll Now
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredPrograms.length === 0 && (
                <div className="text-center text-gray-600 py-16 bg-white rounded-xl shadow-lg">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl text-gray-400">📚</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
                  <p className="text-gray-600">No programs available for the selected category.</p>
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Coaching;
