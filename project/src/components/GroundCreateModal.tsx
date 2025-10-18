import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { X, Save, Upload, Link, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import SpecificationsSection from './SpecificationsSection';
import axios from 'axios';
import { HomepageApiService } from '../services/homepageApiService';
import { Ground, GroundCreateModalProps } from '../types/ground';

const GroundCreateModal: React.FC<GroundCreateModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingGround
}) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [groundUploading, setGroundUploading] = useState(false);
  const [groundUploadError, setGroundUploadError] = useState('');
  const [groundUrlInput, setGroundUrlInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    mapsUrl: '',
    capacity: '',
    pricePerHour: '',
    imageUrl: '',
    isActive: true,
    details: {
      basic: {
        groundType: 'Cricket' as 'Cricket' | 'Football' | 'Hockey' | 'Multi-purpose',
        groundSize: '',
        boundaryDimensions: '',
        pitchType: ['Turf'],
        numberOfPitches: '1'
      },
      cricket: {
        turfType: 'Natural Grass' as 'Natural Grass' | 'Artificial Turf' | 'Hybrid',
        pitchQuality: 'Medium' as 'Hard' | 'Medium' | 'Soft',
        grassType: 'Bermuda' as 'Bermuda' | 'Kentucky Bluegrass' | 'Perennial Ryegrass' | 'Tall Fescue',
        drainageSystem: true,
        lightingQuality: 'Standard' as 'Standard' | 'High Quality' | 'Broadcast Quality',
        seatingTypes: ['Basic seating'],
        mediaFacilities: [] as string[],
        practiceFacilities: ['Practice nets'],
        safetyFeatures: ['Boundary fencing']
      },
      facilities: {
        floodlights: true,
        pavilion: true,
        dressingRooms: true,
        washrooms: true,
        showers: true,
        drinkingWater: true,
        firstAid: true,
        parkingTwoWheeler: true,
        parkingFourWheeler: true,
        refreshments: true,
        seatingCapacity: '200',
        practiceNets: true,
        scoreboard: 'Digital' as 'Manual' | 'Digital',
        liveStreaming: false
      },
      specs: {
        groundDimensions: '',
        pitchLength: '22 yards',
        oversPerSlot: '20',
        ballType: 'Tennis' as 'Tennis' | 'Leather' | 'Both',
        safetyNets: true,
        rainCovers: false,
        groundStaffAvailable: true
      }
    }
  });

  useEffect(() => {
    if (editingGround) {
      setFormData({
        name: editingGround.name || '',
        description: editingGround.description || '',
        location: editingGround.location || '',
        mapsUrl: '',
        capacity: editingGround.capacity?.toString() || '',
        pricePerHour: editingGround.pricePerHour?.toString() || '',
        imageUrl: editingGround.imageUrl || '',
        isActive: editingGround.isActive,
        details: {
          basic: {
            groundType: (editingGround.groundType as any) || 'Cricket',
            groundSize: editingGround.groundSize || '',
            boundaryDimensions: editingGround.boundaryDimensions || '',
            pitchType: editingGround.pitchType ? [editingGround.pitchType] : ['Turf'],
            numberOfPitches: editingGround.numberOfPitches?.toString() || '1'
          },
          cricket: {
            turfType: (editingGround.turfType as any) || 'Natural Grass',
            pitchQuality: (editingGround.pitchQuality as any) || 'Medium',
            grassType: (editingGround.grassType as any) || 'Bermuda',
            drainageSystem: editingGround.drainageSystem === true,
            lightingQuality: (editingGround.lightingQuality as any) || 'Standard',
            seatingTypes: editingGround.seatingTypes ? [editingGround.seatingTypes] : ['Basic seating'],
            mediaFacilities: editingGround.mediaFacilities ? [editingGround.mediaFacilities] : [],
            practiceFacilities: editingGround.practiceFacilities ? [editingGround.practiceFacilities] : ['Practice nets'],
            safetyFeatures: editingGround.safetyFeatures ? [editingGround.safetyFeatures] : ['Boundary fencing']
          },
          facilities: {
            floodlights: editingGround.hasFloodlights === true,
            pavilion: editingGround.hasPavilion === true,
            dressingRooms: editingGround.hasDressingRooms === true,
            washrooms: editingGround.hasWashrooms === true,
            showers: editingGround.hasShowers === true,
            drinkingWater: editingGround.hasDrinkingWater === true,
            firstAid: editingGround.hasFirstAid === true,
            parkingTwoWheeler: editingGround.hasParkingTwoWheeler === true,
            parkingFourWheeler: editingGround.hasParkingFourWheeler === true,
            refreshments: editingGround.hasRefreshments === true,
            seatingCapacity: editingGround.seatingCapacity?.toString() || '200',
            practiceNets: editingGround.hasPracticeNets === true,
            scoreboard: (editingGround.scoreboardType as any) || 'Digital',
            liveStreaming: editingGround.hasLiveStreaming === true
          },
          specs: {
            groundDimensions: editingGround.groundDimensions || '',
            pitchLength: editingGround.pitchLength || '22 yards',
            oversPerSlot: editingGround.oversPerSlot || '20',
            ballType: (editingGround.ballType as any) || 'Tennis',
            safetyNets: editingGround.hasSafetyNets === true,
            rainCovers: editingGround.hasRainCovers === true,
            groundStaffAvailable: editingGround.hasGroundStaffAvailable === true
          }
        }
      });
    } else {
      // Reset form for create mode
      setFormData({
        name: '',
        description: '',
        location: '',
        mapsUrl: '',
        capacity: '',
        pricePerHour: '',
        imageUrl: '',
        isActive: true,
        details: {
          basic: {
            groundType: 'Cricket',
            groundSize: '',
            boundaryDimensions: '',
            pitchType: ['Turf'],
            numberOfPitches: '1'
          },
          cricket: {
            turfType: 'Natural Grass',
            pitchQuality: 'Medium',
            grassType: 'Bermuda',
            drainageSystem: true,
            lightingQuality: 'Standard',
            seatingTypes: ['Basic seating'],
            mediaFacilities: [] as string[],
            practiceFacilities: ['Practice nets'],
            safetyFeatures: ['Boundary fencing']
          },
          facilities: {
            floodlights: true,
            pavilion: true,
            dressingRooms: true,
            washrooms: true,
            showers: true,
            drinkingWater: true,
            firstAid: true,
            parkingTwoWheeler: true,
            parkingFourWheeler: true,
            refreshments: true,
            seatingCapacity: '200',
            practiceNets: true,
            scoreboard: 'Digital',
            liveStreaming: false
          },
          specs: {
            groundDimensions: '',
            pitchLength: '22 yards',
            oversPerSlot: '20',
            ballType: 'Tennis',
            safetyNets: true,
            rainCovers: false,
            groundStaffAvailable: true
          }
        }
      });
    }
  }, [editingGround]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDetailsChange = (section: keyof typeof formData.details, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [section]: {
          ...prev.details[section],
          [field]: value
        }
      }
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setGroundUploading(true);
    setGroundUploadError('');

    try {
      const uploadedUrl = await HomepageApiService.uploadImage(token, file);
      handleInputChange('imageUrl', uploadedUrl);
    } catch (error: any) {
      setGroundUploadError(error.message || 'Upload failed');
    } finally {
      setGroundUploading(false);
    }
  };

  const handleUrlUpload = async (url: string) => {
    if (!token) return;

    setGroundUploading(true);
    setGroundUploadError('');

    try {
      const uploadedUrl = await HomepageApiService.uploadFromUrl(token, url);
      handleInputChange('imageUrl', uploadedUrl);
    } catch (error: any) {
      setGroundUploadError(error.message || 'URL upload failed');
    } finally {
      setGroundUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        location: formData.location,
        capacity: formData.capacity ? Number(formData.capacity) : null,
        pricePerHour: formData.pricePerHour ? Number(formData.pricePerHour) : 0,

        imageUrl: formData.imageUrl || '',
        isActive: formData.isActive,
        // Map nested form data to flat structure for backend
        groundType: formData.details.basic.groundType,
        groundSize: formData.details.basic.groundSize,
        boundaryDimensions: formData.details.basic.boundaryDimensions,
        numberOfPitches: Number(formData.details.basic.numberOfPitches),
        pitchType: formData.details.basic.pitchType.join(', '),
        turfType: formData.details.cricket.turfType,
        pitchQuality: formData.details.cricket.pitchQuality,
        grassType: formData.details.cricket.grassType,

        lightingQuality: formData.details.cricket.lightingQuality,
        hasFloodlights: !!formData.details.facilities.floodlights,
        hasPavilion: !!formData.details.facilities.pavilion,
        hasDressingRooms: !!formData.details.facilities.dressingRooms,
        hasWashrooms: !!formData.details.facilities.washrooms,
        hasShowers: !!formData.details.facilities.showers,
        hasDrinkingWater: !!formData.details.facilities.drinkingWater,
        hasFirstAid: !!formData.details.facilities.firstAid,
        hasParkingTwoWheeler: !!formData.details.facilities.parkingTwoWheeler,
        hasParkingFourWheeler: !!formData.details.facilities.parkingFourWheeler,
        hasRefreshments: !!formData.details.facilities.refreshments,
        hasPracticeNets: !!formData.details.facilities.practiceNets,
        scoreboardType: formData.details.facilities.scoreboard,
        hasLiveStreaming: !!formData.details.facilities.liveStreaming,
        seatingCapacity: Number(formData.details.facilities.seatingCapacity),
        groundDimensions: formData.details.specs.groundDimensions,
        pitchLength: formData.details.specs.pitchLength,
        oversPerSlot: formData.details.specs.oversPerSlot,
        ballType: formData.details.specs.ballType,
        hasSafetyNets: !!formData.details.specs.safetyNets,
        hasRainCovers: !!formData.details.specs.rainCovers,
        hasGroundStaffAvailable: !!formData.details.specs.groundStaffAvailable,
        drainageSystem: !!formData.details.cricket.drainageSystem

      };

      if (editingGround) {
        // Update existing ground
        await axios.put(`http://localhost:8080/api/admin/grounds/edit/${editingGround.id}`, payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Ground updated successfully!');
      } else {
        // Create new ground
        await axios.post('http://localhost:8080/api/admin/grounds/create', payload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        toast.success('Ground created successfully!');
      }

      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || `Failed to ${editingGround ? 'update' : 'create'} ground`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto relative">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg z-10">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">{editingGround ? 'Edit Ground' : 'Create Ground'}</h3>
            <button
              onClick={onClose}
              className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 focus:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200"
              aria-label="Close modal"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-6">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ground Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange('capacity', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price Per Hour (₹)</label>
              <input
                type="number"
                value={formData.pricePerHour}
                onChange={(e) => handleInputChange('pricePerHour', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Ground Image</label>
            <div className="mt-2 space-y-3">
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                  <Upload className="w-4 h-4 mr-1" />
                  Upload File
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={groundUploading}
                  />
                </label>
                <span className="text-sm text-gray-500">or</span>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL"
                    className="border rounded-md px-3 py-2 flex-1"
                    value={groundUrlInput}
                    onChange={(e) => setGroundUrlInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUrlUpload(groundUrlInput);
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      handleUrlUpload(groundUrlInput);
                    }}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={groundUploading}
                  >
                    <Link className="w-4 h-4 mr-1" />
                    Fetch
                  </button>
                </div>
              </div>

              {groundUploading && <div className="text-sm text-blue-600">Uploading...</div>}
              {groundUploadError && <div className="text-sm text-red-600">{groundUploadError}</div>}
              {formData.imageUrl && (
                <div className="mt-2">
                  <img
                    src={formData.imageUrl}
                    alt="Ground preview"
                    className="w-20 h-20 object-cover rounded-md border mt-1"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Specifications Section */}
          <SpecificationsSection
            title="Ground Specifications"
            fields={[
              {
                label: 'Ground Type',
                value: formData.details.basic.groundType,
                onChange: (value) => handleDetailsChange('basic', 'groundType', value),
                description: 'The primary sport or activity this ground is designed for',
                type: 'select',
                options: [
                  { value: 'Cricket', label: 'Cricket' },
                  { value: 'Football', label: 'Football' },
                  { value: 'Hockey', label: 'Hockey' },
                  { value: 'Multi-purpose', label: 'Multi-purpose' }
                ]
              },
              {
                label: 'Ground Size',
                value: formData.details.basic.groundSize,
                onChange: (value) => handleDetailsChange('basic', 'groundSize', value),
                description: 'The overall size of the ground',
                type: 'text'
              },
              {
                label: 'Boundary Dimensions',
                value: formData.details.basic.boundaryDimensions,
                onChange: (value) => handleDetailsChange('basic', 'boundaryDimensions', value),
                description: 'Distance from pitch center to boundary',
                type: 'text'
              },
              {
                label: 'Number of Pitches',
                value: formData.details.basic.numberOfPitches,
                onChange: (value) => handleDetailsChange('basic', 'numberOfPitches', value),
                description: 'Total number of playable pitches on this ground',
                type: 'number'
              }
            ]}
          />

          {/* Facilities */}
          <SpecificationsSection
            title="Facilities"
            fields={[
              {
                label: 'Floodlights',
                value: formData.details.facilities.floodlights,
                onChange: (value) => handleDetailsChange('facilities', 'floodlights', value),
                description: 'Availability of floodlights for evening matches',
                type: 'checkbox'
              },
              {
                label: 'Pavilion',
                value: formData.details.facilities.pavilion,
                onChange: (value) => handleDetailsChange('facilities', 'pavilion', value),
                description: 'Dedicated pavilion building for players and officials',
                type: 'checkbox'
              },
              {
                label: 'Dressing Rooms',
                value: formData.details.facilities.dressingRooms,
                onChange: (value) => handleDetailsChange('facilities', 'dressingRooms', value),
                description: 'Separate changing rooms for teams',
                type: 'checkbox'
              },
              {
                label: 'Washrooms',
                value: formData.details.facilities.washrooms,
                onChange: (value) => handleDetailsChange('facilities', 'washrooms', value),
                description: 'Clean toilet facilities',
                type: 'checkbox'
              },
              {
                label: 'Showers',
                value: formData.details.facilities.showers,
                onChange: (value) => handleDetailsChange('facilities', 'showers', value),
                description: 'Shower facilities for players',
                type: 'checkbox'
              },
              {
                label: 'Drinking Water',
                value: formData.details.facilities.drinkingWater,
                onChange: (value) => handleDetailsChange('facilities', 'drinkingWater', value),
                description: 'Clean drinking water availability',
                type: 'checkbox'
              },
              {
                label: 'First Aid',
                value: formData.details.facilities.firstAid,
                onChange: (value) => handleDetailsChange('facilities', 'firstAid', value),
                description: 'First aid kit and trained personnel',
                type: 'checkbox'
              },
              {
                label: 'Parking (Two Wheeler)',
                value: formData.details.facilities.parkingTwoWheeler,
                onChange: (value) => handleDetailsChange('facilities', 'parkingTwoWheeler', value),
                description: 'Parking space for motorcycles and scooters',
                type: 'checkbox'
              },
              {
                label: 'Parking (Four Wheeler)',
                value: formData.details.facilities.parkingFourWheeler,
                onChange: (value) => handleDetailsChange('facilities', 'parkingFourWheeler', value),
                description: 'Parking space for cars and other vehicles',
                type: 'checkbox'
              },
              {
                label: 'Refreshments',
                value: formData.details.facilities.refreshments,
                onChange: (value) => handleDetailsChange('facilities', 'refreshments', value),
                description: 'Food and beverage availability',
                type: 'checkbox'
              },
              {
                label: 'Practice Nets',
                value: formData.details.facilities.practiceNets,
                onChange: (value) => handleDetailsChange('facilities', 'practiceNets', value),
                description: 'Additional practice nets available',
                type: 'checkbox'
              },
              {
                label: 'Live Streaming',
                value: formData.details.facilities.liveStreaming,
                onChange: (value) => handleDetailsChange('facilities', 'liveStreaming', value),
                description: 'Capability for live streaming matches',
                type: 'checkbox'
              },
              {
                label: 'Seating Capacity',
                value: formData.details.facilities.seatingCapacity,
                onChange: (value) => handleDetailsChange('facilities', 'seatingCapacity', value),
                description: 'Total number of spectator seats available',
                type: 'number'
              },
              {
                label: 'Scoreboard Type',
                value: formData.details.facilities.scoreboard,
                onChange: (value) => handleDetailsChange('facilities', 'scoreboard', value),
                description: 'Type of scoreboard used (Manual, Digital)',
                type: 'select',
                options: [
                  { value: 'Manual', label: 'Manual' },
                  { value: 'Digital', label: 'Digital' }
                ]
              }
            ]}
          />

          {/* Specs */}
          <SpecificationsSection
            title="Technical Specifications"
            fields={[
              {
                label: 'Ground Dimensions',
                value: formData.details.specs.groundDimensions,
                onChange: (value) => handleDetailsChange('specs', 'groundDimensions', value),
                description: 'Overall dimensions of the ground (length x width)',
                type: 'text'
              },
              {
                label: 'Pitch Length',
                value: formData.details.specs.pitchLength,
                onChange: (value) => handleDetailsChange('specs', 'pitchLength', value),
                description: 'Length of the cricket pitch',
                type: 'text'
              },
              {
                label: 'Overs Per Slot',
                value: formData.details.specs.oversPerSlot,
                onChange: (value) => handleDetailsChange('specs', 'oversPerSlot', value),
                description: 'Number of overs allowed per booking slot',
                type: 'text'
              },
              {
                label: 'Ball Type',
                value: formData.details.specs.ballType,
                onChange: (value) => handleDetailsChange('specs', 'ballType', value),
                description: 'Type of ball used for matches',
                type: 'select',
                options: [
                  { value: 'Tennis', label: 'Tennis' },
                  { value: 'Leather', label: 'Leather' },
                  { value: 'Both', label: 'Both' }
                ]
              },
              {
                label: 'Safety Nets',
                value: formData.details.specs.safetyNets,
                onChange: (value) => handleDetailsChange('specs', 'safetyNets', value),
                description: 'Protective netting around the ground',
                type: 'checkbox'
              },
              {
                label: 'Rain Covers',
                value: formData.details.specs.rainCovers,
                onChange: (value) => handleDetailsChange('specs', 'rainCovers', value),
                description: 'Weather protection covers for the pitch',
                type: 'checkbox'
              },
              {
                label: 'Ground Staff Available',
                value: formData.details.specs.groundStaffAvailable,
                onChange: (value) => handleDetailsChange('specs', 'groundStaffAvailable', value),
                description: 'Dedicated ground maintenance staff available',
                type: 'checkbox'
              }
            ]}
          />

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {editingGround ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {editingGround ? 'Update Ground' : 'Create Ground'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GroundCreateModal;
