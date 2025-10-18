import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, MapPin, Phone, Mail, Star, LogIn, Trophy } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CricketerCard from '../components/CricketerCard';
import TestimonialCard from '../components/TestimonialCard';
import FacilityCard from '../components/FacilityCard';
import { HomepageContentService, StarPlayer, FacilityItem } from '../services/homepageContentService';
import { HomepageApiService } from '../services/homepageApiService';
import axios from 'axios';

const Homepage: React.FC = () => {
  const [cricketers, setCricketers] = useState<StarPlayer[]>(HomepageContentService.getDefaultPlayers());
  const [facilities, setFacilities] = useState<FacilityItem[]>(HomepageContentService.getFacilities());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [heroImage, setHeroImage] = useState<string | undefined>(HomepageContentService.getHeroImageUrl() || undefined);

  const [contactInfo, setContactInfo] = useState<{address: string; phone: string; email: string}>({
    address: '123 Cricket Ground Road, Sports City, SC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@cricketacademy.com',
  });
  const [testimonials, setTestimonials] = useState<any[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [p, f, c, h, r] = await Promise.all([
        HomepageApiService.fetchPlayers(),
        HomepageApiService.fetchFacilities(),
        axios.get('http://localhost:8080/api/contact'),
        HomepageApiService.fetchHeroImageUrl(),
        axios.get('http://localhost:8080/api/reviews/google'),
      ]);
      if (p && p.length) setCricketers(p);
      if (f && f.length) setFacilities(f);
      if (c && c.data && c.data.length > 0) setContactInfo(c.data[0]);
      if (h && h.trim() !== '') {
        setHeroImage(h);
        HomepageContentService.setHeroImageUrl(h);
      }
      if (r && r.data) {
        console.log('Reviews data:', r.data);
        setTestimonials(r.data);
      } else {
        console.log('No reviews data received');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load data. Please try again.');
      // Set fallback testimonials if API fails
      setTestimonials([
        {
          name: 'Rajesh Kumar',
          rating: 5,
          comment: 'Excellent cricket academy with top-notch facilities. My son has improved tremendously under their coaching!',
          photo: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150'
        },
        {
          name: 'Priya Sharma',
          rating: 5,
          comment: 'Professional coaches and well-maintained grounds. Highly recommended for serious cricket training!',
          photo: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150'
        },
        {
          name: 'Arjun Patel',
          rating: 4,
          comment: 'Great academy with modern facilities. The coaching staff is very experienced and supportive.',
          photo: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);



  return (
    <div className="min-h-screen">
      <HeroSection heroImageUrl={heroImage} />
      
      {/* Loading and Error Indicators */}
      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      )}
      {error && (
        <div className="text-center py-4 bg-red-50">
          <p className="text-red-600 font-medium">{error}</p>
          <button 
            onClick={fetchData}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Refresh Button */}
      {!loading && !error && (
        <div className="text-center py-4">
          <button 
            onClick={fetchData}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>
      )}
      
      {/* Featured Cricketers Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Star Players</h2>
            <p className="text-lg text-gray-600">
              Meet our exceptional cricketers who bring world-class experience and expertise to guide your cricket journey.
            </p>
          </div>
          
          <div className="space-y-6">
            {cricketers.map((cricketer) => (
              <CricketerCard key={cricketer.id} cricketer={cricketer} />
            ))}
          </div>
          
          {cricketers.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">No star players available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              World-Class Facilities
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Train with professional-grade equipment and facilities designed to elevate your game.
            </p>
          </div>

          <div className="space-y-6">
            {facilities.map((facility, index) => (
              <FacilityCard key={index} facility={facility} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-white via-yellow-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Members Say</h2>
            <p className="text-lg text-gray-600">
              Real Google reviews from our satisfied players and parents.
            </p>
          </div>
          
          {/* Horizontal scrolling reviews */}
          <div className="flex gap-6 overflow-x-auto pb-4" style={{scrollbarWidth: 'thin'}}>
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
          
          {testimonials.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Star className="w-16 h-16 mx-auto" />
              </div>
              <p className="text-gray-500 text-lg">No reviews available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Address</p>
                    <p>{contactInfo.address}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p>{contactInfo.phone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>{contactInfo.email}</p>
                  </div>
                </div>
                {/* Admin Login button below email */}
                <div className="pt-2 flex space-x-3">
                  <Link
                    to="/admin-login"
                    className="inline-flex items-center border border-white/70 text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow transition-all"
                    aria-label="Admin Login"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Admin Login
                  </Link>
                  <Link
                    to="/career"
                    className="inline-flex items-center border border-white/70 text-white/90 bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold shadow-sm hover:shadow transition-all"
                    aria-label="Career Registration"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Career
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Ready to Start Your Cricket Journey?</h3>
              <p className="mb-6">Join our academy and take your cricket skills to the next level with professional coaching and world-class facilities.</p>
              <div className="space-y-4">
                <Link
                  to="/register"
                  className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                >
                  Register Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            {/* Admin login button removed as requested */}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
