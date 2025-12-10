import { getSystemApps } from './locales';
import { AIApp } from './types';

// Initial Session ID for fresh state
export const MOCK_INITIAL_SESSION_ID = 'session-init-1';

// Default to English for initial load before hydration if needed, 
// though App.tsx will handle the dynamic generation.
export const DEFAULT_APPS: AIApp[] = getSystemApps('en');