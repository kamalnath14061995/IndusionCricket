import { HomepageContentService, StarPlayer as UIStarPlayer, FacilityItem as UIFacilityItem, YearlyStats, PlayerClassification } from './homepageContentService';
import { apiFetch } from './apiClient';

// DTOs matching backend
export type StarPlayerDTO = {
  id?: number;
  name: string;
  photoUrl?: string;
  achievements?: string[];
  playerType?: string[] | string;
  represents?: string[];
  tournaments?: {
    name: string;
    month: string;
    year: string;
    runs: number;
    wickets: number;
    matches: number;
  }[];
  stats?: {
    year: string;
    runs: number;
    wickets: number;
    matches: number;
    centuries?: number;
    halfCenturies?: number;
    strikeRate?: number;
    economyRate?: number;
    average?: number;
  }[];
};

export type FacilityItemDTO = {
  id?: number;
  title: string;
  description?: string;
  imageUrl?: string;
  features?: string[];
};

const BASE_PUBLIC = 'http://localhost:8080/api/homepage';
const BASE_ADMIN = 'http://localhost:8080/api/admin/homepage';
const BASE_ADMIN_STARPLAYERS = 'http://localhost:8080/api/admin/starplayers';
export const UPLOAD_URL = 'http://localhost:8080/api/admin/upload/image';
export const UPLOAD_FROM_URL = 'http://localhost:8080/api/admin/upload/from-url';
const API_ORIGIN = new URL(BASE_ADMIN).origin;
const absolutize = (u?: string) => {
  if (!u) return '';
  if (u.startsWith('http://') || u.startsWith('https://')) return u;
  return u.startsWith('/') ? `${API_ORIGIN}${u}` : `${API_ORIGIN}/${u}`;
};

