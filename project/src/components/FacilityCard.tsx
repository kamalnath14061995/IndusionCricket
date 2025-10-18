import React from 'react';
import { getFeatureIcon } from '../utils/featureIcons';

interface Facility {
  title: string;
  description: string;
  image: string;
  features: string[];
}

interface FacilityCardProps {
  facility: Facility;
}

const FacilityCard: React.FC<FacilityCardProps> = ({ facility }) => {
  const [showFeatures, setShowFeatures] = React.useState(false);
  
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      <div className="grid grid-cols-12 items-center gap-4 p-3">
        {/* Facility Image - Round */}
        <div className="col-span-2">
          <img
            src={facility.image}
            alt={facility.title}
            className="w-16 h-16 object-cover rounded-full mx-auto"
          />
        </div>
        
        {/* Facility Details */}
        <div className="col-span-4">
          <h3 className="text-lg font-bold text-gray-900 truncate">{facility.title}</h3>
          <p className="text-green-600 font-medium text-sm">Premium Facility</p>
          <div className="text-xs text-gray-600 line-clamp-2">
            {facility.description}
          </div>
        </div>
        
        {/* Features Preview */}
        <div className="col-span-4 text-center">
          <h4 className="text-xs font-medium text-gray-700 mb-1">Features ({facility.features.length})</h4>
          <div className="grid grid-cols-2 gap-1">
            {facility.features.slice(0, 4).map((feature, index) => {
              const icon = getFeatureIcon(feature);
              return (
                <div key={index} className="flex items-center text-xs">
                  <span className="text-blue-600 mr-1">{icon}</span>
                  <span className="text-gray-700 truncate">{feature}</span>
                </div>
              );
            })}
          </div>
          {facility.features.length > 4 && (
            <button 
              onClick={() => setShowFeatures(!showFeatures)}
              className="text-xs text-blue-600 hover:text-blue-800 underline cursor-pointer mt-1"
            >
              {showFeatures ? 'Hide' : `+${facility.features.length - 4} more`} features
            </button>
          )}
        </div>
        
        {/* Status */}
        <div className="col-span-2 text-center">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Available
          </span>
        </div>
      </div>
      
      {/* All Features Section - Horizontal Scroll */}
      {showFeatures && facility.features.length > 0 && (
        <div className="border-t border-gray-200 p-3">
          <div className="text-xs font-medium text-gray-700 mb-2">All Features</div>
          <div className="flex gap-2 overflow-x-auto pb-2" style={{scrollbarWidth: 'thin'}}>
            {facility.features.map((feature, index) => {
              const icon = getFeatureIcon(feature);
              return (
                <div key={index} className="flex-shrink-0 bg-gray-50 rounded-lg p-2 min-w-[120px] flex items-center">
                  <div className="bg-blue-100 rounded-full p-1 mr-2 flex-shrink-0">
                    <span className="text-blue-600 text-xs">{icon}</span>
                  </div>
                  <span className="text-gray-700 text-xs">{feature}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityCard;
