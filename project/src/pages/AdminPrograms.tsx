import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import ProgramCreateModal from '../components/ProgramCreateModal';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { config } from '../config/env';

interface AvailableProgram {
    id: number;
    programName: string;
    description: string;
    duration: string;
    price: number;
    level: string;
    category: string;
    icon?: string;
    ageGroup?: string;
    focusAreas?: string;
    format?: string;
    isSuggested?: boolean;
    isActive: boolean;
    coaches: number[];
}

const AdminPrograms: React.FC = () => {
    const [programs, setPrograms] = useState<AvailableProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingProgram, setEditingProgram] = useState<AvailableProgram | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingProgram, setDeletingProgram] = useState<AvailableProgram | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const { token, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!token || !isAuthenticated) return;
        fetchPrograms();
    }, [token, isAuthenticated]);

    // Handle URL-based actions
    useEffect(() => {
        const pathParts = location.pathname.split('/');
        const action = pathParts[3];
        const id = pathParts[4];

        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setEditingProgram(null);
        setDeletingProgram(null);

        if (action === 'create') {
            setShowCreateModal(true);
        } else if (action === 'edit' && id) {
            const program = programs.find(p => p.id === parseInt(id));
            if (program) {
                setEditingProgram(program);
                setShowEditModal(true);
            }
        } else if (action === 'delete' && id) {
            const program = programs.find(p => p.id === parseInt(id));
            if (program) {
                setDeletingProgram(program);
                setShowDeleteModal(true);
            }
        }
    }, [location.pathname, programs]);

    const fetchPrograms = async () => {
        try {
            const response = await axios.get(`${config.api.baseUrl}/api/admin/programs`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPrograms(response.data.data || response.data);
        } catch (err) {
            setError('Failed to fetch programs');
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteProgram = async () => {
        if (!deletingProgram || !token) return;
        setDeleteLoading(true);
        try {
            await axios.delete(`${config.api.baseUrl}/api/admin/programs/delete/${deletingProgram.id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPrograms(programs.filter(program => program.id !== deletingProgram.id));
            handleCloseModal();
            handleSuccess('Program deleted successfully!');
        } catch (error: any) {
            console.error('Failed to delete program:', error);
            const errorMessage = error.response?.data?.message || 'Failed to delete program';
            setError(errorMessage);
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



    const handleEdit = (program: AvailableProgram) => {
        navigate(`/admin/programs/edit/${program.id}`);
    };

    const handleDelete = (program: AvailableProgram) => {
        navigate(`/admin/programs/delete/${program.id}`);
    };

    const handleCreate = () => {
        navigate('/admin/programs/create');
    };

    const handleCloseModal = () => {
        setShowCreateModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setEditingProgram(null);
        setDeletingProgram(null);
        navigate('/admin/programs');
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
                <h1 className="text-3xl font-bold text-gray-900">Programs Management</h1>
                <button
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                    onClick={handleCreate}
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Add Program
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program) => (
                            <div key={program.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center">
                                            {program.icon && <span className="text-xl mr-2">{program.icon}</span>}
                                            <h4 className="text-lg font-semibold text-gray-900">{program.programName}</h4>
                                            {program.isSuggested && <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">Suggested</span>}
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            program.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {program.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Duration:</span>
                                            <span className="ml-1 bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">
                                                {program.duration}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Price:</span>
                                            <span className="ml-1 font-medium text-green-600">₹{program.price}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Level:</span>
                                            <span className="ml-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                {program.level}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-medium">Category:</span>
                                            <span className="ml-1 bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                                                {program.category}
                                            </span>
                                        </div>
                                        {program.ageGroup && (
                                            <div className="flex items-center text-sm text-gray-600">
                                                <span className="font-medium">Age Group:</span>
                                                <span className="ml-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                                                    {program.ageGroup}
                                                </span>
                                            </div>
                                        )}
                                        {program.focusAreas && (
                                            <div className="text-sm text-gray-600">
                                                <span className="font-medium">Focus:</span>
                                                <span className="ml-1">{program.focusAreas}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                            onClick={() => handleEdit(program)}
                                        >
                                            <Edit className="h-4 w-4 mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            className="inline-flex items-center justify-center px-3 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                                            onClick={() => handleDelete(program)}
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

            {programs.length === 0 && !loading && (
                <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                        <Plus className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No programs found</h3>
                    <p className="text-gray-600 mb-6">Get started by adding your first program to the system.</p>
                    <button
                        onClick={handleCreate}
                        className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                    >
                        <Plus className="h-5 w-5 mr-2" />
                        Add First Program
                    </button>
                </div>
            )}

            {/* Create Program Modal */}
            <ProgramCreateModal
                isOpen={showCreateModal}
                onClose={handleCloseModal}
                onSuccess={(message: string) => {
                    handleCloseModal();
                    fetchPrograms();
                    handleSuccess(message);
                }}
            />

            {/* Edit Program Modal */}
            <ProgramCreateModal
                isOpen={showEditModal}
                onClose={handleCloseModal}
                onSuccess={(message: string) => {
                    handleCloseModal();
                    fetchPrograms();
                    handleSuccess(message);
                }}
                editingProgram={editingProgram}
            />

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationDialog
                isOpen={showDeleteModal}
                onClose={handleCloseModal}
                onConfirm={confirmDeleteProgram}
                title="Delete Program"
                message={`Are you sure you want to delete "${deletingProgram?.programName}"? This action cannot be undone.`}
                loading={deleteLoading}
            />
        </div>
    );
};

export default AdminPrograms;
