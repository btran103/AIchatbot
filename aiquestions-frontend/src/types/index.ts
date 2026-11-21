export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  about?: string;
  goals?: string;
  skills?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Conversation {
  id: number;
  title: string;
  mode: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface Memory {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  technology?: string;
  status: string;
  deadline?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskItem {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  deadline?: string;
  createdAt: string;
}