import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit, Trash2, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import GroundCreateModal from '../components/GroundCreateModal.tsx';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { Ground } from '../types/ground';

const AdminGrounds: React.FC = () => {
  const { token } = useAuth();
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(false);
  const [showGroundEditModal, setShowGroundEditModal] = useState(false);
  const [editingGround, setEditingGround] = useState<Ground | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingGround, setDeletingGround] = useState<Ground | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [expandedGrounds, setExpandedGrounds] = useState<Set<number>>(new Set());

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [_formData, _setFormData] = useState({
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
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/grounds/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrounds(response.data);
    } catch (error) {
      console.error('Failed to fetch grounds:', error);
    } finally {
      setLoading(false);
    }
  };

  // Unused delete handler - keeping for potential future use
  // Removed unused _handleDeleteGround function

  const confirmDeleteGround = async () => {
    if (!deletingGround || !token) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/admin/grounds/delete/${deletingGround.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrounds(grounds.filter(ground => ground.id !== deletingGround.id));
      setShowDeleteModal(false);
      setDeletingGround(null);
      handleSuccess('Ground deleted successfully!');
    } catch (error) {
      console.error('Failed to delete ground:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="p-6">
      {successMessage && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-b-md shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="block sm:inline font-medium">{successMessage}</span>
            <button
              onClick={() => setSuccessMessage('')}
              className="ml-4 text-green-700 hover:text-green-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Grounds Management</h3>
        <button
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={() => setShowCreateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Ground
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grounds.map((ground) => (
              <div key={ground.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="text-lg font-semibold text-gray-900">{ground.name}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ground.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ground.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{ground.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {ground.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Capacity:</span>
                    <span className="ml-1">{ground.capacity} players</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Price:</span>
                    <span className="ml-1">₹{ground.pricePerHour}/hour</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="mb-2">
                      <span className="font-medium text-blue-800">Basic Ground Specifications:</span>
                      <div className="mt-1 text-xs pl-2">
                        <div>Ground Type: {ground.groundType || 'Cricket'}</div>
                        <div>Ground Size: {ground.groundSize || 'Not specified'}</div>
                        <div>Boundary Dimensions: {ground.boundaryDimensions || 'Not specified'}</div>
                        <div>Number of Pitches: {ground.numberOfPitches || 1}</div>
                        <div>Pitch Type: {ground.pitchType || 'Not specified'}</div>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="font-medium text-green-800">Cricket Specifications:</span>
                      <div className="mt-1 text-xs pl-2">
                        <div>Turf Type: {ground.turfType || 'Natural Grass'}</div>
                        <div>Pitch Quality: {ground.pitchQuality || 'Medium'}</div>
                        <div>Grass Type: {ground.grassType || 'Bermuda'}</div>
                        <div>Drainage System: {ground.drainageSystem ? 'Yes' : 'No'}</div>
                        <div>Lighting Quality: {ground.lightingQuality || 'Standard'}</div>
                        <div>Seating Types: {ground.seatingTypes || 'Not specified'}</div>
                        <div>Media Facilities: {ground.mediaFacilities || 'Not specified'}</div>
                        <div>Practice Facilities: {ground.practiceFacilities || 'Not specified'}</div>
                        <div>Safety Features: {ground.safetyFeatures || 'Not specified'}</div>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="font-medium text-purple-800">Facilities:</span>
                      <div className="mt-1 text-xs pl-2">
                        <div>Floodlights: {ground.hasFloodlights ? 'Yes' : 'No'}</div>
                        <div>Pavilion: {ground.hasPavilion ? 'Yes' : 'No'}</div>
                        <div>Dressing Rooms: {ground.hasDressingRooms ? 'Yes' : 'No'}</div>
                        <div>Washrooms: {ground.hasWashrooms ? 'Yes' : 'No'}</div>
                        <div>Showers: {ground.hasShowers ? 'Yes' : 'No'}</div>
                        <div>Drinking Water: {ground.hasDrinkingWater ? 'Yes' : 'No'}</div>
                        <div>First Aid: {ground.hasFirstAid ? 'Yes' : 'No'}</div>
                        <div>2-Wheeler Parking: {ground.hasParkingTwoWheeler ? 'Yes' : 'No'}</div>
                        <div>4-Wheeler Parking: {ground.hasParkingFourWheeler ? 'Yes' : 'No'}</div>
                        <div>Refreshments: {ground.hasRefreshments ? 'Yes' : 'No'}</div>
                        <div>Practice Nets: {ground.hasPracticeNets ? 'Yes' : 'No'}</div>
                        <div>Scoreboard: {ground.scoreboardType || 'Manual'}</div>
                        <div>Live Streaming: {ground.hasLiveStreaming ? 'Yes' : 'No'}</div>
                        <div>Seating Capacity: {ground.seatingCapacity || 'Not specified'}</div>
                      </div>
                    </div>
                    
                    <div className="mb-2">
                      <span className="font-medium text-orange-800">Specs:</span>
                      <div className="mt-1 text-xs pl-2">
                        <div>Ground Dimensions: {ground.groundDimensions || 'Not specified'}</div>
                        <div>Pitch Length: {ground.pitchLength || '22 yards'}</div>
                        <div>Overs Per Slot: {ground.oversPerSlot || '20'}</div>
                        <div>Ball Type: {ground.ballType || 'Tennis'}</div>
                        <div>Safety Nets: {ground.hasSafetyNets ? 'Yes' : 'No'}</div>
                        <div>Rain Covers: {ground.hasRainCovers ? 'Yes' : 'No'}</div>
                        <div>Ground Staff Available: {ground.hasGroundStaffAvailable ? 'Yes' : 'No'}</div>
                      </div>
                    </div>
                    
                    <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                      <div className="font-medium">Debug Info:</div>
                      <div>Ground ID: {ground.id}</div>
                      <div>All fields: {JSON.stringify(ground, null, 2).substring(0, 200)}...</div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    onClick={() => {
                      setEditingGround(ground);
                      setShowGroundEditModal(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    className="inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    onClick={() => {
                      setDeletingGround(ground);
setShowDeleteModal(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </>
      )}

      {grounds.length === 0 && !loading && (
        <div className="text-center py-12">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No grounds found</h3>
          <p className="text-gray-600">Get started by adding your first ground.</p>
        </div>
      )}

      {/* Create Ground Modal */}
      <GroundCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(message: string) => {
          setShowCreateModal(false);
          fetchGrounds();
          handleSuccess(message);
        }}
      />

      {/* Edit Ground Modal */}
      <GroundCreateModal
        isOpen={showGroundEditModal}
        onClose={() => {
          setShowGroundEditModal(false);
          setEditingGround(null);
        }}
        onSuccess={(message: string) => {
          setShowGroundEditModal(false);
          setEditingGround(null);
          fetchGrounds();
          handleSuccess(message);
        }}
        editingGround={editingGround}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingGround(null);
        }}
        onConfirm={confirmDeleteGround}
        title="Delete Ground"
        message={`Are you sure you want to delete "${deletingGround?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminGrounds;
