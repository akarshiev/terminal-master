'use client';
import { Module, UserProgress } from '@/types';
import { Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface Props {
  modules: Module[];
  progress: UserProgress;
  currentModuleId: string;
  currentLessonId: string;
  onSelectLesson: (moduleId: string, lessonId: string) => void;
  lang: 'uz' | 'en';
}

export default function Sidebar({ modules, progress, currentModuleId, currentLessonId, onSelectLesson, lang }: Props) {
  const [expanded, setExpanded] = useState<string[]>([currentModuleId]);

  const done = (id: string) => progress.completedLessons.includes(id);
  const toggle = (id: string) =>
    setExpanded(p => p.includes(id) ? p.filter(e => e !== id) : [...p, id]);

  const total = modules.reduce((a, m) => a + m.lessons.length, 0);
  const pct   = total > 0 ? Math.round((progress.completedLessons.length / total) * 100) : 0;

  return (
    <div style={{
      width: 220,
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--line)',
      background: 'var(--bg-2)',
      overflow: 'hidden',
    }}>
      {/* Progress */}
      <div style={{ padding: '14px 14px 12px', borderBottom: '1px solid var(--line)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
          <span style={{ fontSize: 11, color: 'var(--fg-2)', fontWeight: 500 }}>Progress</span>
          <span className="mono" style={{ fontSize: 11, color: 'var(--teal)' }}>
            {progress.completedLessons.length}/{total}
          </span>
        </div>
        <div style={{ height: 2, background: 'var(--line)', borderRadius: 1 }}>
          <div style={{ height: '100%', width: `${pct}%`, background: 'var(--teal)', borderRadius: 1, transition: 'width 0.4s ease' }} />
        </div>
        <div style={{ fontSize: 10, color: 'var(--fg-2)', marginTop: 5, fontFamily: 'monospace' }}>
          {pct}% {lang === 'uz' ? 'bajarildi' : 'complete'}
        </div>
      </div>

      {/* Modules */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '6px 0' }}>
        {modules.map((mod) => {
          const isOpen    = expanded.includes(mod.id);
          const isCurMod  = mod.id === currentModuleId;
          const modDone   = mod.lessons.filter(l => done(l.id)).length;

          return (
            <div key={mod.id}>
              <button onClick={() => toggle(mod.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 14px',
                background: isCurMod ? 'var(--bg-3)' : 'transparent',
                border: 'none', cursor: 'pointer',
                color: 'var(--fg-0)', textAlign: 'left',
                transition: 'background 0.1s',
              }}
                onMouseEnter={e => { if (!isCurMod) (e.currentTarget).style.background = 'var(--bg-3)'; }}
                onMouseLeave={e => { if (!isCurMod) (e.currentTarget).style.background = 'transparent'; }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {mod.title[lang]}
                  </div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--fg-2)', marginTop: 1 }}>
                    {modDone}/{mod.lessons.length}
                  </div>
                </div>
                <span style={{ color: 'var(--fg-2)', flexShrink: 0 }}>
                  {isOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
                </span>
              </button>

              {isOpen && (
                <div>
                  {mod.lessons.map((les) => {
                    const isCur  = les.id === currentLessonId && isCurMod;
                    const isDone = done(les.id);
                    return (
                      <button key={les.id} onClick={() => onSelectLesson(mod.id, les.id)} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 7,
                        padding: '6px 14px 6px 28px',
                        background: isCur ? 'var(--bg-4)' : 'transparent',
                        border: 'none',
                        borderLeft: isCur ? '2px solid var(--green)' : '2px solid transparent',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.1s',
                      }}
                        onMouseEnter={e => { if (!isCur) (e.currentTarget).style.background = 'var(--bg-3)'; }}
                        onMouseLeave={e => { if (!isCur) (e.currentTarget).style.background = 'transparent'; }}
                      >
                        <span style={{ flexShrink: 0, width: 11, display: 'flex', alignItems: 'center' }}>
                          {isDone
                            ? <Check size={10} color="var(--green)" strokeWidth={2.5} />
                            : <span style={{ width: 7, height: 7, borderRadius: '50%', border: '1px solid var(--line)', display: 'block' }} />}
                        </span>
                        <span style={{
                          fontSize: 11,
                          color: isCur ? 'var(--green)' : isDone ? 'var(--fg-1)' : 'var(--fg-0)',
                          flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {les.title[lang]}
                        </span>
                        <span className="mono" style={{ fontSize: 9, color: 'var(--fg-2)', flexShrink: 0 }}>
                          {les.command}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
