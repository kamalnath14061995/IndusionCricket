import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus, Edit, Trash2, Save, X, Trophy, Search, GripVertical, Check, Upload, Link } from 'lucide-react';
import { HomepageContentService, StarPlayer, YearlyStats, PlayerClassification } from '../services/homepageContentService';
import { useAuth } from '../contexts/AuthContext';
import { HomepageApiService } from '../services/homepageApiService';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

const getCurrentYear = () => new Date().getFullYear();
const emptyYearlyStats: YearlyStats = {
  runs: 0,
  wickets: 0,
  matches: 0,
  centuries: 0,
  halfCenturies: 0,
  strikeRate: 0,
  economyRate: 0,
  average: 0,
  tournaments: []
};

const emptyStats: Record<string, YearlyStats> = {
  [getCurrentYear().toString()]: { ...emptyYearlyStats },
};

const emptyPlayer: StarPlayer = {
  id: '',
  name: '',
  photo: '', // Default value for photo
  achievements: [],
  playerType: ['DISTRICT'],
  represents: [],
  tournaments: [],
  stats: { ...emptyStats },
};

// Constants for represents and tournaments
const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

const CRICKET_ZONES = ['North', 'South', 'East', 'West', 'Central'];

const TNCA_TOURNAMENTS = [
  'SPORTS ALL INDIA BUCHI BABU INVITATION CRICKET TOURNAMENT',
  'TNCA INTER DISTRICTS MEN U25 TOURNAMENT',
  'TNCA U16 ROUND ROBIN MULTI DAY 1ST ROUND',
  'TNCA CITY SCHOOLS UNDER 14 B SOMASUNDARAM TROPHY',
  'MAHARASHTRA U19 ONE DAY WARMUP MATCHES 2025 2026',
  'TNCA BOYS U14 PRE ROUND ROBIN ONE DAY',
  'TNCA FREYER CUP ONE DAY LEAGUE TOURNAMENT',
  'TNCA FREYER CUP T20 LEAGUE TOURNAMENT',
  '2ND DIVISION LEAGUE MULTI DAY',
  'TNCA INTER DISTRICTS UNDER 16 TOURNAMENT KNOCK OUT MULTI DAY',
  '4TH DIVISION A ZONE N KANNAYIRAM SHIELD',
  '4TH DIVISION C ZONE K S KANNAN SHIELD',
  '6TH DIVISION B ZONE P C RAMUDU SHIELD',
  '4TH DIVISION B ZONE A G KRIPAL SINGH SHIELD',
  '6TH DIVISION A ZONE T K N BABU SHIELD',
  'TNCA WOMENS SR AND WOMEN U23 ROUND ROBIN ONE DAY',
  'TNCA WOMENS SR AND WOMEN U23 ROUND ROBIN T20',
  '2ND DIVISION THE CPJOHNSTONE SHIELD',
  '3RD DIVISION B ZONE G PARTHASARATHY SHIELD',
  '5TH DIVISION A ZONE P ANANDA RAU SHIELD',
  '5TH DIVISION B ZONE V P RAGHAVAN SHIELD',
  '3RD DIVISION A ZONE C R RANGACHARI SHIELD',
  '5TH DIVISION C ZONE M V KASTURI RANGAN SHIELD',
  '5TH DIVISION D ZONE S ANNADORAI SHIELD',
  'TNCA INTER DISTRICTS UNDER 16 TOURNAMENT ONE DAY',
  'TNCA UNDER 19 ROUND ROBIN ONE DAY',
  '1ST DIVISION THE RAJA OF PALAYAMPATTI SHIELD',
  'TNCA WOMEN UNDER 19 ROUND ROBIN ONE DAY',
  'TNCA WOMEN UNDER 19 ROUND ROBIN T20',
  'TNCA INTER DISTRICTS UNDER 14 TOURNAMENT KNOCK OUT MULTI DAY',
  'TNCA WOMEN UNDER 15 ROUND ROBIN ONE DAY',
  'TNCA UNDER 19 ROUND ROBIN 2ND SET MULTI DAY',
  'TAGORE SPORTS TNCA CITY SCHOOLS UNDER 16 TOURNAMENT FOR C RAMASWAMY TROPHY',
  'TNCA INTER DISTRICTS UNDER 14 TOURNAMENT ONE DAY',
  'TNCA UNDER 19 ROUND ROBIN MULTI DAY',
  'TNCA INTER DISTRICTS WOMENS TOURNAMENT',
  'TNCA INTER DISTRICTS UNDER 19 TOURNAMENT KNOCK OUT MULTI DAY',
  'TNCA INTER DISTRICTS UNDER 19 TOURNAMENT'
];

