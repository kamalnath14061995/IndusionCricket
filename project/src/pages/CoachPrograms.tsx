import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

interface AvailableProgram {
    id: number;
    programName: string;
    description: string;
    duration: string;
    price: number;
    level: string;
    category: string;
    isActive: boolean;
    coaches: number[];
}

interface ProgramFormData {
    programName: string;
    description: string;
    duration: string;
    price: number;
    level: string;
    category: string;
    isActive: boolean;
    coachIds: number[];
}

const CoachPrograms: React.FC = () => {
    const [programs, setPrograms] = useState<AvailableProgram[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterLevel, setFilterLevel] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProgram, setEditingProgram] = useState<AvailableProgram | null>(null);
    const [formData, setFormData] = useState<ProgramFormData>({
        programName: '',
        description: '',
        duration: '',
        price: 0,
        level: '',
        category: '',
        isActive: true,
        coachIds: []
    });
    const { token, user } = useAuth();
    
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            const endpoint = isAdmin ? '/api/admin/programs' : '/api/coach/programs';
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPrograms(response.data);
        } catch (err) {
            setError('Failed to fetch programs');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProgram) {
                await axios.put(`/api/admin/programs/${editingProgram.id}`, formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('/api/admin/programs', formData, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchPrograms();
            resetForm();
        } catch (err) {
            setError('Failed to save program');
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this program?')) {
            try {
                await axios.delete(`/api/admin/programs/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                fetchPrograms();
            } catch (err) {
                setError('Failed to delete program');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            programName: '',
            description: '',
            duration: '',
            price: 0,
            level: '',
            category: '',
            isActive: true,
            coachIds: []
        });
        setEditingProgram(null);
        setShowForm(false);
    };

    const handleEdit = (program: AvailableProgram) => {
        setEditingProgram(program);
        setFormData({
            programName: program.programName,
            description: program.description,
            duration: program.duration,
            price: program.price,
            level: program.level,
            category: program.category,
            isActive: program.isActive,
            coachIds: program.coaches
        });
        setShowForm(true);
    };

    const filteredPrograms = programs.filter(program => {
        const matchesSearch = program.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            program.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || program.category === filterCategory;
        const matchesLevel = !filterLevel || program.level === filterLevel;
        return matchesSearch && matchesCategory && matchesLevel;
    });

    const uniqueCategories = [...new Set(programs.map(p => p.category).filter(Boolean))];
    const uniqueLevels = [...new Set(programs.map(p => p.level).filter(Boolean))];

    if (loading) return <div className="text-center py-8">Loading...</div>;
    if (error) return <div className="text-red-500 text-center py-8">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Available Programs</h1>
                {isAdmin && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Add New Program
                    </button>
                )}
            </div>

            {showForm && isAdmin && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingProgram ? 'Edit Program' : 'Add New Program'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Program Name</label>
                            <input
                                type="text"
                                value={formData.programName}
                                onChange={(e) => setFormData({...formData, programName: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                rows={3}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Duration</label>
                                <input
                                    type="text"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Level</label>
                                <input
                                    type="text"
                                    value={formData.level}
                                    onChange={(e) => setFormData({...formData, level: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Category</label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                    className="rounded border-gray-300"
                                />
                                <span className="ml-2 text-sm text-gray-700">Active</span>
                            </label>
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                            >
                                {editingProgram ? 'Update' : 'Create'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Programs</label>
                        <input
                            type="text"
                            placeholder="Search by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Categories</option>
                            {uniqueCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Level</label>
                        <select
                            value={filterLevel}
                            onChange={(e) => setFilterLevel(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All Levels</option>
                            {uniqueLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Programs Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((program) => (
                    <div key={program.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-900">{program.programName}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                program.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {program.isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{program.description}</p>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-500">Duration:</span>
                                <span className="font-medium">{program.duration}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Price:</span>
                                <span className="font-medium">${program.price}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Level:</span>
                                <span className="font-medium">{program.level}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">Category:</span>
                                <span className="font-medium">{program.category}</span>
                            </div>
                        </div>

                        {isAdmin && (
                            <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                                <button
                                    onClick={() => handleEdit(program)}
                                    className="text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(program.id)}
                                    className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredPrograms.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-gray-500">No programs found matching your criteria.</p>
                </div>
            )}
        </div>
    );
};

export default CoachPrograms;
