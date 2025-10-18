import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import CoachCreateModal from '../components/CoachCreateModal';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

import { config } from '../config/env';
import { UPLOAD_URL } from '../services/homepageApiService';

// Build absolute URLs for backend-served uploads
const API_ORIGIN = new URL(UPLOAD_URL).origin;
const toAbsolute = (u: string) => {
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return u.startsWith('/') ? `${API_ORIGIN}${u}` : `${API_ORIGIN}/${u}`;
};

interface ExpertCoach {
    id: number;
    name: string;
    email: string;
    phone: string;
    specialization: string;
    experienceYears: number;
    certifications: string;
    bio: string;
    profileImageUrl: string;
    hourlyRate: number;
    isAvailable: boolean;
    specifications: string;
    programs: number[];
}

const AdminCoaches: React.FC = () => {
    const [coaches, setCoaches] = useState<ExpertCoach[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingCoach, setEditingCoach] = useState<ExpertCoach | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingCoach, setDeletingCoach] = useState<ExpertCoach | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [expandedCoaches, setExpandedCoaches] = useState<Set<number>>(new Set());

    const { token, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    useEffect(() => {
        if (!token || !isAuthenticated) return;
        fetchCoaches();
    }, [token, isAuthenticated]);

    // Handle URL-based actions
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const action = pathParts[3]; // /admin/coaches/[action]
        const id = pathParts[4]; // /admin/coaches/[action]/[id]

        // Reset all modals first
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setEditingCoach(null);
        setDeletingCoach(null);

        if (action === 'create') {
            setShowCreateModal(true);
        } else if (action === 'edit' && id) {
            const coach = coaches.find(c => c.id === parseInt(id));
            if (coach) {
                setEditingCoach(coach);
                setShowEditModal(true);
            }
        } else if (action === 'delete' && id) {
            const coach = coaches.find(c => c.id === parseInt(id));
            if (coach) {
                setDeletingCoach(coach);
                setShowDeleteModal(true);
            }
        }
    }, [location.pathname, coaches]);

    const fetchCoaches = async () => {
        try {
            const response = await axios.get(`${config.api.baseUrl}/api/admin/coaches`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoaches(response.data.data || []);
        } catch (err) {
            setError('Failed to fetch coaches');
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteCoach = async () => {
        if (!deletingCoach || !token) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`${config.api.baseUrl}/api/admin/coaches/delete/${deletingCoach.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCoaches(coaches.filter(coach => coach.id !== deletingCoach.id));
            handleCloseModal();
            handleSuccess('Coach deleted successfully!');
        } catch (error) {
            console.error('Failed to delete coach:', error);
            setError('Failed to delete coach');
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



    const handleEdit = (coach: ExpertCoach) => {
        navigate(`/admin/coaches/edit/${coach.id}`);
    };

    const handleDelete = (coach: ExpertCoach) => {
        navigate(`/admin/coaches/delete/${coach.id}`);
    };

    const handleCreate = () => {
        navigate('/admin/coaches/create');
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setEditingCoach(null);
        setDeletingCoach(null);
        navigate('/admin/coaches');
    };



    if (error && !successMessage) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Coaches Management</h1>
                <button
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={handleCreate}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Coach
                </button>
            </div>



            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {coaches.map((coach) => (
                            <div key={coach.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center">
                                            {coach.profileImageUrl ? (
                                                <img
                                                    src={toAbsolute(coach.profileImageUrl)}
                                                    alt={coach.name}
                                                    className="w-10 h-10 object-cover rounded-full mr-3"
                                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                                                    <span className="text-sm text-gray-500">{coach.name.charAt(0)}</span>
                                                </div>
                                            )}
                                            <h4 className="text-lg font-semibold text-gray-900">{coach.name}</h4>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            coach.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {coach.isAvailable ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Email:</span>
                                            <span className="ml-1 truncate">{coach.email}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Specialization:</span>
                                            <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                {coach.specialization}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Experience:</span>
                                            <span className="ml-1">{coach.experienceYears} years</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Rate:</span>
                                            <span className="ml-1 font-medium text-green-600">₹{coach.hourlyRate}/hour</span>
                                        </div>
                                        {(() => {
                                            let allFeatures: string[] = [];
                                            
                                            // Try to get features from specifications first
                                            if (coach.specifications) {
                                                try {
                                                    const specs = JSON.parse(coach.specifications);
                                                    allFeatures = Object.values(specs).flat() as string[];
                                                } catch {
                                                    // If parsing fails, ignore
                                                }
                                            }
                                            
                                            // If no specifications, use certifications as fallback
                                            if (allFeatures.length === 0 && coach.certifications) {
                                                allFeatures = coach.certifications.split(',').map(cert => cert.trim()).filter(cert => cert);
                                            }
                                            
                                            return allFeatures.length > 0 && (
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-medium">Features:</span>
                                                    <div className="mt-1 overflow-x-auto">
                                                        <div className="flex gap-1" style={{minWidth: 'max-content'}}>
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
                                            );
                                        })()}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                            onClick={() => handleEdit(coach)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            className="inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                            onClick={() => handleDelete(coach)}
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

            {coaches.length === 0 && !loading && (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No coaches found</h3>
                    <p className="text-gray-600 mb-6">Get started by adding your first coach to the system.</p>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add First Coach
                    </button>
                </div>
            )}

            {/* Create Coach Modal */}
            <CoachCreateModal
                isOpen={showCreateModal}
                onClose={handleCloseModal}
                onSuccess={(message: string) => {
                    handleCloseModal();
                    fetchCoaches();
                    handleSuccess(message);
                }}
            />

            {/* Edit Coach Modal */}
            <CoachCreateModal
                isOpen={showEditModal}
                onClose={handleCloseModal}
                onSuccess={(message: string) => {
                    handleCloseModal();
                    fetchCoaches();
                    handleSuccess(message);
                }}
                editingCoach={editingCoach}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationDialog
                isOpen={showDeleteModal}
                onClose={handleCloseModal}
                onConfirm={confirmDeleteCoach}
                title="Delete Coach"
                message={`Are you sure you want to delete "${deletingCoach?.name}"? This action cannot be undone.`}
                loading={deleteLoading}
            />


        </div>
    );
};

export default AdminCoaches;
