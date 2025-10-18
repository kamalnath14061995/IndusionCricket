import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import EnhancedNetCreateModal from '../components/EnhancedNetCreateModal';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

interface Net {
  id?: number;
  name: string;
  netNumber: string;
  description: string;
  imageUrl?: string;
  capacity: number;
  pricePerHour: number;
  isAvailable: boolean;
  groundId?: number;
  locationType?: string;
  surfaceType?: string;
  netLength?: number;
  netWidth?: number;
  netHeight?: number;
  playerCapacityPerNet?: number;
  hasBowlingMachine?: boolean;
  bowlingMachineSpeedRange?: string;
  hasFloodlights?: boolean;
  floodlightLuxRating?: number;
  hasProtectiveNetting?: boolean;
  safetyGearAvailable?: string[];
  equipmentRental?: string[];
  hasWashrooms?: boolean;
  hasChangingRooms?: boolean;
  hasDrinkingWater?: boolean;
  hasSeatingArea?: boolean;
  hasParking?: boolean;
  hasFirstAid?: boolean;
  coachingAvailable?: boolean;
  coachingPricePerHour?: number;
  hasCctv?: boolean;
  cctvRecordingAvailable?: boolean;
  slotDurationMinutes?: number;
  individualBookingAllowed?: boolean;
  groupBookingAllowed?: boolean;
  maxGroupSize?: number;
  pricingPerNet?: number;
  pricingPerPlayer?: number;
  membershipDiscountPercentage?: number;
  features?: string[];
}

const AdminNets: React.FC = () => {
  const { token } = useAuth();
  const [nets, setNets] = useState<Net[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNet, setEditingNet] = useState<Net | null>(null);
  const [grounds, setGrounds] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingNet, setDeletingNet] = useState<Net | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [expandedNets, setExpandedNets] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchNets();
    fetchGrounds();
  }, []);

  const fetchGrounds = async () => {
    if (!token) return;
    try {
      const response = await axios.get('http://localhost:8080/api/admin/grounds', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGrounds(response.data);
    } catch (error) {
      console.error('Failed to fetch grounds:', error);
    }
  };

  const fetchNets = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/admin/nets', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNets(response.data);
    } catch (error) {
      console.error('Failed to fetch nets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNet = async (id: number) => {
    if (!token) return;
    try {
      await axios.delete(`http://localhost:8080/api/admin/nets/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNets(nets.filter(net => net.id !== id));
    } catch (error) {
      console.error('Failed to delete net:', error);
    }
  };

  const confirmDeleteNet = async () => {
    if (!deletingNet || !token) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/admin/nets/delete/${deletingNet.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNets(nets.filter(net => net.id !== deletingNet.id));
      setShowDeleteModal(false);
      setDeletingNet(null);
    } catch (error) {
      console.error('Failed to delete net:', error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    if (!token) return;
    try {
      await axios.patch(`http://localhost:8080/api/admin/nets/${id}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNets(nets.map(net =>
        net.id === id ? { ...net, isAvailable: !currentStatus } : net
      ));
    } catch (error) {
      console.error('Failed to update net status:', error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Nets Management</h3>
        <button
          className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          onClick={() => {
            setShowCreateModal(true);
            setEditingNet(null);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Net
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nets.map((net) => (
              <div key={net.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-green-600 mr-2" />
                      <h4 className="text-lg font-semibold text-gray-900">{net.name}</h4>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      net.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {net.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{net.description}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Net Number:</span>
                    <span className="ml-1">{net.netNumber}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Capacity:</span>
                    <span className="ml-1">{net.capacity} players</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Price:</span>
                    <span className="ml-1">₹{net.pricePerHour}/hour</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">All Net Details:</span>
                    <div className="mt-1 text-xs">
                      <div>Location: {net.locationType || 'Outdoor'}</div>
                      <div>Surface: {net.surfaceType || 'Turf'}</div>
                      <div>Bowling Machine: {net.hasBowlingMachine ? 'Yes' : 'No'}</div>
                      <div>Floodlights: {net.hasFloodlights ? 'Yes' : 'No'}</div>
                      <div>Protective Netting: {net.hasProtectiveNetting ? 'Yes' : 'No'}</div>
                      <div>Washrooms: {net.hasWashrooms ? 'Yes' : 'No'}</div>
                      <div>Changing Rooms: {net.hasChangingRooms ? 'Yes' : 'No'}</div>
                      <div>Drinking Water: {net.hasDrinkingWater ? 'Yes' : 'No'}</div>
                      <div>Seating Area: {net.hasSeatingArea ? 'Yes' : 'No'}</div>
                      <div>Parking: {net.hasParking ? 'Yes' : 'No'}</div>
                      <div>First Aid: {net.hasFirstAid ? 'Yes' : 'No'}</div>
                      <div>Coaching: {net.coachingAvailable ? 'Yes' : 'No'}</div>
                      <div>CCTV: {net.hasCctv ? 'Yes' : 'No'}</div>
                      {net.netLength && <div>Length: {net.netLength}m</div>}
                      {net.netWidth && <div>Width: {net.netWidth}m</div>}
                      {net.netHeight && <div>Height: {net.netHeight}m</div>}
                      {net.maxGroupSize && <div>Max Group: {net.maxGroupSize}</div>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                    onClick={() => {
                      setEditingNet(net);
                      setShowCreateModal(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                  <button
                    className={`inline-flex items-center justify-center px-3 py-2 text-white text-sm rounded ${
                      net.isAvailable ? 'bg-orange-600 hover:bg-orange-700' : 'bg-green-600 hover:bg-green-700'
                    }`}
                    onClick={() => handleToggleStatus(net.id!, net.isAvailable)}
                    title={net.isAvailable ? 'Mark as Unavailable' : 'Mark as Available'}
                  >
                    {net.isAvailable ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    className="inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    onClick={() => {
                      setDeletingNet(net);
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

      {nets.length === 0 && !loading && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No nets found</h3>
          <p className="text-gray-600">Get started by adding your first net.</p>
        </div>
      )}

      {/* Enhanced Net Create Modal reused from Admin with full features/specs */}
      <EnhancedNetCreateModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={() => {
          fetchNets();
          setShowCreateModal(false);
          setEditingNet(null);
        }}
        grounds={grounds}
        mode={editingNet ? 'edit' : 'create'}
        netId={editingNet?.id}
        useManagement
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationDialog
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingNet(null);
        }}
        onConfirm={confirmDeleteNet}
        title="Delete Net"
        message={`Are you sure you want to delete "${deletingNet?.name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </div>
  );
};

export default AdminNets;
