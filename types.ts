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
  IMAGE_GENERATOR = 'image_generator' // Placeholder for future expansion
}

export interface AIApp {
  id: AppType;
  name: string;
  description: string;
  icon: string;
  systemInstruction: string;
  themeColor: string;
}

export interface ChatSession {
  id: string;
  appId: AppType;
  title: string;
  messages: Message[];
  createdAt: number;
}
