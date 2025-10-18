import React from 'react';
import { MapPin, Users, Clock, DollarSign, Settings, Eye, Edit, Trash2 } from 'lucide-react';

interface NetCardProps {
  net: {
    id: number;
    name: string;
    netNumber?: string;
    description?: string;
    capacity: number;
    locationType: 'INDOOR' | 'OUTDOOR';
    surfaceType: 'TURF' | 'MATTING' | 'CEMENT';
    netLength?: number;
    netWidth?: number;
    netHeight?: number;
    playerCapacityPerNet?: number;
    hasBowlingMachine: boolean;
    bowlingMachineSpeedRange?: string;
    hasFloodlights: boolean;
    floodlightLuxRating?: number;
    hasProtectiveNetting: boolean;
    safetyGearAvailable?: string[];
    equipmentRental?: string[];
    hasWashrooms: boolean;
    hasChangingRooms: boolean;
    hasDrinkingWater: boolean;
    hasSeatingArea: boolean;
    hasParking: boolean;
    hasFirstAid: boolean;
    coachingAvailable: boolean;
    coachingPricePerHour?: number;
    hasCctv: boolean;
    cctvRecordingAvailable: boolean;
    slotDurationMinutes: number;
    individualBookingAllowed: boolean;
    groupBookingAllowed: boolean;
    maxGroupSize?: number;
    pricingPerNet?: number;
    pricingPerPlayer?: number;
    membershipDiscountPercentage?: number;
    pricePerHour: number;
    isAvailable: boolean;
    features?: string[];
    groundName?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onToggle: () => void;
}

const NetCard: React.FC<NetCardProps> = ({ net, onEdit, onDelete, onToggle }) => {
  const getLocationColor = (type: string) => {
    switch (type) {
      case 'INDOOR': return 'bg-blue-100 text-blue-800';
      case 'OUTDOOR': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSurfaceColor = (type: string) => {
    switch (type) {
      case 'TURF': return 'bg-green-100 text-green-800';
      case 'MATTING': return 'bg-yellow-100 text-yellow-800';
      case 'CEMENT': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{net.name}</h3>
          {net.netNumber && (
            <p className="text-sm text-gray-600">Net #{net.netNumber}</p>
          )}
          {net.groundName && (
            <p className="text-sm text-gray-600 flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {net.groundName}
            </p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={onEdit}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 text-red-600 hover:bg-red-50 rounded"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={onToggle}
            className={`p-2 rounded ${net.isAvailable ? 'text-green-600 hover:bg-green-50' : 'text-red-600 hover:bg-red-50'}`}
            title={net.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-4 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs ${getLocationColor(net.locationType)}`}>
            {net.locationType}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs ${getSurfaceColor(net.surfaceType)}`}>
            {net.surfaceType}
          </span>
          <span className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            {net.capacity} players
          </span>
          <span className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1" />
            {net.slotDurationMinutes} min slots
          </span>
          <span className="flex items-center text-gray-600">
            <DollarSign className="h-4 w-4 mr-1" />
            ₹{net.pricePerHour}/hr
          </span>
        </div>

        {net.description && (
          <p className="text-sm text-gray-600">{net.description}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {net.hasBowlingMachine && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
              Bowling Machine
            </span>
          )}
          {net.hasFloodlights && (
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
              Floodlights
            </span>
          )}
          {net.coachingAvailable && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              Coaching Available
            </span>
          )}
          {net.hasCctv && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
              CCTV
            </span>
          )}
          {net.features?.map((feature, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded">
              {feature}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Dimensions</h4>
            <div className="space-y-1 text-gray-600">
              {net.netLength && <p>Length: {net.netLength}m</p>}
              {net.netWidth && <p>Width: {net.netWidth}m</p>}
              {net.netHeight && <p>Height: {net.netHeight}m</p>}
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Facilities</h4>
            <div className="space-y-1 text-gray-600">
              {net.hasWashrooms && <p>✓ Washrooms</p>}
              {net.hasChangingRooms && <p>✓ Changing Rooms</p>}
              {net.hasDrinkingWater && <p>✓ Drinking Water</p>}
              {net.hasSeatingArea && <p>✓ Seating Area</p>}
              {net.hasParking && <p>✓ Parking</p>}
              {net.hasFirstAid && <p>✓ First Aid</p>}
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex justify-between items-center">
            <div className="text-sm">
              <span className="text-gray-600">Status: </span>
              <span className={`font-medium ${net.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                {net.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600">Pricing: </span>
              <span className="font-medium">
                {net.pricingPerNet && `₹${net.pricingPerNet}/net`}
                {net.pricingPerPlayer && ` / ₹${net.pricingPerPlayer}/player`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetCard;