export default function AdminStarPlayers() {
  const [players, setPlayers] = useState<StarPlayer[]>([]);
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<StarPlayer | null>(null);
  const [form, setForm] = useState<StarPlayer>(emptyPlayer);
  const [showForm, setShowForm] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | string>(''); // State for selected year
  const [selectedYears, setSelectedYears] = useState<string[]>([]); // State for multiple selected years
  // Remove separate represents state, use form.represents instead
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reorder state
  const [reorderMode, setReorderMode] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);

  // Delete confirmation state
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingItem, setDeletingItem] = useState<StarPlayer | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Default templates for quick creation
  const defaultTemplates = useMemo(() => HomepageContentService.getDefaultPlayers(), []);
  const applyTemplate = (tpl: StarPlayer) => {
    // Start a create flow pre-filled with default template data
    setEditing(null);
    const copy: StarPlayer = {
      ...tpl,
      id: '',
      achievements: [...tpl.achievements],
      stats: { ...tpl.stats },
      tournaments: [...tpl.tournaments],
    };
    setForm(copy);
    setShowForm(true);
  };

  // Load from backend (fallback to storage defaults if API fails)
  useEffect(() => {
    (async () => {
      try {
        if (token) {
          const list = await HomepageApiService.adminListPlayers(token);
          setPlayers(list);
        } else {
          setPlayers(HomepageContentService.getPlayers());
        }
      } catch {
        setPlayers(HomepageContentService.getPlayers());
      }
    })();
  }, [token]);

  // Handle URL-based actions
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const action = pathParts[3];
    const id = pathParts[4];

    setShowForm(false);
    setShowModal(false);
    setShowDeleteDialog(false);
    setEditing(null);
    setDeletingItem(null);

    if (action === 'create') {
      startCreate();
    } else if (action === 'edit' && id) {
      const player = players.find(p => p.id === id);
      if (player) {
        startEdit(player);
      }
    } else if (action === 'delete' && id) {
      const player = players.find(p => p.id === id);
      if (player) {
        setDeletingItem(player);
        setShowDeleteDialog(true);
      }
    }
  }, [location.pathname, players]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return players;
    return players.filter(p =>
      p.name.toLowerCase().includes(q) ||
      ((p.achievements ?? []) as string[]).join(' ').toLowerCase().includes(q) ||
      p.tournaments.some(t => t.name.toLowerCase().includes(q))
    );
  }, [query, players]);

  const genId = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : String(Date.now()));

  const handleCreate = () => {
    navigate('/admin/starPlayers/create');
  };

  const handleEdit = (player: StarPlayer) => {
    navigate(`/admin/starPlayers/edit/${player.id}`);
  };

  const handleDelete = (player: StarPlayer) => {
    navigate(`/admin/starPlayers/delete/${player.id}`);
  };

  const handleCloseModal = () => {
    setEditing(null);
    setForm(emptyPlayer);
    setSelectedYears([]);
    setShowForm(false);
    setShowModal(false);
    setErrors({});
    setUploadError('');
    navigate('/admin/starPlayers');
  };

  const startCreate = () => {
    setEditing(null);
    setForm({ ...emptyPlayer, id: '' });
    setSelectedYears([getCurrentYear().toString()]); // Initialize with current year
    setShowForm(true);
    setShowModal(true);
    setErrors({}); // Clear any previous errors
  };

  const startEdit = (p: StarPlayer) => {
    setEditing(p);
    const editForm = { ...p, achievements: [...(p.achievements ?? [])], stats: { ...p.stats }, tournaments: [...p.tournaments] };
    setForm(editForm);
    setSelectedYears(Object.keys(p.stats || {}));
    setShowForm(true);
    setShowModal(true);
    setErrors({}); // Clear any previous errors
  };

  const cancel = () => {
    handleCloseModal();
  };

