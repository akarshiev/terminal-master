'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { MODULES } from '@/data/curriculum';
import { getProgress, saveProgress, getNickname, getLang, setLang, getTheme, setTheme } from '@/lib/storage';
import { UserProgress } from '@/types';
import TerminalEmulator, { getSharedFS, resetSharedFS } from '@/components/terminal/TerminalEmulator';
import TmuxTerminal, { TmuxAction } from '@/components/terminal/TmuxTerminal';
import Sidebar from '@/components/sidebar/Sidebar';
import LessonPanel from '@/components/sidebar/LessonPanel';
import LearnNavbar from '@/components/layout/LearnNavbar';
import FileTree from '@/components/visual/FileTree';
import PermissionsVisual from '@/components/visual/PermissionsVisual';
import PipeVisual from '@/components/visual/PipeVisual';
import { ExecResult } from '@/lib/virtualfs';
import { Check, AlertTriangle, Minus, Plus, RotateCcw } from 'lucide-react';

/* ── STRICT command matching ── */
function commandMatches(typed: string, expected: string[]): boolean {
  const norm = (s: string) => s.trim().replace(/\s+/g, ' ').toLowerCase().replace(/__user__/g, '');
  const t = norm(typed);
  return expected.some(exp => {
    const e = norm(exp);
    if (t === e) return true;
    // tmux ctrl+b shortcuts — normalize spacing
    if (e.includes('ctrl+b') && t.replace(/ctrl\+b\s+/, 'ctrl+b ') === e.replace(/ctrl\+b\s+/, 'ctrl+b ')) return true;
    return false;
  });
}

/* ── Derive tmux action from a command/result ── */
function deriveTmuxAction(cmd: string, result: ExecResult): TmuxAction | null {
  if (result.tmux) {
    const tm = result.tmux;
    if (tm.action === 'new') return { type: 'new', session: tm.session || 'backend' };
    if (tm.action === 'attach') return { type: 'attach', session: tm.session || 'backend' };
    if (tm.action === 'detach') return { type: 'detach' };
    if (tm.action === 'list') return null;
  }
  const c = cmd.trim().toLowerCase().replace(/ctrl\+b\s+/, 'ctrl+b ');
  if (c === 'ctrl+b %') return { type: 'split-v' };
  if (c === 'ctrl+b "') return { type: 'split-h' };
  if (c === 'ctrl+b d') return { type: 'detach' };
  if (c === 'ctrl+b c') return { type: 'new-window' };
  if (/^ctrl\+b (left|right|up|down|←|→|↑|↓)/.test(c)) {
    const dir = c.includes('left') || c.includes('←') ? 'left'
      : c.includes('right') || c.includes('→') ? 'right'
      : c.includes('up') || c.includes('↑') ? 'up' : 'down';
    return { type: 'nav', dir };
  }
  return null;
}

type Toast = { msg: string; type: 'ok' | 'err' };

