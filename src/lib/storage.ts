import { UserProgress } from '@/types';

const STORAGE_KEY = 'terminalmaster_progress';
const NICKNAME_KEY = 'terminalmaster_nickname';

export const getProgress = (): UserProgress | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
};

export const saveProgress = (progress: UserProgress): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

export const getNickname = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(NICKNAME_KEY);
};

export const saveNickname = (nickname: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(NICKNAME_KEY, nickname);
};

export const initProgress = (nickname: string): UserProgress => {
  const progress: UserProgress = {
    nickname,
    completedLessons: [],
    completedModules: [],
    xp: 0,
  };
  saveProgress(progress);
  saveNickname(nickname);
  return progress;
};

export const markLessonComplete = (lessonId: string, xpGain = 50): UserProgress => {
  const progress = getProgress();
  if (!progress) throw new Error('No progress found');
  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId);
    progress.xp += xpGain;
  }
  saveProgress(progress);
  return progress;
};

export const getLang = (): 'uz' | 'en' => {
  if (typeof window === 'undefined') return 'uz';
  return (localStorage.getItem('terminalmaster_lang') as 'uz' | 'en') || 'uz';
};

export const setLang = (lang: 'uz' | 'en'): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('terminalmaster_lang', lang);
};

export const getTheme = (): 'dark' | 'light' => {
  if (typeof window === 'undefined') return 'dark';
  return (localStorage.getItem('terminalmaster_theme') as 'dark' | 'light') || 'dark';
};

export const setTheme = (theme: 'dark' | 'light'): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('terminalmaster_theme', theme);
};
