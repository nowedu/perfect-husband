import { useLocalStorage } from './useLocalStorage';

export interface CycleData {
  lastPeriods: string[];
  averageCycle: number;
  currentPhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  nextPeriodDate: string;
}

export interface GiftPreferences {
  flowers: boolean;
  alcohol: boolean;
  books: boolean;
  places: boolean;
  clothes: boolean;
  jewelry: boolean;
  cosmetics: boolean;
  hobbies: boolean;
  sports: boolean;
  music: boolean;
  movies: boolean;
  food: boolean;
  travel: boolean;
  technology: boolean;
  art: boolean;
}

export interface ImportantDate {
  id: string;
  name: string;
  date: string;
  type: 'birthday' | 'anniversary' | 'firstKiss' | 'firstDance' | 'firstDate' | 'custom';
}

export interface DailySuggestion {
  id: string;
  text: string;
  date: string;
  rating?: number; // 1-5 stars
  isFavorite?: boolean;
  category?: string;
}

export interface CycleSuggestion {
  id: string;
  text: string;
  phase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal' | 'pms';
  rating?: number; // 1-5 stars
  isFavorite?: boolean;
}

export interface AppSettings {
  pin: string;
  language: string;
  theme: 'light' | 'dark' | 'colorblind';
}

export interface AppData {
  cycle: CycleData;
  giftPreferences: GiftPreferences;
  importantDates: ImportantDate[];
  dailySuggestions: DailySuggestion[];
  cycleSuggestions: CycleSuggestion[];
  settings: AppSettings;
}

const defaultData: AppData = {
  cycle: {
    lastPeriods: [],
    averageCycle: 28,
    currentPhase: 'follicular',
    nextPeriodDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  },
  giftPreferences: {
    flowers: false,
    alcohol: false,
    books: false,
    places: false,
    clothes: false,
    jewelry: false,
    cosmetics: false,
    hobbies: false,
    sports: false,
    music: false,
    movies: false,
    food: false,
    travel: false,
    technology: false,
    art: false
  },
  importantDates: [],
  dailySuggestions: [],
  cycleSuggestions: [],
  settings: {
    pin: '5566',
    language: 'pl',
    theme: 'dark'
  }
};

export function useAppData() {
  return useLocalStorage<AppData>('perfect-husband-data', defaultData);
}