export default function LearnPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [nickname, setNickname] = useState('');
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [lang, setLg] = useState<'uz'|'en'>('uz');
  const [theme, setTh] = useState<'dark'|'light'>('dark');

  const [curMod, setCurMod] = useState(MODULES[0].id);
  const [curLes, setCurLes] = useState(MODULES[0].lessons[0].id);
  const [stepIdx, setStepIdx] = useState(0);
  const [doneSteps, setDoneSteps] = useState<string[]>([]);
  const [fsKey, setFsKey] = useState(0);
  const [toast, setToast] = useState<Toast|null>(null);

  /* Terminal mode + font size (user controllable) */
  const [termFont, setTermFont] = useState(14);
  const [tmuxMode, setTmuxMode] = useState(false);
  const [tmuxAction, setTmuxAction] = useState<TmuxAction | null>(null);

  /* Bottom visual panel */
  const [panel, setPanel] = useState<'fs' | 'perms' | 'pipe'>('fs');

  const progressRef = useRef(progress);
  progressRef.current = progress;
  const doneRef = useRef(doneSteps);
  doneRef.current = doneSteps;

  useEffect(() => {
    setMounted(true);
    const nick = getNickname();
    const prog = getProgress();
    if (!nick || !prog) { router.push('/'); return; }
    setNickname(nick);
    setProgress(prog);
    setLg(getLang());
    setTh(getTheme());
  }, []);

  const L = (u: string, e: string) => lang === 'uz' ? u : e;
  const mod = MODULES.find(m => m.id === curMod) || MODULES[0];
  const les = mod.lessons.find(l => l.id === curLes) || mod.lessons[0];
  const step = les.steps[stepIdx];

  const notify = (msg: string, type: 'ok'|'err') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  /* Switch tmux mode based on the active lesson */
  useEffect(() => {
    const isTmux = step?.visualEffect === 'tmux';
    setTmuxMode(isTmux);
    if (step?.visualEffect === 'permissions') setPanel('perms');
    else if (step?.visualEffect === 'pipe') setPanel('pipe');
    else setPanel('fs');
  }, [step?.id]);

  const handleCommand = useCallback((cmd: string, result: ExecResult) => {
    const prog = progressRef.current;
    const done = doneRef.current;
    if (!step || !prog) return;

    /* Tmux side-effects → drive the in-terminal tmux */
    if (step.visualEffect === 'tmux') {
      const action = deriveTmuxAction(cmd, result);
      if (action) setTmuxAction({ ...action } as TmuxAction);
    }

    /* Validation: strict command match (and not an error result) */
    const matched = commandMatches(cmd, step.expectedCommands) && !result.error;

    if (matched && !done.includes(step.id)) {
      const next = [...done, step.id];
      setDoneSteps(next);
      notify(step.successMessage[lang], 'ok');

      const allDone = les.steps.every(s => next.includes(s.id));
      if (allDone && !prog.completedLessons.includes(les.id)) {
        const np = { ...prog, completedLessons: [...prog.completedLessons, les.id], xp: (prog.xp || 0) + 50 };
        setProgress(np);
        saveProgress(np);
        setTimeout(() => notify(L('Dars tugallandi! +50 ⚡', 'Lesson complete! +50 ⚡'), 'ok'), 600);
      }

      setTimeout(() => setStepIdx(i => (i < les.steps.length - 1 ? i + 1 : i)), 1100);
    } else if (!matched && !result.error && step.expectedCommands.length > 0 && cmd.trim()) {
      /* Wrong command — gentle nudge (only if it ran without error but doesn't match) */
      // No penalty, just no progress. Stay quiet to avoid noise.
    }

    setFsKey(k => k + 1);
  }, [step, les, lang]);

  const selectLesson = (mId: string, lId: string) => {
    setCurMod(mId); setCurLes(lId); setStepIdx(0); setDoneSteps([]);
    setTmuxAction({ type: 'reset' });
  };

  const allLessons = MODULES.flatMap(m => m.lessons);
  const gIdx = allLessons.findIndex(l => l.id === curLes);

  const prev = () => {
    const li = mod.lessons.findIndex(l => l.id === curLes);
    if (li > 0) selectLesson(curMod, mod.lessons[li - 1].id);
    else {
      const mi = MODULES.findIndex(m => m.id === curMod);
      if (mi > 0) { const pm = MODULES[mi-1]; selectLesson(pm.id, pm.lessons[pm.lessons.length-1].id); }
    }
  };
  const next = () => {
    const li = mod.lessons.findIndex(l => l.id === curLes);
    if (li < mod.lessons.length - 1) selectLesson(curMod, mod.lessons[li + 1].id);
    else {
      const mi = MODULES.findIndex(m => m.id === curMod);
      if (mi < MODULES.length - 1) { const nm = MODULES[mi+1]; selectLesson(nm.id, nm.lessons[0].id); }
    }
  };

  const toggleTheme = () => {
    const n = theme === 'dark' ? 'light' : 'dark';
    setTheme(n); setTh(n);
    document.documentElement.setAttribute('data-theme', n);
  };
  const toggleLang = () => { const n = lang === 'uz' ? 'en' : 'uz'; setLang(n); setLg(n); };

  const resetTerminal = () => {
    resetSharedFS(nickname);
    setFsKey(k => k + 1);
    setTmuxAction({ type: 'reset' });
    notify(L('Terminal qayta tiklandi', 'Terminal reset'), 'ok');
  };

  if (!mounted || !progress) return null;
  const fs = getSharedFS(nickname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg-1)', color: 'var(--fg-0)', overflow: 'hidden' }}>
      <LearnNavbar
        nickname={nickname} xp={progress.xp || 0}
        currentModule={mod.title[lang]}
        theme={theme} lang={lang}
        onToggleTheme={toggleTheme}
        onToggleLang={toggleLang}
      />

      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {/* LEFT: module sidebar */}
        <Sidebar
          modules={MODULES} progress={progress}
          currentModuleId={curMod} currentLessonId={curLes}
          onSelectLesson={selectLesson} lang={lang}
        />

        {/* CENTER: terminal + visual */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, borderRight: '1px solid var(--line)' }}>
          {/* Terminal toolbar */}
          <div style={{
            height: 38, flexShrink: 0, borderBottom: '1px solid var(--line)',
            background: 'var(--t-title)', display: 'flex', alignItems: 'center',
            padding: '0 12px', gap: 8,
          }}>
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e', display: 'block' }} />
            <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f', display: 'block' }} />
            <span className="mono" style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#444' }}>
              {tmuxMode ? `tmux — ${nickname}@linux` : `${nickname}@linux:${fs.getPromptPath()}`}
            </span>
            {/* Font controls */}
            <button onClick={() => setTermFont(f => Math.max(11, f - 1))} title="Kichraytirish" style={ctrlBtn}>
              <Minus size={12} />
            </button>
            <span className="mono" style={{ fontSize: 10, color: 'var(--fg-2)', minWidth: 26, textAlign: 'center' }}>{termFont}px</span>
            <button onClick={() => setTermFont(f => Math.min(20, f + 1))} title="Kattalashtirish" style={ctrlBtn}>
              <Plus size={12} />
            </button>
            <button onClick={resetTerminal} title="Qayta tiklash" style={ctrlBtn}>
              <RotateCcw size={11} />
            </button>
          </div>

          {/* Terminal / Tmux area */}
          <div style={{ flex: 1, overflow: 'hidden', minHeight: 0, background: 'var(--t-bg)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: tmuxMode ? '0 0 50%' : 1, minHeight: 0, overflow: 'hidden' }}>
              <TerminalEmulator
                key={`${nickname}-${fsKey === -1 ? 'r' : 'n'}`}
                nickname={nickname}
                fontSize={termFont}
                tmuxMode={tmuxMode}
                onCommand={handleCommand}
                onRefresh={() => setFsKey(k => k + 1)}
              />
            </div>
            {tmuxMode && (
              <div style={{ flex: '0 0 50%', minHeight: 0, borderTop: '2px solid var(--green-border)', overflow: 'hidden' }}>
                <TmuxTerminal nickname={nickname} fontSize={termFont} action={tmuxAction} />
              </div>
            )}
          </div>

          {/* Bottom visual panel */}
          <div style={{ height: 172, flexShrink: 0, borderTop: '1px solid var(--line)', background: 'var(--bg-2)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '5px 12px', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
              {(['fs', 'perms', 'pipe'] as const).map(p => (
                <button key={p} onClick={() => setPanel(p)} className="mono" style={{
                  padding: '2px 9px', borderRadius: 4, fontSize: 9, cursor: 'pointer',
                  border: '1px solid', textTransform: 'uppercase', letterSpacing: '0.06em',
                  background: panel === p ? 'var(--bg-4)' : 'transparent',
                  color: panel === p ? 'var(--green)' : 'var(--fg-2)',
                  borderColor: panel === p ? 'var(--green-border)' : 'transparent',
                }}>
                  {p === 'fs' ? L('Fayllar', 'Files') : p === 'perms' ? L('Ruxsat', 'Perms') : 'Pipe'}
                </button>
              ))}
              {panel === 'fs' && (
                <span className="mono" style={{ fontSize: 9, color: 'var(--fg-2)', marginLeft: 'auto' }}>{fs.getCurrentPath()}</span>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '8px 12px' }}>
              {panel === 'fs' && <FileTree key={fsKey} node={fs.getFS()} activePath={fs.getCurrentPath()} />}
              {panel === 'perms' && <PermissionsVisual lang={lang} />}
              {panel === 'pipe' && <PipeVisual lang={lang} />}
            </div>
          </div>
        </div>

        {/* RIGHT: lesson guide */}
        <div style={{ width: 340, flexShrink: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <LessonPanel
            module={mod} lesson={les}
            currentStepIdx={stepIdx}
            completedSteps={doneSteps}
            onPrev={prev} onNext={next}
            hasPrev={gIdx > 0} hasNext={gIdx < allLessons.length - 1}
            lang={lang}
          />
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 20, right: 20, zIndex: 200,
          padding: '11px 16px', borderRadius: 8,
          border: `1px solid ${toast.type === 'ok' ? 'var(--green-border)' : 'rgba(248,81,73,0.3)'}`,
          background: toast.type === 'ok' ? 'var(--green-dim)' : 'rgba(248,81,73,0.08)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, maxWidth: 340,
          boxShadow: '0 8px 28px rgba(0,0,0,0.5)', animation: 'fade-up 0.2s ease',
        }}>
          {toast.type === 'ok'
            ? <Check size={15} color="var(--green)" strokeWidth={2.5} />
            : <AlertTriangle size={15} color="var(--red)" />}
          <span style={{ color: toast.type === 'ok' ? 'var(--green)' : 'var(--red)' }}>{toast.msg}</span>
        </div>
      )}
    </div>
  );
}

const ctrlBtn: React.CSSProperties = {
  width: 24, height: 24, borderRadius: 5, border: '1px solid var(--line)',
  background: 'var(--bg-3)', color: 'var(--fg-1)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
};
