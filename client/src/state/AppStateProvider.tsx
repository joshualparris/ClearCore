import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  loadState, 
  saveState, 
  generateId 
} from '@/lib/storage';
import { 
  type AppState, 
  type DailyEntry, 
  type LogEntry, 
  type WeeklyReview,
  type SlipResponse,
  type UserSettings
} from '@shared/schema';

// Action Types
type Action = 
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UserSettings> }
  | { type: 'COMPLETE_DAILY'; payload: DailyEntry }
  | { type: 'ADD_LOG_ENTRY'; payload: Omit<LogEntry, 'id' | 'createdAtISO'> }
  | { type: 'MARK_SLIP'; payload: { timestampISO: string } }
  | { type: 'SAVE_REVIEW'; payload: WeeklyReview }
  | { type: 'SAVE_SLIP_RESPONSE'; payload: Omit<SlipResponse, 'id'> }
  | { type: 'RESET_STATE' };

const initialState = loadState();

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload }
      };
    case 'COMPLETE_DAILY':
      return {
        ...state,
        daily: {
          ...state.daily,
          [action.payload.dateISO]: action.payload
        }
      };
    case 'ADD_LOG_ENTRY':
      return {
        ...state,
        logs: [
          { ...action.payload, id: generateId(), createdAtISO: new Date().toISOString() },
          ...state.logs
        ]
      };
    case 'MARK_SLIP':
      return {
        ...state,
        lastSlipAtISO: action.payload.timestampISO
      };
    case 'SAVE_REVIEW':
      return {
        ...state,
        weeklyReviews: {
          ...state.weeklyReviews,
          [action.payload.weekISO]: action.payload
        },
        settings: {
          ...state.settings,
          lastWeeklyReviewWeek: action.payload.weekISO
        }
      };
    case 'SAVE_SLIP_RESPONSE':
      return {
        ...state,
        slipResponses: [
          { ...action.payload, id: generateId() },
          ...state.slipResponses
        ]
      };
    case 'RESET_STATE':
        localStorage.clear();
        return loadState(); // Will re-load defaults
    default:
      return state;
  }
}

const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    // Debounce save slightly to avoid thrashing localStorage
    const timeout = setTimeout(() => {
      saveState(state);
    }, 500);
    return () => clearTimeout(timeout);
  }, [state]);

  // Sync theme with DOM
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    if (state.settings.theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(state.settings.theme);
    }
  }, [state.settings.theme]);

  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
