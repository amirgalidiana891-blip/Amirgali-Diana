export enum AppView {
  THEORY = 'THEORY',
  TASKS = 'TASKS',
  QUIZ = 'QUIZ',
  TUTOR = 'TUTOR',
  SUMMARY = 'SUMMARY'
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface TaskLevel {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}
