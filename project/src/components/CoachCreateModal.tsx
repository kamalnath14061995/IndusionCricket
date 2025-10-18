import React, { useState, useEffect } from 'react';
import { X, Save, Upload, Link, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { HomepageApiService, UPLOAD_URL } from '../services/homepageApiService';
import axios from 'axios';
import { config } from '../config/env';

// Build absolute URLs for backend-served uploads
const API_ORIGIN = new URL(UPLOAD_URL).origin;
const toAbsolute = (u: string) => {
    if (!u) return '';
    if (u.startsWith('http://') || u.startsWith('https://')) return u;
    return u.startsWith('/') ? `${API_ORIGIN}${u}` : `${API_ORIGIN}/${u}`;
};

interface SpecificationCategory {
    icon: string;
    features: string[];
}

interface CoachSpecifications {
    categories: Record<string, SpecificationCategory>;
}

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

interface CoachCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    editingCoach?: ExpertCoach | null;
}

const CoachCreateModal: React.FC<CoachCreateModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    editingCoach
}) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [urlInput, setUrlInput] = useState('');

    const [specifications, setSpecifications] = useState<Record<string, SpecificationCategory>>({});
    const [selectedFeatures, setSelectedFeatures] = useState<Record<string, string[]>>({});

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        specialization: '',
        experienceYears: 0,
        certifications: '',
        bio: '',
        profileImageUrl: '',
        hourlyRate: 0,
        isAvailable: true,
        specifications: '',
        programIds: [] as number[]
    });

    useEffect(() => {
        fetchSpecifications();
    }, [token]);

    useEffect(() => {
        if (editingCoach) {
            const existingSpecs = editingCoach.specifications ? JSON.parse(editingCoach.specifications) : {};
            setSelectedFeatures(existingSpecs);
            setFormData({
                name: editingCoach.name,
                email: editingCoach.email,
                phone: editingCoach.phone,
                specialization: editingCoach.specialization,
                experienceYears: editingCoach.experienceYears,
                certifications: editingCoach.certifications,
                bio: editingCoach.bio,
                profileImageUrl: editingCoach.profileImageUrl,
                hourlyRate: editingCoach.hourlyRate,
                isAvailable: editingCoach.isAvailable,
                specifications: editingCoach.specifications || '',
                programIds: editingCoach.programs
            });
        } else {
            setSelectedFeatures({});
            setFormData({
                name: '',
                email: '',
                phone: '',
                specialization: '',
                experienceYears: 0,
                certifications: '',
                bio: '',
                profileImageUrl: '',
                hourlyRate: 0,
                isAvailable: true,
                specifications: '',
                programIds: []
            });
        }
        setError('');
        setUploadError('');
        setUrlInput('');
    }, [editingCoach, isOpen]);

    const fetchSpecifications = async () => {
        try {
            const response = await axios.get(`${config.api.baseUrl}/api/admin/coaches/specifications`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSpecifications(response.data.data?.categories || {});
        } catch (err) {
            console.error('Failed to fetch specifications:', err);
        }
    };

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleFeatureToggle = (category: string, feature: string) => {
        const categoryFeatures = selectedFeatures[category] || [];
        const newFeatures = categoryFeatures.includes(feature)
            ? categoryFeatures.filter(f => f !== feature)
            : [...categoryFeatures, feature];
        
        const updatedSelection = {
            ...selectedFeatures,
            [category]: newFeatures.length > 0 ? newFeatures : undefined
        };
        
        // Remove empty categories
        Object.keys(updatedSelection).forEach(key => {
            if (!updatedSelection[key] || updatedSelection[key].length === 0) {
                delete updatedSelection[key];
            }
        });
        
        setSelectedFeatures(updatedSelection);
        handleInputChange('specifications', JSON.stringify(updatedSelection));
    };

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !token) return;

        setUploading(true);
        setUploadError('');

        try {
            const uploadedUrl = await HomepageApiService.uploadImage(token, file);
            handleInputChange('profileImageUrl', uploadedUrl);
        } catch (error: any) {
            setUploadError(error.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleUrlUpload = async (url: string) => {
        if (!token) return;

        setUploading(true);
        setUploadError('');

        try {
            const uploadedUrl = await HomepageApiService.uploadFromUrl(token, url);
            handleInputChange('profileImageUrl', uploadedUrl);
        } catch (error: any) {
            setUploadError(error.message || 'URL upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setError('');

        try {
            if (editingCoach) {
                await axios.put(`${config.api.baseUrl}/api/admin/coaches/edit/${editingCoach.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onSuccess('Coach updated successfully!');
            } else {
                await axios.post(`${config.api.baseUrl}/api/admin/coaches/create`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                onSuccess('Coach created successfully!');
            }
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || `Failed to ${editingCoach ? 'update' : 'create'} coach`;
            setError(errorMessage);
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
                        <h3 className="text-lg font-semibold text-gray-900">
                            {editingCoach ? 'Edit Coach' : 'Create Coach'}
                        </h3>
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
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => handleInputChange('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Specialization</label>
                                <input
                                    type="text"
                                    value={formData.specialization}
                                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Experience Years</label>
                                <input
                                    type="number"
                                    value={formData.experienceYears}
                                    onChange={(e) => handleInputChange('experienceYears', parseInt(e.target.value) || 0)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Hourly Rate</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.hourlyRate}
                                    onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Certifications</label>
                            <textarea
                                value={formData.certifications}
                                onChange={(e) => handleInputChange('certifications', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                rows={2}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Bio</label>
                            <textarea
                                value={formData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                rows={3}
                            />
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Profile Image</label>
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
                                            disabled={uploading}
                                        />
                                    </label>
                                    <span className="text-sm text-gray-500">or</span>
                                    <div className="flex-1 flex items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Paste image URL"
                                            className="border rounded-md px-3 py-2 flex-1"
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleUrlUpload(urlInput);
                                                }
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleUrlUpload(urlInput)}
                                            className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                            disabled={uploading}
                                        >
                                            <Link className="w-4 h-4 mr-1" />
                                            Fetch
                                        </button>
                                    </div>
                                </div>

                                {uploading && <div className="text-sm text-blue-600">Uploading...</div>}
                                {uploadError && <div className="text-sm text-red-600">{uploadError}</div>}
                                {formData.profileImageUrl && (
                                    <div className="mt-2">
                                        <div className="text-sm text-green-600">Image uploaded successfully!</div>
                                        <div className="mt-1">
                                            <img
                                                src={toAbsolute(formData.profileImageUrl)}
                                                alt="Coach preview"
                                                className="w-20 h-20 object-cover rounded-md border"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Coach Specifications */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Coach Specifications & Features</label>
                            <div className="max-h-80 overflow-y-auto border border-gray-200 rounded-md p-4 space-y-4">
                                {Object.entries(specifications).map(([category, data]) => (
                                    <div key={category} className="border-b border-gray-100 pb-3 last:border-b-0">
                                        <div className="flex items-center mb-2">
                                            <span className="text-lg mr-2">{data.icon}</span>
                                            <h4 className="text-sm font-semibold text-gray-900">{category}</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                                            {data.features.map((feature) => (
                                                <label key={feature} className="flex items-center p-1 hover:bg-gray-50 rounded cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedFeatures[category]?.includes(feature) || false}
                                                        onChange={() => handleFeatureToggle(category, feature)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="ml-2 text-xs text-gray-700">{feature}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isAvailable}
                                    onChange={(e) => handleInputChange('isAvailable', e.target.checked)}
                                    className="rounded border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Available</span>
                            </label>
                        </div>

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
                                        {editingCoach ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {editingCoach ? 'Update Coach' : 'Create Coach'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CoachCreateModal;