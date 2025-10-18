export interface Ground {
  id?: number;
  name: string;
  location: string;
  capacity: number;
  pricePerHour: number;
  description: string;
  imageUrl?: string;
  isActive: boolean;
  // Basic Ground Specs
  groundType?: string;
  groundSize?: string;
  boundaryDimensions?: string;
  pitchType?: string;
  numberOfPitches?: number;
  // Cricket Specs
  turfType?: string;
  pitchQuality?: string;
  grassType?: string;
  drainageSystem?: boolean;
  lightingQuality?: string;
  seatingTypes?: string;
  mediaFacilities?: string;
  practiceFacilities?: string;
  safetyFeatures?: string;
  // Facilities
  hasFloodlights?: boolean;
  hasPavilion?: boolean;
  hasDressingRooms?: boolean;
  hasWashrooms?: boolean;
  hasShowers?: boolean;
  hasDrinkingWater?: boolean;
  hasFirstAid?: boolean;
  hasParkingTwoWheeler?: boolean;
  hasParkingFourWheeler?: boolean;
  hasRefreshments?: boolean;
  seatingCapacity?: number;
  hasPracticeNets?: boolean;
  scoreboardType?: string;
  hasLiveStreaming?: boolean;
  // Specs
  groundDimensions?: string;
  pitchLength?: string;
  oversPerSlot?: string;
  ballType?: string;
  hasSafetyNets?: boolean;
  hasRainCovers?: boolean;
  hasGroundStaffAvailable?: boolean;
  facilities?: string;
}

export interface GroundCardProps {
  ground: Ground;
  onEdit?: (ground: Ground) => void;
  onDelete?: (id: number) => void;
}

export interface GroundCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  editingGround?: Ground | null;
}
