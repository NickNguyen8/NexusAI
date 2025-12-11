
export enum Role {
  USER = 'user',
  MODEL = 'model',
  SYSTEM = 'system'
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
}

export enum AppType {
  GENERAL_CHAT = 'general_chat',
  CODE_ASSISTANT = 'code_assistant',
  CREATIVE_WRITER = 'creative_writer',
  DATA_ANALYST = 'data_analyst',
  IMAGE_GENERATOR = 'image_generator',
  VIDEO_GENERATOR = 'video_generator',
  LANGUAGE_TUTOR = 'language_tutor'
}

export interface AIApp {
  id: AppType | string; // Allow string for custom apps
  name: string;
  description: string;
  icon: string;
  systemInstruction: string;
  themeColor: string;
  welcomeMessage?: string; // Specific message shown in empty chat state
  examplePrompts?: string[]; // Suggestions to show in empty state
}

export interface ChatSession {
  id: string;
  appId: AppType | string;
  title: string;
  messages: Message[];
  createdAt: number;
}

export type AuthProvider = 'google' | 'microsoft' | 'facebook';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: AuthProvider;
  plan: 'free' | 'pro' | 'max' | 'payo';
}

export type Language = 'en' | 'vi';

// Global declaration for Google Identity Services
declare var google: any;
// Global declaration for Facebook SDK
declare var FB: any;
// Global declaration for Microsoft Authentication Library
declare var msal: any;

export interface Window {
    fbAsyncInit: () => void;
}