// Map API -> UI
function mapPlayerDTOToUI(p: StarPlayerDTO): UIStarPlayer {
  const stats: Record<string, YearlyStats> = {};
  
  // Safely process stats array, handle missing or invalid data
  (p.stats || []).forEach(s => {
    if (s && s.year) {
      stats[s.year] = { 
        runs: s.runs || 0, 
        wickets: s.wickets || 0, 
        matches: s.matches || 0,
        centuries: s.centuries || 0,
        halfCenturies: s.halfCenturies || 0,
        strikeRate: s.strikeRate || 0,
        economyRate: s.economyRate || 0,
        average: s.average || 0,
        tournaments: [], // Default empty tournaments array
      };
    }
  });
  
  // Ensure we have at least some default stats if none provided
  if (Object.keys(stats).length === 0) {
    const currentYear = new Date().getFullYear().toString();
    stats[currentYear] = { 
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
  }
  
  // Get default player data for tournament fallback
  const defaultPlayer = HomepageContentService.getDefaultPlayers().find(dp => dp.name === p.name);

  return {
    id: String(p.id ?? ''),
    name: p.name || '',
    photo: absolutize(p.photoUrl) || '',
    achievements: Array.isArray(p.achievements) ? [...p.achievements] : [],
    playerType: Array.isArray(p.playerType) ? p.playerType.map(t => t.trim() as PlayerClassification) : (typeof p.playerType === 'string' ? p.playerType.split(',').map(t => t.trim() as PlayerClassification) : ['DISTRICT']),
    represents: Array.isArray(p.represents) ? [...p.represents] : (defaultPlayer?.represents || []),
    tournaments: Array.isArray(p.tournaments) ? p.tournaments.map(t => ({ ...t })) : (defaultPlayer?.tournaments || []),
    stats,
  };
}

function mapUIToPlayerDTO(p: UIStarPlayer): StarPlayerDTO {
  const statsArr = Object.keys(p.stats || {}).map(year => ({
    year,
    runs: p.stats[year].runs || 0,
    wickets: p.stats[year].wickets || 0,
    matches: p.stats[year].matches || 0,
    centuries: p.stats[year].centuries || 0,
    halfCenturies: p.stats[year].halfCenturies || 0,
    strikeRate: p.stats[year].strikeRate || 0,
    economyRate: p.stats[year].economyRate || 0,
    average: p.stats[year].average || 0,
  }));
  
  const dto: StarPlayerDTO = {
    id: p.id ? Number(p.id) : undefined,
    name: p.name || '',
    photoUrl: p.photo || '',
    achievements: Array.isArray(p.achievements) ? [...p.achievements] : [],
    playerType: Array.isArray(p.playerType) ? [...p.playerType] : [],
    represents: Array.isArray(p.represents) ? [...p.represents] : [],
    tournaments: Array.isArray(p.tournaments) ? p.tournaments.map(t => ({ ...t })) : [],
    stats: statsArr,
  };
  
  console.log('Mapping UI to DTO:', { ui: p, dto });
  return dto;
}

function mapFacilityDTOToUI(f: FacilityItemDTO): UIFacilityItem {
  return {
    id: String(f.id ?? ''),
    title: f.title,
    description: f.description || '',
    image: absolutize(f.imageUrl) || '',
    features: f.features || [],
  };
}

function mapUIToFacilityDTO(f: UIFacilityItem): FacilityItemDTO {
  return {
    id: f.id ? Number(f.id) : undefined,
    title: f.title,
    description: f.description,
    imageUrl: f.image,
    features: f.features,
  };
}

export const HomepageApiService = {
  // Public
  async fetchPlayers(): Promise<UIStarPlayer[]> {
    try {
      const res = await apiFetch(`${BASE_PUBLIC}/players`);
      const data = await res.json();
      const list = Array.isArray(data) ? (data as StarPlayerDTO[]) : [];
      // Fallback to defaults if API returns empty
      if (!list.length) return HomepageContentService.getDefaultPlayers();
      return list.map(mapPlayerDTOToUI);
    } catch {
      return HomepageContentService.getDefaultPlayers();
    }
  },
  async fetchFacilities(): Promise<UIFacilityItem[]> {
    try {
      const res = await apiFetch(`${BASE_PUBLIC}/facilities`);
      const data = await res.json();
      const list = Array.isArray(data) ? data as FacilityItemDTO[] : [];
      return list.map(mapFacilityDTOToUI);
    } catch {
      return HomepageContentService.getDefaultFacilities();
    }
  },

  async fetchHeroImageUrl(): Promise<string | null> {
    try {
      const res = await apiFetch(`${BASE_PUBLIC}/hero-image`);
      if (!res.ok) throw new Error(`Status ${res.status}`);
      // Accepts either plain text URL or JSON { url: string }
      const contentType = res.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        const url = (data && (data.url || data.imageUrl)) as string | undefined;
        return url && url.trim() !== '' ? url : null;
      } else {
        const text = await res.text();
        return text && text.trim() !== '' ? text.trim() : null;
      }
    } catch {
      return null;
    }
  },

  // Admin (requires Bearer token)
  async adminListPlayers(token: string): Promise<UIStarPlayer[]> {
    const res = await apiFetch(`${BASE_ADMIN_STARPLAYERS}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();

    // Handle error responses or non-array data
    if (!Array.isArray(data)) {
      console.error('Expected array response from adminListPlayers, got:', data);
      throw new Error('Failed to fetch players: Invalid response format');
    }

    return (data as StarPlayerDTO[]).map(mapPlayerDTOToUI);
  },
  async adminCreatePlayer(token: string, p: UIStarPlayer): Promise<UIStarPlayer> {
    const res = await apiFetch(`${BASE_ADMIN_STARPLAYERS}/create`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(mapUIToPlayerDTO(p)),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to create player: ${res.status} ${errorText}`);
    }
    
    const data = await res.json();
    return mapPlayerDTOToUI(data as StarPlayerDTO);
  },
  async adminUpdatePlayer(token: string, p: UIStarPlayer): Promise<UIStarPlayer> {
    if (!p.id) throw new Error('Missing player id');
    const res = await apiFetch(`${BASE_ADMIN_STARPLAYERS}/edit/${p.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(mapUIToPlayerDTO(p)),
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to update player: ${res.status} ${errorText}`);
    }
    
    const data = await res.json();
    return mapPlayerDTOToUI(data as StarPlayerDTO);
  },
  async adminDeletePlayer(token: string, id: string): Promise<void> {
    await apiFetch(`${BASE_ADMIN_STARPLAYERS}/delete/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  },
  async adminReorderPlayers(token: string, ordered: UIStarPlayer[]): Promise<void> {
    const payload = ordered.map((p, idx) => ({ id: Number(p.id), sortOrder: idx }));
    await apiFetch(`${BASE_ADMIN}/reorder/players`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  },

  async adminListFacilities(token: string): Promise<UIFacilityItem[]> {
    const res = await apiFetch(`${BASE_ADMIN}/facilities`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();

    // Handle error responses or non-array data
    if (!Array.isArray(data)) {
      console.error('Expected array response from adminListFacilities, got:', data);
      throw new Error('Failed to fetch facilities: Invalid response format');
    }

    return (data as FacilityItemDTO[]).map(mapFacilityDTOToUI);
  },
  async adminCreateFacility(token: string, f: UIFacilityItem): Promise<UIFacilityItem> {
    const res = await apiFetch(`${BASE_ADMIN}/facilities`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(mapUIToFacilityDTO(f)),
    });
    const data = await res.json();
    return mapFacilityDTOToUI(data as FacilityItemDTO);
  },
  async adminUpdateFacility(token: string, f: UIFacilityItem): Promise<UIFacilityItem> {
    if (!f.id) throw new Error('Missing facility id');
    const res = await apiFetch(`${BASE_ADMIN}/facilities/${f.id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(mapUIToFacilityDTO(f)),
    });
    const data = await res.json();
    return mapFacilityDTOToUI(data as FacilityItemDTO);
  },
  async adminDeleteFacility(token: string, id: string): Promise<void> {
    await apiFetch(`${BASE_ADMIN}/facilities/${id}`, { 
      method: 'DELETE', 
      headers: { Authorization: `Bearer ${token}` } 
    });
  },
  async adminReorderFacilities(token: string, ordered: UIFacilityItem[]): Promise<void> {
    const payload = ordered.map((f, idx) => ({ id: Number(f.id), sortOrder: idx }));
    await apiFetch(`${BASE_ADMIN}/reorder/facilities`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  },

  async uploadImage(token: string, file: File): Promise<string> {
    const fd = new FormData();
    fd.append('file', file);
    const res = await apiFetch(UPLOAD_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload failed: ${res.status} ${errorText}`);
    }

    return await res.text();
  },

  async uploadFromUrl(token: string, url: string, filename?: string): Promise<string> {
    const res = await apiFetch(UPLOAD_FROM_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ url, filename })
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Upload-from-URL failed: ${res.status} ${errorText}`);
    }

    return await res.text();
  },

  // Admin: Set hero image URL stored in backend
  async adminSetHeroImageUrl(token: string, url: string): Promise<void> {
    await apiFetch(`${BASE_ADMIN}/hero-image`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });
  },

  // Admin: Delete hero image
  async adminDeleteHeroImage(token: string): Promise<void> {
    await apiFetch(`${BASE_ADMIN}/hero-image`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  },
};