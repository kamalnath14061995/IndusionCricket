import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

type HeroSectionProps = {
  heroImageUrl?: string; // Optional dynamic image URL provided by admin/backend
};

const DEFAULT_HERO_IMAGE =
  'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80';

const isValidImageUrl = (url: string): boolean => {
  // Accept common image formats and data URLs
  return /\.(jpeg|jpg|gif|png|svg|webp|bmp|tiff|ico)$/i.test(url) || url.startsWith('data:image/');
};

const HeroSection: React.FC<HeroSectionProps> = ({ heroImageUrl }) => {
  const navigate = useNavigate();
  const imageSrc =
    heroImageUrl && heroImageUrl.trim() !== '' && isValidImageUrl(heroImageUrl)
      ? heroImageUrl
      : DEFAULT_HERO_IMAGE;

  return (
    <section className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
                Master the Art of
                <span className="block text-yellow-400">Cricket</span>
              </h1>
              <p className="text-xl lg:text-2xl text-green-100 mb-8 leading-relaxed">
                Join India's premier cricket academy and train with professional coaches. 
                From beginners to advanced players, we nurture champions.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center justify-center bg-yellow-400 text-green-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all duration-300 transform hover:scale-105"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              
              <a
                href="https://www.instagram.com/indusionsports/reel/DN5FHceknYP/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-900 transition-all duration-300"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Academy Tour
              </a>
            </div>
            
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-green-500">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-green-100">Students Trained</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">15+</div>
                <div className="text-green-100">Expert Coaches</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">10</div>
                <div className="text-green-100">Years Experience</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10">
              <img
                src={imageSrc}
                alt="Cricket Academy"
                className="rounded-2xl shadow-2xl w-full h-96 object-cover"
              />
            </div>
            
            {/* Floating cards */}

            <div className="absolute bottom-4 right-4 bg-yellow-400 text-green-900 p-4 rounded-lg shadow-lg z-20">
              <div className="text-2xl font-bold">24/7</div>
              <div className="text-sm">Ground Access</div>
            </div>
            
            {/* Background decorative elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-yellow-400/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
    </section>
  );
};

export default HeroSection;