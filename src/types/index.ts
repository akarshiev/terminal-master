export type Lang = 'uz' | 'en';

export interface FileSystemNode {
  name: string;
  type: 'file' | 'dir';
  permissions?: string;
  size?: number;
  children?: FileSystemNode[];
  content?: string;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'info';
  content: string;
  prompt?: string;
}

export interface LessonStep {
  id: string;
  instruction: { uz: string; en: string };
  hint?: { uz: string; en: string };
  expectedCommands: string[];
  /* Validate by checking the output/effect, not just the typed command */
  validate?: (cmd: string, output: string, error: boolean) => boolean;
  successMessage: { uz: string; en: string };
  failMessage?: { uz: string; en: string };
  visualEffect?: 'filesystem' | 'permissions' | 'pipe' | 'process' | 'tmux' | 'ssh';
}

export interface Lesson {
  id: string;
  title: { uz: string; en: string };
  description: { uz: string; en: string };
  command: string;
  /* Rich teaching content — the "why" and "how", LabEx-style */
  theory?: {
    uz: string;
    en: string;
  };
  /* Example commands shown in the guide */
  examples?: Array<{ cmd: string; desc: { uz: string; en: string } }>;
  steps: LessonStep[];
  initialFS?: FileSystemNode;
}

export interface Module {
  id: string;
  title: { uz: string; en: string };
  icon: string;
  color: string;
  lessons: Lesson[];
}

export interface UserProgress {
  nickname: string;
  completedLessons: string[];
  completedModules: string[];
  currentModule?: string;
  currentLesson?: string;
  xp: number;
}

export interface PermissionState {
  owner: { r: boolean; w: boolean; x: boolean };
  group: { r: boolean; w: boolean; x: boolean };
  others: { r: boolean; w: boolean; x: boolean };
}
