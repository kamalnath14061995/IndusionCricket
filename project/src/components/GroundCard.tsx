import React from 'react';
import { getFeatureIcon } from '../utils/featureIcons';

interface Ground {
  id: string;
  name: string;
  location: string;
  capacity: number;
  pricePerHour: number;
  facilities: string; // JSON string
  description: string;
  imageUrl: string;
  isActive: boolean;
}

interface GroundCardProps {
  ground: Ground;
  onEdit?: (ground: Ground) => void;
  onDelete?: (id: number) => void;
}

const GroundCard: React.FC<GroundCardProps> = ({ ground, onEdit, onDelete }) => {
  // Parse facilities from JSON string
  const parseFacilities = (facilitiesStr: string): string[] => {
    try {
      const parsed = JSON.parse(facilitiesStr);
      if (parsed && typeof parsed === 'object') {
        // Extract facilities from the nested structure
        const facilities = parsed.facilities || parsed;
        if (Array.isArray(facilities)) {
          return facilities;
        }
        if (typeof facilities === 'object') {
          // Convert object keys to array of strings
          return Object.keys(facilities).filter(key => facilities[key]);
        }
      }
      return [];
    } catch (e) {
      return [];
    }
  };

  const facilities = parseFacilities(ground.facilities);

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden w-full min-h-72 flex border border-gray-100 group">
      {/* Image Section */}
      <div className="w-2/5 relative overflow-hidden">
        {ground.imageUrl ? (
          <img
            src={ground.imageUrl}
            alt={ground.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-green-100', 'to-blue-100');
              e.currentTarget.parentElement!.innerHTML = `
                <div class="w-full h-full flex items-center justify-center">
                  <div class="text-4xl">🏏</div>
                </div>
              `;
            }}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
            <div className="text-4xl">🏏</div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
        <div className={`absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 ${
          ground.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <span className="text-xs font-semibold">{ground.isActive ? 'Active' : 'Inactive'}</span>
        </div>
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="text-xs font-semibold text-white">₹{ground.pricePerHour}/hr</span>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-3/5 p-5 flex flex-col bg-gradient-to-br from-white to-gray-50">
        <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
          {ground.name}
        </h3>

        <div className="text-sm text-gray-600 mb-2">
          📍 {ground.location}
        </div>

        <div className="text-sm text-gray-600 mb-3">
          👥 Capacity: {ground.capacity} players
        </div>

        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
          {ground.description}
        </p>

        {/* Facilities Section - Grid Layout */}
        {facilities.length > 0 && (
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {facilities.slice(0, 6).map((facility, index) => {
                const icon = getFeatureIcon(facility);
                return (
                  <div key={index} className="flex items-center group/feature min-h-[24px]">
                    <div className="bg-green-100 rounded-full p-1.5 mr-3 flex-shrink-0 group-hover/feature:bg-green-200 transition-colors duration-200 flex items-center justify-center w-6 h-6">
                      <span className="text-green-600 text-xs font-bold leading-none">{icon}</span>
                    </div>
                    <span className="text-gray-700 text-xs flex-1 leading-tight align-middle">{facility}</span>
                  </div>
                );
              })}
            </div>
            {facilities.length > 6 && (
              <div className="text-xs text-gray-500 mt-2">
                +{facilities.length - 6} more facilities
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          {onEdit && (
            <button
              onClick={() => onEdit(ground)}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(Number(ground.id))}
              className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroundCard;
