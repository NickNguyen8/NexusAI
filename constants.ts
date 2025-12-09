import { AIApp, AppType } from './types';
import { MessageSquare, Code, PenTool, BarChart, Zap } from 'lucide-react';

export const AVAILABLE_APPS: AIApp[] = [
  {
    id: AppType.GENERAL_CHAT,
    name: 'Nexus Chat',
    description: 'A versatile AI assistant for everyday tasks and questions.',
    icon: 'MessageSquare',
    systemInstruction: 'You are Nexus, a helpful, harmless, and honest AI assistant. Answer questions clearly and concisely.',
    themeColor: 'bg-blue-500'
  },
  {
    id: AppType.CODE_ASSISTANT,
    name: 'DevMate',
    description: 'Expert coding companion for debugging and architecture.',
    icon: 'Code',
    systemInstruction: 'You are an expert senior software engineer. Provide clean, efficient, and typed code. Explain your reasoning briefly before providing code blocks.',
    themeColor: 'bg-emerald-500'
  },
  {
    id: AppType.CREATIVE_WRITER,
    name: 'Muse',
    description: 'Creative writing partner for stories, poems, and copy.',
    icon: 'PenTool',
    systemInstruction: 'You are a creative writer. Use evocative language, varying sentence structures, and vivid imagery. Adjust tone based on user request.',
    themeColor: 'bg-purple-500'
  },
  {
    id: AppType.DATA_ANALYST,
    name: 'DataSight',
    description: 'Analyze data patterns and explain complex concepts.',
    icon: 'BarChart',
    systemInstruction: 'You are a data analyst. Break down complex information into structured summaries. Use bullet points and tables where appropriate.',
    themeColor: 'bg-orange-500'
  }
];

export const MOCK_INITIAL_SESSION_ID = 'session-init-1';
