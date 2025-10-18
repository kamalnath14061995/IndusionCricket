import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus, Edit, Trash2, Save, X, Upload, Link,
  Lightbulb, Grid as GridIcon, Leaf, Package, BarChart3,
  Camera, Video, Home, Key, Sun, Snowflake, Building, Tag, Droplet,
  Wifi, Shield, Fan, Thermometer, Battery, Users
} from 'lucide-react';
import { HomepageContentService, FacilityItem } from '../services/homepageContentService';
import { useAuth } from '../contexts/AuthContext';
import { HomepageApiService } from '../services/homepageApiService';
import { config } from '../config/env';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';
import { featureWordToEmoji } from '../utils/featureIcons';

const AdminFacilities: React.FC = () => {
  const [facilities, setFacilities] = useState<FacilityItem[]>([]);
  const [editing, setEditing] = useState<FacilityItem | null>(null);
  const [form, setForm] = useState<Partial<FacilityItem>>({
    title: '',
    description: '',
    image: '',
    features: []
  });
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [facilityUrlInput, setFacilityUrlInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingItem, setDeletingItem] = useState<FacilityItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Auto-suggestion state
  const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Description auto-suggestions
  const [descriptionSuggestions, setDescriptionSuggestions] = useState<string[]>([]);
  const [showDescriptionSuggestions, setShowDescriptionSuggestions] = useState(false);
  const [descriptionSuggestionIndex, setDescriptionSuggestionIndex] = useState(-1);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const descriptionSuggestionsRef = useRef<HTMLDivElement>(null);

  // Feature auto-suggestions (per active feature input)
  const [featureSuggestions, setFeatureSuggestions] = useState<string[]>([]);
  const [showFeatureSuggestions, setShowFeatureSuggestions] = useState(false);
  const [featureSuggestionIndex, setFeatureSuggestionIndex] = useState(-1);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState<number | null>(null);
  const featureSuggestionsRef = useRef<HTMLDivElement>(null);
  const featureInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Load facilities from backend or localStorage
  useEffect(() => {
    (async () => {
      try {
        if (token) {
          const list = await HomepageApiService.adminListFacilities(token);
          setFacilities(list);
        } else {
          setFacilities(HomepageContentService.getFacilities());
        }
      } catch {
        setFacilities(HomepageContentService.getFacilities());
      }
    })();
  }, [token]);

  // Handle URL-based actions
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const action = pathParts[3];
    const id = pathParts[4];

    setShowForm(false);
    setShowDeleteDialog(false);
    setEditing(null);
    setDeletingItem(null);

    if (action === 'create') {
      startCreate();
    } else if (action === 'edit' && id) {
      const facility = facilities.find(f => f.id === id);
      if (facility) {
        startEdit(facility);
      }
    } else if (action === 'delete' && id) {
      const facility = facilities.find(f => f.id === id);
      if (facility) {
        setDeletingItem(facility);
        setShowDeleteDialog(true);
      }
    }
  }, [location.pathname, facilities]);

  // Generate title suggestions based on existing facilities
  const generateTitleSuggestions = (input: string) => {
    if (!input.trim()) {
      setTitleSuggestions([]);
      return;
    }

    const existingTitles = facilities.map(f => f.title);
    const filtered = existingTitles.filter(title =>
      title.toLowerCase().includes(input.toLowerCase()) &&
      title.toLowerCase() !== input.toLowerCase()
    );

    // Add some common facility title suggestions
    const commonSuggestions = [
      'Professional Cricket Ground',
      'Practice Nets',
      'Training Facility',
      'Bowling Machine',
      'Indoor Cricket Center',
      'Cricket Academy',
      'Sports Complex',
      'Turf Ground',
      'Astroturf Pitch',
      'Cricket Pavilion'
    ];

    const combined = [...new Set([...filtered, ...commonSuggestions.filter(s =>
      s.toLowerCase().includes(input.toLowerCase())
    )])];

    setTitleSuggestions(combined.slice(0, 8)); // Limit to 8 suggestions
  };

  const handleTitleChange = (value: string) => {
    setForm({ ...form, title: value });
    generateTitleSuggestions(value);
    setShowSuggestions(true);
    setSuggestionIndex(-1);
    setErrors(prev => ({ ...prev, title: '' }));
  };

  const selectSuggestion = (suggestion: string) => {
    setForm({ ...form, title: suggestion });
    setShowSuggestions(false);
    setSuggestionIndex(-1);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || titleSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSuggestionIndex(prev =>
          prev < titleSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestionIndex >= 0) {
          selectSuggestion(titleSuggestions[suggestionIndex]);
        } else {
          setShowSuggestions(false);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Title suggestions
      if (
        titleInputRef.current &&
        !titleInputRef.current.contains(target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(target)
      ) {
        setShowSuggestions(false);
        setSuggestionIndex(-1);
      }

      // Description suggestions
      if (
        descriptionRef.current &&
        !descriptionRef.current.contains(target) &&
        descriptionSuggestionsRef.current &&
        !descriptionSuggestionsRef.current.contains(target)
      ) {
        setShowDescriptionSuggestions(false);
        setDescriptionSuggestionIndex(-1);
      }

      // Feature suggestions
      const clickedInsideAnyFeatureInput = featureInputRefs.current.some((input) => input && input.contains(target));
      if (
        !clickedInsideAnyFeatureInput &&
        featureSuggestionsRef.current &&
        !featureSuggestionsRef.current.contains(target)
      ) {
        setShowFeatureSuggestions(false);
        setFeatureSuggestionIndex(-1);
        setActiveFeatureIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Auto-suggestion helpers ---
  const STOP_WORDS = new Set([
    'the','and','for','with','a','an','of','to','in','on','by','at','from','our','your','best','modern','state','art','center','centre',
    'facility','facilities','academy','cricket','sports','club','world','class','premium','pro','professional'
  ]);

  // Request guards to avoid race conditions for async suggestions
  const descReqId = useRef(0);
  const featReqId = useRef(0);

  // Parse various response formats into a list of strings
  const safeParseSuggestionResponse = async (res: Response): Promise<string[]> => {
    try {
      const contentType = res.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (Array.isArray(data)) return data.filter((x) => typeof x === 'string');
        if (data && Array.isArray((data as any).suggestions)) return (data as any).suggestions.filter((x: any) => typeof x === 'string');
        return [];
      }
      const text = await res.text();
      // Support comma/newline separated
      return text
        .split(/[\n,]+/)
        .map((s) => s.trim())
        .filter(Boolean);
    } catch {
      return [];
    }
  };

  const mergeUnique = (...lists: string[][]) => Array.from(new Set(lists.flat().filter(Boolean)));

  const fetchExternalDescriptionSuggestions = async (title: string, current: string): Promise<string[]> => {
    const url = (config?.facilitySuggestions?.descriptionUrl || '').trim();
    if (!url) return [];
    try {
      const qs = new URLSearchParams({ title: title || '', q: current || '' }).toString();
      const res = await fetch(`${url}?${qs}`);
      if (!res.ok) return [];
      return await safeParseSuggestionResponse(res);
    } catch {
      return [];
    }
  };

  const fetchExternalFeatureSuggestions = async (title: string, value: string): Promise<string[]> => {
    const url = (config?.facilitySuggestions?.featureUrl || '').trim();
    if (!url) return [];
    try {
      const qs = new URLSearchParams({ title: title || '', q: value || '' }).toString();
      const res = await fetch(`${url}?${qs}`);
      if (!res.ok) return [];
      const list = await safeParseSuggestionResponse(res);
      // Keep single-word suggestions
      return list.map((s) => s.split(/\s+/)[0]).filter(Boolean);
    } catch {
      return [];
    }
  };

  const descriptionSuggestionBank: Record<string, string[]> = {
    ground: [
      'Professional-grade cricket grounds maintained to match standards.',
      'Multiple turf pitches with consistent bounce and pace.',
      'Floodlit ground suitable for evening and night sessions.',
      'Dedicated boundary markers and sight screens for match readiness.'
    ],
    nets: [
      'High-quality practice nets designed for intensive training.',
      'Dedicated lanes for batting, pace, and spin practice.',
      'Seamless netting for safety and uninterrupted sessions.',
      'Bowling and batting lanes equipped with matting and screens.'
    ],
    indoor: [
      'All-weather indoor facility enabling year-round training.',
      'Climate-controlled practice area with cushioned flooring.',
      'Sound-proofed bays and bright LED lighting for clear visibility.'
    ],
    bowling: [
      'Automated bowling machines for consistent, repeatable drills.',
      'Variable speeds and line-length presets for targeted practice.',
      'Left/Right arm simulation and programmable sequences.'
    ],
    machine: [
      'Advanced bowling machines to simulate match scenarios.'
    ],
    turf: [
      'Premium turf surfaces prepared by experienced curators.',
      'Regular rolling and watering routines ensure optimal bounce.'
    ],
    astroturf: [
      'Durable astroturf pitch ideal for fast-paced sessions.',
      'Low-maintenance synthetic mat with consistent pace.'
    ],
    pavilion: [
      'Comfortable pavilion with seating, changing rooms, and refreshments.',
      'Clean locker rooms with showers and secure storage.'
    ],
    equipment: [
      'Access to pro-level bats, pads, helmets, and training aids.',
      'Protective gear available for all age groups.'
    ],
    analysis: [
      'Video analysis support for technique review and improvement.',
      'High-frame-rate cameras for slow-motion replay and feedback.'
    ],
    parking: [
      'Ample on-site parking for players and visitors.'
    ],
    wifi: [
      'Free high-speed Wi‑Fi available across the facility.'
    ],
    security: [
      '24/7 CCTV surveillance and secure access control.'
    ],
    cafeteria: [
      'Healthy refreshments and hydration available at the cafeteria.'
    ],
  };

  const featureSuggestionBank: Record<string, string[]> = {
    ground: ['Turf','Pitch','Floodlights','Boundary','SightScreen','Practice','Outfield','Scoreboard','Dugout'],
    nets: ['Nets','Lane','Matting','Seam','Spin','Pace','Screens','Cage','Poles'],
    indoor: ['Indoor','AC','Mat','Lane','Cage','Lighting','Ventilation','Foam','Netting'],
    bowling: ['Bowling','Machine','Speed','Spin','Line','Length','Swing','Seam','Programmable'],
    machine: ['Machine','Auto','Feed','Speed','Remote','Settings'],
    turf: ['Turf','Grass','Roller','Curator','Watering','Mower'],
    astroturf: ['Astroturf','Synthetic','Mat','Rubber'],
    pavilion: ['Pavilion','Seating','Locker','Shower','Restroom','Cafeteria'],
    equipment: ['Bats','Pads','Helmets','Gloves','Gear','Cones','Stumps','Balls'],
    analysis: ['Video','Camera','Tripod','Analysis','Playback','Monitor'],
    parking: ['Parking','Slots','EV','Bicycle'],
    wifi: ['WiFi','Hotspot','Network'],
    security: ['CCTV','Guard','Access','Alarm']
  };



  const extractKeywords = (title: string): string[] => {
    return (title || '')
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean)
      .filter((w) => !STOP_WORDS.has(w));
  };

  const generateDescriptionSuggestions = async (current: string) => {
    const reqId = ++descReqId.current;
    const keywords = extractKeywords(form.title || '');
    const candidates: string[] = [];

    // From bank by keywords
    keywords.forEach((k) => {
      Object.entries(descriptionSuggestionBank).forEach(([key, lines]) => {
        if (k.includes(key) || key.includes(k)) {
          candidates.push(...lines);
        }
      });
    });

    // From existing facilities descriptions
    facilities.forEach((f) => {
      if (!f.description) return;
      const desc = f.description.trim();
      if (desc) candidates.push(desc);
    });

    // External
    const external = await fetchExternalDescriptionSuggestions(form.title || '', current || '');

    // Deduplicate and filter by current input
    const typed = (current || '').toLowerCase();
    const unique = mergeUnique(candidates, external);
    const filtered = typed
      ? unique.filter((s) => s.toLowerCase().includes(typed))
      : unique;

    if (reqId !== descReqId.current) return; // out-of-date
    setDescriptionSuggestions(filtered.slice(0, 8));
    setShowDescriptionSuggestions(filtered.length > 0);
    setDescriptionSuggestionIndex(-1);
  };

  const applyDescriptionSuggestion = (line: string) => {
    const existing = form.description || '';
    const textarea = descriptionRef.current;
    if (textarea) {
      const { selectionStart, selectionEnd } = textarea;
      if (selectionStart !== null && selectionEnd !== null && selectionStart !== selectionEnd) {
        const before = existing.slice(0, selectionStart);
        const after = existing.slice(selectionEnd);
        const next = `${before}${line}${after}`;
        setForm({ ...form, description: next });
      } else if (!existing.trim()) {
        setForm({ ...form, description: line });
      } else {
        const separator = existing.endsWith('\n') ? '' : '\n';
        setForm({ ...form, description: `${existing}${separator}${line}` });
      }
    } else {
      setForm({ ...form, description: existing ? `${existing}\n${line}` : line });
    }
    setShowDescriptionSuggestions(false);
    setDescriptionSuggestionIndex(-1);
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (!showDescriptionSuggestions || descriptionSuggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setDescriptionSuggestionIndex((prev) => (prev < descriptionSuggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setDescriptionSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (descriptionSuggestionIndex >= 0) {
          applyDescriptionSuggestion(descriptionSuggestions[descriptionSuggestionIndex]);
        } else {
          setShowDescriptionSuggestions(false);
        }
        break;
      case 'Escape':
        setShowDescriptionSuggestions(false);
        setDescriptionSuggestionIndex(-1);
        break;
    }
  };

  const generateFeatureSuggestions = async (value: string) => {
    const reqId = ++featReqId.current;
    const keywords = extractKeywords(form.title || '');
    const candidates: string[] = [];

    // Banked
    keywords.forEach((k) => {
      Object.entries(featureSuggestionBank).forEach(([key, words]) => {
        if (k.includes(key) || key.includes(k)) {
          candidates.push(...words);
        }
      });
    });

    // From existing facility features
    facilities.forEach((f) => {
      f.features.forEach((ft) => candidates.push(ft));
    });

    // External (single-word normalized)
    const external = await fetchExternalFeatureSuggestions(form.title || '', value || '');

    // One-word suggestions only, match current value
    const typed = (value || '').toLowerCase();
    const unique = Array.from(new Set(mergeUnique(candidates, external).map((s) => s.split(/\s+/)[0])));
    const filtered = typed ? unique.filter((w) => w.toLowerCase().includes(typed) && w.length > 0) : unique;

    if (reqId !== featReqId.current) return; // out-of-date
    setFeatureSuggestions(filtered.slice(0, 8));
    setShowFeatureSuggestions(filtered.length > 0);
    setFeatureSuggestionIndex(-1);
  };

  const applyFeatureSuggestion = (word: string) => {
    if (activeFeatureIndex === null) return;
    const features = [...(form.features || [])];
    const input = featureInputRefs.current[activeFeatureIndex];
    const existing = features[activeFeatureIndex] || '';

    if (input && input.selectionStart !== null && input.selectionEnd !== null && input.selectionStart !== input.selectionEnd) {
      const { selectionStart, selectionEnd } = input;
      const before = existing.slice(0, selectionStart);
      const after = existing.slice(selectionEnd);
      features[activeFeatureIndex] = `${before}${word}${after}`;
    } else {
      // Replace entire field if no selection
      features[activeFeatureIndex] = word;
    }

    setForm({ ...form, features });
    setShowFeatureSuggestions(false);
    setFeatureSuggestionIndex(-1);
  };

  const handleFeatureKeyDown = (e: React.KeyboardEvent) => {
    if (!showFeatureSuggestions || featureSuggestions.length === 0) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFeatureSuggestionIndex((prev) => (prev < featureSuggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFeatureSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (featureSuggestionIndex >= 0) {
          applyFeatureSuggestion(featureSuggestions[featureSuggestionIndex]);
        } else {
          setShowFeatureSuggestions(false);
        }
        break;
      case 'Escape':
        setShowFeatureSuggestions(false);
        setFeatureSuggestionIndex(-1);
        break;
    }
  };

  const handleCreate = () => {
    navigate('/admin/facilities/create');
  };

  const handleEdit = (facility: FacilityItem) => {
    navigate(`/admin/facilities/edit/${facility.id}`);
  };

  const handleDelete = (facility: FacilityItem) => {
    navigate(`/admin/facilities/delete/${facility.id}`);
  };

  const handleCloseModal = () => {
    setEditing(null);
    setForm({
      title: '',
      description: '',
      image: '',
      features: []
    });
    setShowForm(false);
    setShowSuggestions(false);
    setTitleSuggestions([]);
    setSuggestionIndex(-1);
    navigate('/admin/facilities');
  };

  const startCreate = () => {
    setEditing(null);
    setForm({
      title: '',
      description: '',
      image: '',
      features: [
        'Turf',
        'Floodlights',
        'Boundary',
        'SightScreen',
        'Practice',
        'Outfield',
        'Scoreboard',
        'Dugout'
      ]
    });
    setShowForm(true);
  };

  const startEdit = (facility: FacilityItem) => {
    setEditing(facility);
    setForm({ ...facility, features: [...facility.features] });
    setShowForm(true);
  };

  const cancel = () => {
    handleCloseModal();
  };

  const save = async () => {
    // Validate required fields
    const newErrors: {[key: string]: string} = {};
    if (!form.title || form.title.trim() === '') {
      newErrors.title = 'Title is required';
    }
    if (!form.description || form.description.trim() === '') {
      newErrors.description = 'Description is required';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const facilityData: FacilityItem = {
      id: editing?.id || '',
      title: form.title!.trim(),
      description: form.description!.trim(),
      image: form.image || '',
      features: form.features || []
    };

    if (!token) {
      // Local storage mode
      const next = editing
        ? facilities.map(f => (f.id === facilityData.id ? facilityData : f))
        : [...facilities, { ...facilityData, id: String(Date.now()) }];
      setFacilities(next);
      HomepageContentService.saveFacilities(next);
      setSuccessMessage(editing ? 'Facility updated successfully!' : 'Facility created successfully!');
      cancel();
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    try {
      setSaving(true);
      if (editing) {
        await HomepageApiService.adminUpdateFacility(token, facilityData);
        setSuccessMessage('Facility updated successfully');
      } else {
        const created = await HomepageApiService.adminCreateFacility(token, facilityData);
        facilityData.id = created.id;
        setSuccessMessage('Facility created successfully');
      }
      const updatedFacilities = await HomepageApiService.adminListFacilities(token);
      setFacilities(updatedFacilities);
      handleCloseModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving facility:', error);
      setUploadError('Failed to save facility');
      setTimeout(() => setUploadError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (facility: FacilityItem) => {
    setDeletingItem(facility);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      if (!token) {
        const next = facilities.filter(f => f.id !== deletingItem.id);
        setFacilities(next);
        HomepageContentService.saveFacilities(next);
        setSuccessMessage('Facility deleted successfully');
      } else {
        await HomepageApiService.adminDeleteFacility(token, deletingItem.id);
        setFacilities(facilities.filter(f => f.id !== deletingItem.id));
        setSuccessMessage('Facility deleted successfully');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setUploadError('Failed to delete facility');
      setTimeout(() => setUploadError(''), 3000);
    } finally {
      setDeleting(false);
      handleCloseModal();
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    setUploadError('');

    try {
      const uploadedUrl = await HomepageApiService.uploadImage(token, file);
      setForm({ ...form, image: uploadedUrl });
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
      setForm({ ...form, image: uploadedUrl });
    } catch (error: any) {
      setUploadError(error.message || 'URL upload failed');
    } finally {
      setUploading(false);
    }
  };

  const updateFeature = (index: number, value: string) => {
    const features = [...(form.features || [])];
    features[index] = value;
    setForm({ ...form, features });
  };

  const addFeature = () => {
    setForm({ ...form, features: [...(form.features || []), ''] });
  };

  const removeFeature = (index: number) => {
    const features = (form.features || []).filter((_, i) => i !== index);
    setForm({ ...form, features });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Facilities Management</h2>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Facility
        </button>
      </div>

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

      {/* Facilities List */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {facilities.map(facility => (
            <div key={facility.id} className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
              {facility.image && (
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={facility.image}
                    alt={facility.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-blue-100', 'to-purple-100');
                    }}
                  />
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">{facility.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{facility.description}</p>

                {facility.features.length > 0 && (
                  <div className="mb-3">
                    <div className="text-xs font-medium text-gray-600 mb-1">Features</div>
                    <div className="flex flex-wrap gap-1">
                      {facility.features.slice(0, 3).map((feature, i) => {
                        const iconKey = (feature || '').toLowerCase().split(/[^a-z0-9]+/).find(k => featureWordToEmoji[k]);
                        const Icon = iconKey ? featureWordToEmoji[iconKey] : null;
                        return (
                          <span key={i} className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {Icon && <span className="mr-1">{Icon}</span>}
                            {feature}
                          </span>
                        );
                      })}
                      {facility.features.length > 3 && (
                        <span className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                          +{facility.features.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(facility)}
                    className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(facility)}
                    className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:red:bg-red-700 inline-flex items-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create/Edit Form Modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={cancel} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-full overflow-auto p-6 relative">
              <button
                onClick={cancel}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-semibold mb-4">{editing ? 'Edit Facility' : 'Add Facility'}</h3>

              <div className="space-y-4">
                {/* Title with Auto-suggestion */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Title</label>
                  <input
                    ref={titleInputRef}
                    type="text"
                    value={form.title || ''}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    onKeyDown={handleTitleKeyDown}
                    onFocus={() => {
                      if (titleSuggestions.length > 0) setShowSuggestions(true);
                    }}
                    className="mt-1 border rounded-md px-3 py-2 w-full"
                    placeholder="Enter facility title"
                  />
                  {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}

                  {/* Suggestions Dropdown */}
                  {showSuggestions && titleSuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto"
                    >
                      {titleSuggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                            index === suggestionIndex ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => selectSuggestion(suggestion)}
                        >
                          {suggestion}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description with line suggestions */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    ref={descriptionRef}
                    value={form.description || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setForm({ ...form, description: val });
                      setErrors(prev => ({ ...prev, description: '' }));
                      generateDescriptionSuggestions(val);
                    }}
                    onKeyDown={handleDescriptionKeyDown}
                    onFocus={() => {
                      if ((descriptionSuggestions || []).length > 0) setShowDescriptionSuggestions(true);
                    }}
                    className="mt-1 border rounded-md px-3 py-2 w-full h-24 resize-none"
                    placeholder="Enter facility description"
                  />
                  {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}

                  {/* Description Suggestions Dropdown */}
                  {showDescriptionSuggestions && descriptionSuggestions.length > 0 && (
                    <div
                      ref={descriptionSuggestionsRef}
                      className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto"
                    >
                      {descriptionSuggestions.map((s, index) => (
                        <div
                          key={index}
                          className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                            index === descriptionSuggestionIndex ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => applyDescriptionSuggestion(s)}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image</label>
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
                          value={facilityUrlInput}
                          onChange={(e) => setFacilityUrlInput(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleUrlUpload(facilityUrlInput);
                            }
                          }}
                        />
                        <button
                          onClick={() => {
                            handleUrlUpload(facilityUrlInput);
                          }}
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
                    {form.image && (
                      <div className="mt-2">
                        <div className="text-sm text-green-600">Image uploaded successfully!</div>
                        <img
                          src={form.image}
                          alt="Facility preview"
                          className="w-20 h-20 object-cover rounded-md border mt-1"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Features with word suggestions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <div className="space-y-2">
                    {(form.features || []).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <div className="relative">
                            <input
                              ref={(el) => (featureInputRefs.current[index] = el)}
                              type="text"
                              value={feature}
                              onChange={(e) => {
                                updateFeature(index, e.target.value);
                                setActiveFeatureIndex(index);
                                generateFeatureSuggestions(e.target.value);
                              }}
                              onKeyDown={handleFeatureKeyDown}
                              onFocus={() => {
                                setActiveFeatureIndex(index);
                                if ((featureSuggestions || []).length > 0) setShowFeatureSuggestions(true);
                              }}
                              className="border rounded-md pl-8 pr-3 py-2 w-full"
                              placeholder="Enter feature"
                            />
                            {(() => {
                            const key = (feature || '').toLowerCase().split(/[^a-z0-9]+/).find(k => featureWordToEmoji[k]);
                            const Icon = key ? featureWordToEmoji[key] : null;
                            return Icon ? (
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">{Icon}</span>
                            ) : null;
                            })()}
                          </div>

                          {/* Feature Suggestions Dropdown */}
                          {activeFeatureIndex === index && showFeatureSuggestions && featureSuggestions.length > 0 && (
                            <div
                              ref={featureSuggestionsRef}
                              className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto"
                            >
                              {featureSuggestions.map((w, i) => (
                                <div
                                  key={i}
                                  className={`px-3 py-2 cursor-pointer hover:bg-gray-100 ${
                                    i === featureSuggestionIndex ? 'bg-blue-50' : ''
                                  }`}
                                  onClick={() => applyFeatureSuggestion(w)}
                                >
                                  {w}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => removeFeature(index)}
                          className="px-2 py-2 text-red-600 hover:text-red-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addFeature}
                      className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200"
                    >
                      <Plus className="w-4 h-4 mr-1" /> Add Feature
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={cancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : (editing ? 'Update' : 'Create')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <DeleteConfirmationDialog
          isOpen={showDeleteDialog}
          title="Delete Facility"
          message={`Are you sure you want to delete "${deletingItem?.title}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onClose={handleCloseModal}
          loading={deleting}
        />
      )}
    </div>
  );
};

export default AdminFacilities;
