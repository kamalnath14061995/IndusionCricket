// Manages dynamic homepage content (Star Players and World-Class Facilities)
// Uses localStorage for persistence. Can be swapped to backend API later without changing UI components.

export type PlayerClassification = 'DISTRICT' | 'STATE' | 'NATIONAL' | 'INTERNATIONAL' | 'DISTRICT_LEAGUE';

export type Tournament = {
  name: string;
  month: string;
  year: string;
  runs: number;
  wickets: number;
  matches: number;
};

export type YearlyStats = {
  runs: number;
  wickets: number;
  matches: number;
  centuries: number;
  halfCenturies: number;
  strikeRate: number;
  economyRate: number;
  average: number;
  tournaments: Tournament[];
};

export type StarPlayer = {
  id: string;
  name: string;
  photo: string;
  achievements: string[];
  playerType: PlayerClassification[];
  represents: string[];
  tournaments: Tournament[];
  stats: Record<string, YearlyStats>;
};

export type FacilityItem = {
  id: string;
  title: string;
  description: string;
  image: string;
  features: string[];
};

export class HomepageContentService {
  private static readonly PLAYERS_KEY = 'homepage_players';
  private static readonly FACILITIES_KEY = 'homepage_facilities';
  private static readonly HERO_IMAGE_KEY = 'homepage_hero_image';

  static getDefaultPlayers(): StarPlayer[] {
    return [
      {
        id: '1',
        name: 'Rahul Sharma',
        photo: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=300',
        achievements: ['State Player', 'Best Batsman 2023', '500+ Matches'],
        playerType: ['STATE'],
        represents: ['Tamil Nadu', 'South Zone'],
        tournaments: [
          { name: 'TNCA League', month: 'Jan', year: '2023', runs: 450, wickets: 2, matches: 8 },
          { name: 'South Zone Championship', month: 'Mar', year: '2023', runs: 320, wickets: 1, matches: 5 }
        ],
        stats: {
          '2021': {
            runs: 1200,
            wickets: 5,
            matches: 25,
            centuries: 3,
            halfCenturies: 7,
            strikeRate: 85.5,
            economyRate: 0,
            average: 48.0,
            tournaments: []
          },
          '2022': {
            runs: 1450,
            wickets: 8,
            matches: 28,
            centuries: 4,
            halfCenturies: 8,
            strikeRate: 88.2,
            economyRate: 0,
            average: 52.0,
            tournaments: []
          },
          '2023': {
            runs: 1650,
            wickets: 12,
            matches: 32,
            centuries: 5,
            halfCenturies: 9,
            strikeRate: 92.1,
            economyRate: 0,
            average: 55.0,
            tournaments: []
          }
        }
      },
      {
        id: '2',
        name: 'Priya Patel',
        photo: 'https://images.pexels.com/photos/3621227/pexels-photo-3621227.jpeg?auto=compress&cs=tinysrgb&w=300',
        achievements: ['National Player', 'Best Bowler 2022', '300+ Wickets'],
        playerType: ['NATIONAL'],
        represents: ['India', 'Tamil Nadu'],
        tournaments: [
          { name: 'National Championship', month: 'Feb', year: '2023', runs: 120, wickets: 15, matches: 6 },
          { name: 'TNCA Tournament', month: 'Apr', year: '2023', runs: 80, wickets: 12, matches: 4 }
        ],
        stats: {
          '2021': {
            runs: 800,
            wickets: 45,
            matches: 22,
            centuries: 1,
            halfCenturies: 4,
            strikeRate: 75.3,
            economyRate: 4.2,
            average: 25.0,
            tournaments: []
          },
          '2022': {
            runs: 950,
            wickets: 52,
            matches: 25,
            centuries: 2,
            halfCenturies: 5,
            strikeRate: 78.9,
            economyRate: 3.8,
            average: 28.0,
            tournaments: []
          },
          '2023': {
            runs: 1100,
            wickets: 48,
            matches: 28,
            centuries: 2,
            halfCenturies: 6,
            strikeRate: 82.4,
            economyRate: 3.5,
            average: 30.0,
            tournaments: []
          }
        }
      },
      {
        id: '3',
        name: 'Arjun Singh',
        photo: 'https://images.pexels.com/photos/3621227/pexels-photo-3621227.jpeg?auto=compress&cs=tinysrgb&w=300',
        achievements: ['District Captain', 'All-rounder 2023', '200+ Matches'],
        playerType: ['DISTRICT_LEAGUE'],
        represents: ['Chennai District', 'TNCA'],
        tournaments: [
          { name: 'District League', month: 'Jan', year: '2023', runs: 380, wickets: 8, matches: 7 },
          { name: 'Inter-District Cup', month: 'May', year: '2023', runs: 250, wickets: 6, matches: 5 }
        ],
        stats: {
          '2021': {
            runs: 1000,
            wickets: 25,
            matches: 20,
            centuries: 2,
            halfCenturies: 5,
            strikeRate: 80.1,
            economyRate: 4.5,
            average: 35.0,
            tournaments: []
          },
          '2022': {
            runs: 1300,
            wickets: 30,
            matches: 24,
            centuries: 3,
            halfCenturies: 7,
            strikeRate: 83.7,
            economyRate: 4.1,
            average: 38.0,
            tournaments: []
          },
          '2023': {
            runs: 1500,
            wickets: 35,
            matches: 26,
            centuries: 4,
            halfCenturies: 8,
            strikeRate: 87.2,
            economyRate: 3.9,
            average: 42.0,
            tournaments: []
          }
        }
      }
    ];
  }

  static getDefaultFacilities(): FacilityItem[] {
    return [
      {
        id: '1',
        title: 'Professional Grounds',
        description: 'Multiple well-maintained cricket grounds with modern facilities',
        image: 'https://images.pexels.com/photos/3621227/pexels-photo-3621227.jpeg?auto=compress&cs=tinysrgb&w=400',
        features: ['3 Match Grounds', 'Professional Pitch', 'Floodlights']
      },
      {
        id: '2',
        title: 'Practice Nets',
        description: 'State-of-the-art practice nets for skill development',
        image: 'https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=400',
        features: ['10 Practice Nets', 'Bowling Machines', 'Video Analysis']
      },
      {
        id: '3',
        title: 'Modern Equipment',
        description: 'Latest cricket equipment and training aids available',
        image: 'https://images.pexels.com/photos/3621227/pexels-photo-3621227.jpeg?auto=compress&cs=tinysrgb&w=400',
        features: ['Premium Bats', 'Safety Gear', 'Training Equipment']
      }
    ];
  }

  static getPlayers(): StarPlayer[] {
    const stored = localStorage.getItem(this.PLAYERS_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultPlayers();
      }
    }
    return this.getDefaultPlayers();
  }

  static savePlayers(players: StarPlayer[]): void {
    localStorage.setItem(this.PLAYERS_KEY, JSON.stringify(players));
  }

  static getFacilities(): FacilityItem[] {
    const stored = localStorage.getItem(this.FACILITIES_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return this.getDefaultFacilities();
      }
    }
    return this.getDefaultFacilities();
  }

  static saveFacilities(facilities: FacilityItem[]): void {
    localStorage.setItem(this.FACILITIES_KEY, JSON.stringify(facilities));
  }

  static getHeroImageUrl(): string | null {
    return localStorage.getItem(this.HERO_IMAGE_KEY);
  }

  static setHeroImageUrl(url: string): void {
    localStorage.setItem(this.HERO_IMAGE_KEY, url);
  }
}