const DEFAULT_IMAGE_PATH = 'https://drive.google.com/file/d/14VFbB4hKqf35ubABZ3_zJ8CtrxLDwiF3/view?usp=drive_link'; // Updated to use an imgbb.com URL (allowed domain)

  const save = async () => {
    // Sync selectedYears with form.stats
    const updatedStats = { ...form.stats };
    selectedYears.forEach(year => {
      if (!updatedStats[year]) {
        updatedStats[year] = { ...emptyYearlyStats };
      }
    });
    // Remove stats for years that are no longer selected
    Object.keys(updatedStats).forEach(year => {
      if (!selectedYears.includes(year)) {
        delete updatedStats[year];
      }
    });

    // Clean tournaments: keep all selected tournaments, set defaults for missing fields
    const cleanedTournaments = form.tournaments.map(t => ({
      ...t,
      month: t.month || '',
      year: t.year || '',
      runs: t.runs || 0,
      wickets: t.wickets || 0,
      matches: t.matches || 0
    }));
    
    console.log('Cleaned tournaments before save:', cleanedTournaments);

    // Create the updated form with synchronized data
    const updatedForm = { ...form, stats: updatedStats, tournaments: cleanedTournaments };

    // Validate required fields
    const newErrors: {[key: string]: string} = {};
    if (!updatedForm.name || updatedForm.name.trim() === '') {
      newErrors.name = 'Player name is required';
    }
    if (!updatedForm.photo || updatedForm.photo.trim() === '') {
      newErrors.photo = 'Player photo is required';
    }
    if (!updatedForm.playerType || updatedForm.playerType.length === 0) {
      newErrors.playerType = 'Player type is required';
    }
    if (Object.keys(updatedStats).length === 0) {
      newErrors.stats = 'Yearly stats for at least one year are required';
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Update form state with synchronized data
    setForm(updatedForm);

    // Save the player
    if (!token) {
      const next = editing ? players.map(p => (p.id === updatedForm.id ? updatedForm : p)) : [...players, { ...updatedForm, id: genId() }];
      setPlayers(next);
      HomepageContentService.savePlayers(next);
      setSuccessMessage(editing ? 'Player updated successfully!' : 'Player created successfully!');
      setShowForm(false);
      cancel();
      setTimeout(() => setSuccessMessage(''), 3000);
      return;
    }

    try {
      setSaving(true);
      console.log('Saving player with data:', {
        name: updatedForm.name,
        playerType: updatedForm.playerType,
        represents: updatedForm.represents,
        tournaments: updatedForm.tournaments,
        stats: updatedForm.stats
      });
      
      if (editing) {
        const result = await HomepageApiService.adminUpdatePlayer(token, updatedForm);
        console.log('Update result:', result);
        setSuccessMessage('Player updated successfully');
      } else {
        const result = await HomepageApiService.adminCreatePlayer(token, updatedForm);
        console.log('Create result:', result);
        setSuccessMessage('Player created successfully');
      }
      
      // Refresh the players list
      const updatedPlayers = await HomepageApiService.adminListPlayers(token);
      console.log('Refreshed players list:', updatedPlayers);
      setPlayers(updatedPlayers);
      
      handleCloseModal();
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving player:', error);
      setUploadError(`Failed to save player: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setUploadError(''), 5000);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    // Show delete confirmation dialog
    const playerToDelete = players.find(p => p.id === id);
    if (!playerToDelete) return;
    setDeletingItem(playerToDelete);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!deletingItem) return;
    setDeleting(true);
    try {
      if (!token) {
        const next = players.filter(p => p.id !== deletingItem.id);
        setPlayers(next);
        HomepageContentService.savePlayers(next);
        setSuccessMessage('Player deleted successfully');
      } else {
        await HomepageApiService.adminDeletePlayer(token, deletingItem.id);
        setPlayers(players.filter(p => p.id !== deletingItem.id));
        setSuccessMessage('Player deleted successfully');
      }
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (e) {
      console.error(e);
      setUploadError('Failed to delete player');
      setTimeout(() => setUploadError(''), 3000);
    } finally {
      setDeleting(false);
      handleCloseModal();
    }
  };

  // ---- Reorder ----
  const onDragStartItem = (index: number) => setDragIndex(index);
  const onDragOverItem = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
  };
  const onDropItem = (index: number) => {
    if (dragIndex === null || dragIndex === index) return;
    const next = [...players];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(index, 0, moved);
    setPlayers(next);
    setDragIndex(null);
  };

  const persistOrder = async () => {
    try {
      setSavingOrder(true);
      if (token) {
        await HomepageApiService.adminReorderPlayers(token, players);
      } else {
        HomepageContentService.savePlayers(players);
      }
      setReorderMode(false);
    } catch (e) {
      console.error('Failed to save order', e);
    } finally {
      setSavingOrder(false);
    }
  };

  const setStat = (year: string, key: keyof YearlyStats, value: number) => {
    const currentStats = form.stats[year] || { ...emptyYearlyStats };
    setForm({
      ...form,
      stats: { ...form.stats, [year]: { ...currentStats, [key]: Number(value) || 0 } },
    });
  };



  const updateAchievement = (index: number, value: string) => {
    const arr = [...(form.achievements ?? [])];
    arr[index] = value;
    setForm({ ...form, achievements: arr });
  };
  const addAchievement = () => setForm({ ...form, achievements: [...(form.achievements ?? []), ''] });
  const removeAchievement = (index: number) => setForm({ ...form, achievements: (form.achievements ?? []).filter((_, i) => i !== index) });

  // Image upload functions
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !token) return;

    setUploading(true);
    setUploadError('');

    try {
      const uploadedUrl = await HomepageApiService.uploadImage(token, file);
      setForm({ ...form, photo: uploadedUrl });
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
      setForm({ ...form, photo: uploadedUrl });
    } catch (error: any) {
      setUploadError(error.message || 'URL upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`space-y-6 ${successMessage ? 'pt-32' : ''}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Star Players</h2>
        <div className="flex gap-2">
          <button onClick={() => setReorderMode(!reorderMode)} className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200">
            <GripVertical className="w-4 h-4 mr-1" /> {reorderMode ? 'Cancel Reorder' : 'Reorder'}
          </button>
          {reorderMode && (
            <button disabled={savingOrder} onClick={persistOrder} className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
              {savingOrder ? 'Saving...' : 'Save Order'}
            </button>
          )}
          <button onClick={handleCreate} className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            <Plus className="w-4 h-4 mr-1" /> Add Player
          </button>
        </div>
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

      {!reorderMode && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-2 mb-4">
            <Search className="w-4 h-4 text-gray-500" />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search players..." className="border rounded-md px-3 py-2 w-full" />
          </div>

          {/* Default Templates (quick create) */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">Default Star Player Templates</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {defaultTemplates.map(tpl => (
                <div key={tpl.name} className="border rounded-lg p-3 bg-gray-50">
                  <div className="flex items-center gap-3">
                    {tpl.photo ? (
                      <img src={tpl.photo} alt={tpl.name} className="w-12 h-12 rounded object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-gray-200" />
                    )}
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{tpl.name}</div>
                      <div className="text-xs text-gray-600">{(Array.isArray(tpl.playerType) ? tpl.playerType : []).join(', ').toLowerCase().replace(/_/g, ' ')}</div>
                    </div>
                  </div>
                  {tpl.tournaments?.length ? (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {tpl.tournaments.slice(0, 2).map((t, i) => (
                        <span key={i} className="inline-flex items-center text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                          {t.name} {t.year ? `(${t.year})` : ''}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <button onClick={() => applyTemplate(tpl)} className="mt-3 w-full text-sm bg-green-600 hover:bg-green-700 text-white rounded-md px-3 py-2">Use Template</button>
                </div>
              ))}
            </div>
          </div>

          {/* List */}
          <div className="space-y-6">
            {filtered.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 overflow-hidden w-full min-h-72 flex border border-gray-100 group">
                {/* Player Photo Section */}
                <div className="w-2/5 relative overflow-hidden">
                  {p.photo ? (
                    <img 
                      src={p.photo} 
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', 'from-blue-100', 'to-purple-100');
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">No Photo</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40"></div>
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                    <span className="text-xs font-semibold text-gray-800">Star Player</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-3/5 p-5 flex flex-col bg-gradient-to-br from-white to-gray-50">
                  {/* Player Name and Type */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors duration-300">
                    {p.name}
                  </h3>
                  <div className="text-sm text-gray-600 capitalize mb-1">
                    {(Array.isArray(p.playerType) ? p.playerType : []).join(', ').toLowerCase().replace(/_/g, ' ')}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Represents: {p.represents?.join(', ')}
                  </div>

                  {/* Performance Stats */}
                  <div className="flex-1">
                    {Object.keys(p.stats).length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Latest Performance</div>
                        <div className="grid grid-cols-3 gap-3">
                          {Object.keys(p.stats).sort((a, b) => b.localeCompare(a)).slice(0, 1).map(year => (
                            <React.Fragment key={year}>
                              <div className="flex items-center group/stat">
                                <div className="bg-blue-100 rounded-full p-1.5 mr-2 flex-shrink-0 group-hover/stat:bg-blue-200 transition-colors duration-200 flex items-center justify-center w-6 h-6">
                                  <span className="text-blue-600 text-xs font-bold">R</span>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800 text-sm">{p.stats[year].runs}</div>
                                  <div className="text-gray-500 text-xs">Runs</div>
                                </div>
                              </div>
                              <div className="flex items-center group/stat">
                                <div className="bg-red-100 rounded-full p-1.5 mr-2 flex-shrink-0 group-hover/stat:bg-red-200 transition-colors duration-200 flex items-center justify-center w-6 h-6">
                                  <span className="text-red-600 text-xs font-bold">W</span>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800 text-sm">{p.stats[year].wickets}</div>
                                  <div className="text-gray-500 text-xs">Wickets</div>
                                </div>
                              </div>
                              <div className="flex items-center group/stat">
                                <div className="bg-green-100 rounded-full p-1.5 mr-2 flex-shrink-0 group-hover/stat:bg-green-200 transition-colors duration-200 flex items-center justify-center w-6 h-6">
                                  <span className="text-green-600 text-xs font-bold">M</span>
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-800 text-sm">{p.stats[year].matches}</div>
                                  <div className="text-gray-500 text-xs">Matches</div>
                                </div>
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tournaments */}
                    {p.tournaments.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Recent Tournaments</div>
                        <div className="flex flex-wrap gap-1">
                          {p.tournaments.slice(0, 2).map((t, i) => (
                            <span key={i} className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                              {t.name} {(t.year && t.year !== '') ? `(${t.year})` : ''}
                            </span>
                          ))}
                          {p.tournaments.length > 2 && (
                            <span className="inline-flex items-center text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                              +{p.tournaments.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto">
                    <button 
                      onClick={() => handleEdit(p)} 
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 inline-flex items-center justify-center transition-colors duration-200"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(p)} 
                      className="px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 inline-flex items-center transition-colors duration-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {reorderMode && (
        <div className="bg-white rounded-lg shadow p-4">
          <div className="text-sm text-gray-600 mb-3 flex items-center gap-2"><GripVertical className="w-4 h-4"/> Drag items to reorder. Save when done.</div>
          <div className="space-y-2">
            {players.map((p, idx) => (
              <div
                key={p.id}
                draggable
                onDragStart={() => onDragStartItem(idx)}
                onDragOver={e => onDragOverItem(e, idx)}
                onDrop={() => onDropItem(idx)}
                className="flex items-center gap-3 p-2 border rounded bg-white hover:bg-gray-50 cursor-move"
              >
                <GripVertical className="w-4 h-4 text-gray-500" />
                <div className="font-medium text-gray-800">{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

{/* Modal/Form */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={cancel} />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-full overflow-auto p-6 relative">
              <button
                onClick={cancel}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-lg font-semibold">{editing ? 'Edit Player' : 'Add Player'}</h3>

              {successMessage && (
                <div className="mt-3 mb-2 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                  {successMessage}
                </div>
              )}

          {/* Default Templates (apply inside form) */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Use Default Template</div>
            <div className="flex gap-3 overflow-x-auto py-1">
              {defaultTemplates.map(tpl => (
                <button
                  key={tpl.name}
                  onClick={() => applyTemplate(tpl)}
                  className="min-w-[160px] flex items-center gap-2 border rounded-md px-2 py-2 bg-gray-50 hover:bg-gray-100"
                  title={`Use ${tpl.name} template`}
                >
                  {tpl.photo ? (
                    <img src={tpl.photo} alt={tpl.name} className="w-8 h-8 rounded object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded bg-gray-200" />
                  )}
                  <div className="text-left">
                    <div className="text-xs font-semibold text-gray-800 truncate max-w-[110px]">{tpl.name}</div>
                    <div className="text-[10px] text-gray-600 capitalize truncate max-w-[110px]">{(Array.isArray(tpl.playerType) ? tpl.playerType : []).join(', ').toLowerCase().replace(/_/g, ' ')}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input value={form.name} onChange={e => { setForm({ ...form, name: e.target.value }); setErrors(prev => ({ ...prev, name: '' })); }} className="mt-1 border rounded-md px-3 py-2 w-full" />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Player Type</label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                {[
                  { value: 'TNCA_DIVISION', label: 'TNCA Division' },
                  { value: 'DISTRICT', label: 'District' },
                  { value: 'DISTRICT_LEAGUE', label: 'District League' },
                  { value: 'STATE', label: 'State' },
                  { value: 'NATIONAL', label: 'National' },
                  { value: 'INTERNATIONAL', label: 'International' }
                ].map(({ value, label }) => (
                  <label key={value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={form.playerType.includes(value as PlayerClassification)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setForm({ ...form, playerType: [...form.playerType, value as PlayerClassification] });
                        } else {
                          setForm({ ...form, playerType: form.playerType.filter(t => t !== value) });
                        }
                        setErrors(prev => ({ ...prev, playerType: '' }));
                      }}
                      className="mr-2"
                    />
                    <span className="text-sm">{label}</span>
                  </label>
                ))}
                {errors.playerType && <p className="text-red-600 text-sm mt-1">{errors.playerType}</p>}
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Player Photo</label>
            <div className="mt-2 space-y-3">
              {/* File Upload */}
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer">
                  <Upload className="w-4 h-4 mr-1" />
                  Upload File
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
                <span className="text-sm text-gray-500">or</span>
                
                {/* URL Upload */}
                <div className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Paste image URL (Google Drive, etc.)"
                    className="border rounded-md px-3 py-2 flex-1"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleUrlUpload(e.currentTarget.value);
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.querySelector('input[type="text"][placeholder*="Paste image URL"]') as HTMLInputElement;
                      if (input) handleUrlUpload(input.value);
                    }}
                    className="inline-flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    disabled={uploading}
                  >
                    <Link className="w-4 h-4 mr-1" />
                    Fetch
                  </button>
                </div>
              </div>

              {/* Upload Status */}
              {uploading && (
                <div className="text-sm text-blue-600">Uploading...</div>
              )}
              {uploadError && (
                <div className="text-sm text-red-600">{uploadError}</div>
              )}
              {form.photo && (
                <div className="mt-2">
                  <div className="text-sm text-green-600">Photo uploaded successfully!</div>
                  {form.photo.startsWith('http') && (
                    <div className="mt-1">
                      <img 
                        src={form.photo} 
                        alt="Player preview" 
                        className="w-20 h-20 object-cover rounded-md border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Represents */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Represents</label>
            <div className="mt-2 grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
              {INDIAN_STATES.concat(CRICKET_ZONES).map(state => (
                  <label key={state} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={form.represents?.includes(state) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, represents: [...(form.represents || []), state] });
                      } else {
                        setForm({ ...form, represents: (form.represents || []).filter(r => r !== state) });
                      }
                      // Note: represents is not a required field, so no error clearing needed
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{state}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tournaments */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Tournaments</label>
            <div className="mt-2 max-h-40 overflow-y-auto">
              {TNCA_TOURNAMENTS.map(tournament => (
                <label key={tournament} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    checked={form.tournaments.some(t => t.name === tournament)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setForm({ ...form, tournaments: [...form.tournaments, { name: tournament, month: '', year: '', runs: 0, wickets: 0, matches: 0 }] });
                      } else {
                        setForm({ ...form, tournaments: form.tournaments.filter(t => t.name !== tournament) });
                      }
                    }}
                    className="mr-2"
                  />
                  <span className="text-sm">{tournament}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tournament Details */}
          {form.tournaments.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Tournament Details</label>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {form.tournaments.map((tournament, index) => (
                  <div key={index} className="border rounded p-3 bg-gray-50">
                    <div className="font-medium text-sm mb-2">{tournament.name}</div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Month</label>
                        <select
                          value={tournament.month}
                          onChange={(e) => {
                            const updated = [...form.tournaments];
                            updated[index].month = e.target.value;
                            setForm({ ...form, tournaments: updated });
                          }}
                          className="border rounded px-2 py-1 text-sm w-full"
                        >
                          <option value="">Select Month</option>
                          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                            <option key={month} value={month}>{month}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Year</label>
                        <select
                          value={tournament.year}
                          onChange={(e) => {
                            const updated = [...form.tournaments];
                            updated[index].year = e.target.value;
                            setForm({ ...form, tournaments: updated });
                          }}
                          className="border rounded px-2 py-1 text-sm w-full"
                        >
                          <option value="">Select Year</option>
                          {Array.from({ length: 10 }, (_, i) => getCurrentYear() - i).map(year => (
                            <option key={year} value={year.toString()}>{year}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Runs</label>
                        <input
                          type="number"
                          value={tournament.runs}
                          onChange={(e) => {
                            const updated = [...form.tournaments];
                            updated[index].runs = Number(e.target.value) || 0;
                            setForm({ ...form, tournaments: updated });
                          }}
                          className="border rounded px-2 py-1 text-sm w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Wickets</label>
                        <input
                          type="number"
                          value={tournament.wickets}
                          onChange={(e) => {
                            const updated = [...form.tournaments];
                            updated[index].wickets = Number(e.target.value) || 0;
                            setForm({ ...form, tournaments: updated });
                          }}
                          className="border rounded px-2 py-1 text-sm w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Matches</label>
                        <input
                          type="number"
                          value={tournament.matches}
                          onChange={(e) => {
                            const updated = [...form.tournaments];
                            updated[index].matches = Number(e.target.value) || 0;
                            setForm({ ...form, tournaments: updated });
                          }}
                          className="border rounded px-2 py-1 text-sm w-full"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}



          {/* Stats */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Yearly Stats</label>
              {errors.stats && <p className="text-red-600 text-sm mt-1">{errors.stats}</p>}
              <div className="flex items-center gap-2">
                <select
                  value={selectedYear}
                  className="border rounded-md px-3 py-2 w-32"
                  onChange={e => {
                    const year = e.target.value;
                    if (year && !selectedYears.includes(year)) {
                      setSelectedYears([...selectedYears, year]);
                      setForm({ ...form, stats: { ...form.stats, [year]: { ...emptyYearlyStats } } });
                    }
                    setSelectedYear('');
                  }}
                >
                  <option value="">Select Year</option>
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
            <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedYears.sort().map(year => (
                <div key={year} className="border rounded-md p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-gray-800">{year}</div>
                    <button
                      onClick={() => {
                        const updatedStats = { ...form.stats };
                        delete updatedStats[year];
                        const updatedSelectedYears = selectedYears.filter(y => y !== year);
                        setForm({ ...form, stats: updatedStats });
                        setSelectedYears(updatedSelectedYears);
                        setErrors(prev => ({ ...prev, stats: '' }));
                      }}
                      className="text-red-600 hover:text-red-800 p-1"
                      title={`Remove ${year} stats`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-xs text-gray-600">Runs</div>
                      <input type="number" value={form.stats[year]?.runs || 0}
                        onChange={e => setStat(year, 'runs', Number(e.target.value))}
                        className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Wickets</div>
                      <input type="number" value={form.stats[year]?.wickets || 0}
                        onChange={e => setStat(year, 'wickets', Number(e.target.value))}
                        className="border rounded px-2 py-1 w-full" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-600">Matches</div>
                      <input type="number" value={form.stats[year]?.matches || 0}
                        onChange={e => setStat(year, 'matches', Number(e.target.value))}
                        className="border rounded px-2 py-1 w-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={cancel}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  {editing ? 'Update' : 'Create'}
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
          title="Delete Star Player"
          message={`Are you sure you want to delete "${deletingItem?.name}"? This action cannot be undone.`}
          onConfirm={confirmDelete}
          onClose={handleCloseModal}
          loading={deleting}
        />
      )}
    </div>
  );
}
