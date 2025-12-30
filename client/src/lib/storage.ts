import { v4 as uuidv4 } from 'uuid';
import { 
  AppStateSchema, 
  type AppState, 
  type DailyEntry, 
  type LogEntry, 
  type WeeklyReview,
  type SlipResponse
} from '@shared/schema';

const STORAGE_KEY = 'pure-heart-storage-v1';

const DEFAULT_STATE: AppState = {
  settings: {
    theme: 'system',
    guardrails: [
      { id: '1', title: 'No phone in bathroom', enabled: true },
      { id: '2', title: 'Charge phone outside bedroom', enabled: true },
      { id: '3', title: 'Content filters active', enabled: true },
      { id: '4', title: 'Open door policy', enabled: false },
    ],
    screenTimeCapMinutes: 120,
    noScreensInBedroom: true,
    noScreensAtMeals: true,
    dockReminderTime: '20:00',
    hspQuietMode: false,
    hspRechargeReminder: false,
    hspSmallGroupMode: false
  },
  daily: {},
  logs: [],
  weeklyReviews: {},
  slipResponses: []
};

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    
    const parsed = JSON.parse(raw);
    const result = AppStateSchema.safeParse(parsed);
    
    if (!result.success) {
      console.warn('State schema mismatch, falling back to defaults', result.error);
      // In a real app, you might try to salvage parts of the state here
      return DEFAULT_STATE;
    }
    
    return result.data;
  } catch (error) {
    console.error('Failed to load state:', error);
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save state:', error);
  }
}

export const generateId = () => uuidv4();
