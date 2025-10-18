import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
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

interface ProgramCreateModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (message: string) => void;
    editingProgram?: AvailableProgram | null;
}

const ProgramCreateModal: React.FC<ProgramCreateModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    editingProgram
}) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        programName: '',
        description: '',
        duration: '',
        price: 0,
        level: '',
        category: '',
        icon: '',
        ageGroup: '',
        focusAreas: '',
        format: '',
        isSuggested: false,
        isActive: true,
        coachIds: [] as number[]
    });

    useEffect(() => {
        if (editingProgram) {
            setFormData({
                programName: editingProgram.programName,
                description: editingProgram.description,
                duration: editingProgram.duration,
                price: editingProgram.price,
                level: editingProgram.level,
                category: editingProgram.category,
                icon: editingProgram.icon || '',
                ageGroup: editingProgram.ageGroup || '',
                focusAreas: editingProgram.focusAreas || '',
                format: editingProgram.format || '',
                isSuggested: editingProgram.isSuggested || false,
                isActive: editingProgram.isActive,
                coachIds: editingProgram.coaches
            });
        } else {
            // Reset form for create mode
            setFormData({
                programName: '',
                description: '',
                duration: '',
                price: 0,
                level: '',
                category: '',
                icon: '',
                ageGroup: '',
                focusAreas: '',
                format: '',
                isSuggested: false,
                isActive: true,
                coachIds: []
            });
        }
        setError('');
    }, [editingProgram, isOpen]);

    const handleInputChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        setLoading(true);
        setError('');

        try {
            const payload = {
                ...formData,
                coachIds: formData.coachIds || []
            };

            if (editingProgram) {
                await axios.put(`${config.api.baseUrl}/api/admin/programs/edit/${editingProgram.id}`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                onSuccess('Program updated successfully!');
            } else {
                await axios.post(`${config.api.baseUrl}/api/admin/programs/create`, payload, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                onSuccess('Program created successfully!');
            }
            onClose();
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || `Failed to ${editingProgram ? 'update' : 'create'} program`;
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
                            {editingProgram ? 'Edit Program' : 'Create Program'}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Program Name</label>
                            <input
                                type="text"
                                value={formData.programName}
                                onChange={(e) => handleInputChange('programName', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Duration</label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => handleInputChange('duration', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Level</label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => handleInputChange('level', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select Level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Professional">Professional</option>
                                    <option value="All Levels">All Levels</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => handleInputChange('category', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Youth">Youth</option>
                                    <option value="Elite">Elite</option>
                                    <option value="Individual">Individual</option>
                                    <option value="Specialized">Specialized</option>
                                    <option value="Fitness">Fitness</option>
                                    <option value="Women">Women</option>
                                    <option value="Format-Specific">Format-Specific</option>
                                    <option value="Camps">Camps</option>
                                    <option value="Corporate">Corporate</option>
                                    <option value="Virtual">Virtual</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Icon</label>
                                <select
                                    value={formData.icon}
                                    onChange={(e) => handleInputChange('icon', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select Icon</option>
                                    <option value="👶">👶 Baby</option>
                                    <option value="🧒">🧒 Child</option>
                                    <option value="👦">👦 Boy</option>
                                    <option value="🏆">🏆 Trophy</option>
                                    <option value="🎯">🎯 Target</option>
                                    <option value="🎳">🎳 Bowling</option>
                                    <option value="🏏">🏏 Cricket Bat</option>
                                    <option value="🧤">🧤 Gloves</option>
                                    <option value="💪">💪 Muscle</option>
                                    <option value="👩">👩 Woman</option>
                                    <option value="⚡">⚡ Lightning</option>
                                    <option value="🕰️">🕰️ Clock</option>
                                    <option value="🎉">🎉 Party</option>
                                    <option value="🌞">🌞 Sun</option>
                                    <option value="👔">👔 Shirt</option>
                                    <option value="💻">💻 Laptop</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Age Group</label>
                                <select
                                    value={formData.ageGroup}
                                    onChange={(e) => handleInputChange('ageGroup', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                >
                                    <option value="">Select Age Group</option>
                                    <option value="Kids (5–10 yrs)">Kids (5–10 yrs)</option>
                                    <option value="Youth (11–15 yrs)">Youth (11–15 yrs)</option>
                                    <option value="Teens (16–19 yrs)">Teens (16–19 yrs)</option>
                                    <option value="Elite (19+ / Pro pathway)">Elite (19+ / Pro pathway)</option>
                                    <option value="Girls & Women">Girls & Women</option>
                                    <option value="Adults (Amateur)">Adults (Amateur)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Focus Areas</label>
                            <select
                                value={formData.focusAreas}
                                onChange={(e) => {
                                    if (e.target.value === 'custom') {
                                        handleInputChange('focusAreas', '');
                                    } else {
                                        handleInputChange('focusAreas', e.target.value);
                                    }
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mb-2"
                            >
                                <option value="">Select Focus Areas</option>
                                <option value="Basics: rules, grip, stance, basic batting/bowling, simple fielding">Basics: rules, grip, stance, basic batting/bowling, simple fielding</option>
                                <option value="Technique, fielding drills, fitness basics, match awareness">Technique, fielding drills, fitness basics, match awareness</option>
                                <option value="Advanced technique, game plans, S&C, match simulations">Advanced technique, game plans, S&C, match simulations</option>
                                <option value="High-performance, analytics, nutrition, mental skills">High-performance, analytics, nutrition, mental skills</option>
                                <option value="Personalized skill plan, video analysis, focused correction">Personalized skill plan, video analysis, focused correction</option>
                                <option value="Pace & swing, seam work, spin variations, run-up mechanics">Pace & swing, seam work, spin variations, run-up mechanics</option>
                                <option value="Footwork, shot selection, power-hitting, facing pace/spin">Footwork, shot selection, power-hitting, facing pace/spin</option>
                                <option value="Glovework, footwork, quickness, stumpings & reactivity">Glovework, footwork, quickness, stumpings & reactivity</option>
                                <option value="Strength, speed & agility, flexibility, injury prevention">Strength, speed & agility, flexibility, injury prevention</option>
                                <option value="Skill development, team play, fitness tailored for women">Skill development, team play, fitness tailored for women</option>
                                <option value="Power-hitting, death bowling, situational tactics, fielding">Power-hitting, death bowling, situational tactics, fielding</option>
                                <option value="Patience, concentration, long bowling spells, endurance">Patience, concentration, long bowling spells, endurance</option>
                                <option value="Fun skill sessions, mini-matches, teamwork & games">Fun skill sessions, mini-matches, teamwork & games</option>
                                <option value="Intensive daily training, match practice + fun activities">Intensive daily training, match practice + fun activities</option>
                                <option value="Basics, team-building, light fitness, social matches">Basics, team-building, light fitness, social matches</option>
                                <option value="Remote video analysis, drills, training plans & nutrition">Remote video analysis, drills, training plans & nutrition</option>
                                <option value="custom">Custom (Type your own)</option>
                            </select>
                            <textarea
                                value={formData.focusAreas}
                                onChange={(e) => handleInputChange('focusAreas', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                rows={2}
                                placeholder="Type custom focus areas or select from dropdown above"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Format</label>
                            <select
                                value={formData.format}
                                onChange={(e) => handleInputChange('format', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                                <option value="">Select Format</option>
                                <option value="Weekly / Seasonal">Weekly / Seasonal</option>
                                <option value="Seasonal / Annual">Seasonal / Annual</option>
                                <option value="Full-time / Contract">Full-time / Contract</option>
                                <option value="Hourly / Customized">Hourly / Customized</option>
                                <option value="Short-term / Camps">Short-term / Camps</option>
                                <option value="Ongoing / Seasonal">Ongoing / Seasonal</option>
                                <option value="Seasonal / Camps">Seasonal / Camps</option>
                                <option value="Camps / Short-term">Camps / Short-term</option>
                                <option value="Seasonal / Block programs">Seasonal / Block programs</option>
                                <option value="Short-term (1–4 weeks)">Short-term (1–4 weeks)</option>
                                <option value="Short-term (2–8 weeks)">Short-term (2–8 weeks)</option>
                                <option value="Weekend / Short-term">Weekend / Short-term</option>
                                <option value="Subscription / Customized">Subscription / Customized</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isActive}
                                        onChange={(e) => handleInputChange('isActive', e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Active</span>
                                </label>
                            </div>
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.isSuggested}
                                        onChange={(e) => handleInputChange('isSuggested', e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">Suggested Program</span>
                                </label>
                            </div>
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
                                        {editingProgram ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {editingProgram ? 'Update Program' : 'Create Program'}
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

export default ProgramCreateModal;