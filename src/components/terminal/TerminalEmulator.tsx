'use client';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { VirtualFS, ExecResult } from '@/lib/virtualfs';

interface Props {
  nickname: string;
  fontSize?: number;
  tmuxMode?: boolean;
  onCommand?: (cmd: string, result: ExecResult) => void;
  onRefresh?: () => void;
}

const fsMap = new Map<string, VirtualFS>();
export function getSharedFS(nick: string) {
  if (!fsMap.has(nick)) fsMap.set(nick, new VirtualFS(nick));
  return fsMap.get(nick)!;
}
export function resetSharedFS(nick: string) {
  fsMap.set(nick, new VirtualFS(nick));
  return fsMap.get(nick)!;
}

/* Colorized prompt — Fedora/Fish style with arrow */
function Prompt({ user, path }: { user: string; path: string }) {
  return (
    <span style={{ userSelect: 'none' }}>
      <span style={{ color: '#5bc873', fontWeight: 700 }}>{user}</span>
      <span style={{ color: '#7d8590' }}>@linux</span>
      <span style={{ color: '#7d8590' }}>:</span>
      <span style={{ color: '#6cb6ff', fontWeight: 700 }}>{path}</span>
      <span style={{ color: '#d29922' }}> ❯</span>
      <span> </span>
    </span>
  );
}

/* ANSI dir-blue renderer */
function Ansi({ text }: { text: string }) {
  if (!text.includes('\x1b')) return <>{text}</>;
  const parts = text.split(/(\x1b\[34m|\x1b\[0m)/);
  let blue = false;
  return <>{parts.map((p, i) => {
    if (p === '\x1b[34m') { blue = true; return null; }
    if (p === '\x1b[0m') { blue = false; return null; }
    return <span key={i} style={blue ? { color: '#6cb6ff', fontWeight: 600 } : undefined}>{p}</span>;
  })}</>;
}

type Row =
  | { kind: 'welcome'; id: string }
  | { kind: 'cmd'; id: string; path: string; text: string }
  | { kind: 'out'; id: string; text: string; err?: boolean };

let rowSeq = 0;

export default function TerminalEmulator({ nickname, fontSize = 14, tmuxMode = false, onCommand, onRefresh }: Props) {
  const fs = useMemo(() => getSharedFS(nickname), [nickname]);

  const [rows, setRows] = useState<Row[]>([{ kind: 'welcome', id: 'w' }]);
  const [draft, setDraft] = useState('');
  const [cursor, setCursor] = useState(0);       // cursor position within draft
  const [hist, setHist] = useState<string[]>([]);
  const [hidx, setHidx] = useState(-1);
  const [prefixArmed, setPrefixArmed] = useState(false);  // tmux Ctrl+B prefix
  const [, forceTick] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const hiddenRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [rows, draft]);

  const push = useCallback((row: Omit<Row, 'id'> & { id?: string }) => {
    setRows(prev => [...prev, { ...row, id: `r${rowSeq++}` } as Row]);
  }, []);

  const submit = useCallback(() => {
    const raw = draft;
    const path = fs.getPromptPath();
    push({ kind: 'cmd', path, text: raw } as Row);
    setDraft('');
    setCursor(0);
    setHidx(-1);

    if (!raw.trim()) return;

    const result = fs.execute(raw);
    if (result.clear) {
      setRows([]);
    } else if (result.output) {
      push({ kind: 'out', text: result.output, err: result.error } as Row);
    }

    setHist(prev => [raw, ...prev.filter(h => h !== raw)].slice(0, 200));
    forceTick(n => n + 1);

    onCommand?.(raw, result);
    onRefresh?.();
  }, [draft, fs, push, onCommand, onRefresh]);

  /* Keyboard handling — preventDefault on ALL special keys to stop browser shortcuts */
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // ── Tmux prefix armed: next key is a tmux command ──
    if (prefixArmed) {
      e.preventDefault();
      setPrefixArmed(false);
      const k = e.key;
      let tmuxCmd: string | null = null;
      if (k === 'd' || k === 'D') tmuxCmd = 'ctrl+b d';
      else if (k === '%') tmuxCmd = 'ctrl+b %';
      else if (k === '"') tmuxCmd = 'ctrl+b "';
      else if (k === 'c' || k === 'C') tmuxCmd = 'ctrl+b c';
      else if (k === 'ArrowLeft') tmuxCmd = 'ctrl+b left';
      else if (k === 'ArrowRight') tmuxCmd = 'ctrl+b right';
      else if (k === 'ArrowUp') tmuxCmd = 'ctrl+b up';
      else if (k === 'ArrowDown') tmuxCmd = 'ctrl+b down';
      if (tmuxCmd) {
        push({ kind: 'cmd', path: fs.getPromptPath(), text: `[tmux] ${tmuxCmd}` } as Row);
        onCommand?.(tmuxCmd, { output: '', effect: 'tmux' });
      }
      return;
    }

    // ── Ctrl combos — block browser entirely ──
    if (e.ctrlKey || e.metaKey) {
      const k = e.key.toLowerCase();
      if (k === 'b') { e.preventDefault(); if (tmuxMode) setPrefixArmed(true); return; } // tmux prefix
      if (k === 'l') { e.preventDefault(); setRows([]); return; }
      if (k === 'c') { e.preventDefault(); push({ kind: 'cmd', path: fs.getPromptPath(), text: draft + '^C' } as Row); setDraft(''); setCursor(0); return; }
      if (k === 'a') { e.preventDefault(); setCursor(0); return; }       // start of line
      if (k === 'e') { e.preventDefault(); setCursor(draft.length); return; } // end of line
      if (k === 'u') { e.preventDefault(); setDraft(draft.slice(cursor)); setCursor(0); return; } // clear before
      if (k === 'k') { e.preventDefault(); setDraft(draft.slice(0, cursor)); return; }            // clear after
      if (k === 'w') { e.preventDefault();
        const before = draft.slice(0, cursor).replace(/\s*\S+\s*$/, '');
        setDraft(before + draft.slice(cursor)); setCursor(before.length); return;
      }
      if (k === 'v') return; // allow paste
      return;
    }

    if (e.key === 'Enter') { e.preventDefault(); submit(); return; }

    if (e.key === 'ArrowLeft') { e.preventDefault(); setCursor(c => Math.max(0, c - 1)); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); setCursor(c => Math.min(draft.length, c + 1)); return; }
    if (e.key === 'Home') { e.preventDefault(); setCursor(0); return; }
    if (e.key === 'End') { e.preventDefault(); setCursor(draft.length); return; }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = Math.min(hidx + 1, hist.length - 1);
      if (hist[i] !== undefined) { setHidx(i); setDraft(hist[i]); setCursor(hist[i].length); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = Math.max(hidx - 1, -1);
      setHidx(i);
      const v = i < 0 ? '' : hist[i];
      setDraft(v); setCursor(v.length);
      return;
    }

    if (e.key === 'Tab') {
      e.preventDefault();
      const node = fs.getCurrentNode();
      if (!node?.children) return;
      const words = draft.split(' ');
      const last = words[words.length - 1];
      const hits = node.children.filter(c => c.name.startsWith(last));
      if (hits.length === 1) {
        words[words.length - 1] = hits[0].name + (hits[0].type === 'dir' ? '/' : '');
        const nd = words.join(' ');
        setDraft(nd); setCursor(nd.length);
      }
      return;
    }

    if (e.key === 'Backspace') {
      e.preventDefault();
      if (cursor > 0) {
        setDraft(draft.slice(0, cursor - 1) + draft.slice(cursor));
        setCursor(c => c - 1);
      }
      return;
    }
    if (e.key === 'Delete') {
      e.preventDefault();
      setDraft(draft.slice(0, cursor) + draft.slice(cursor + 1));
      return;
    }

    // Regular printable character
    if (e.key.length === 1) {
      e.preventDefault();
      setDraft(draft.slice(0, cursor) + e.key + draft.slice(cursor));
      setCursor(c => c + 1);
    }
  };

  /* Handle paste */
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text').replace(/\n/g, ' ');
    setDraft(draft.slice(0, cursor) + text + draft.slice(cursor));
    setCursor(c => c + text.length);
  };

  const curPath = fs.getPromptPath();

  /* Render draft with cursor in the middle */
  const renderDraft = () => {
    const before = draft.slice(0, cursor);
    const at = draft[cursor] || ' ';
    const after = draft.slice(cursor + 1);
    return (
      <>
        <span style={{ color: '#dfe6ee' }}>{before}</span>
        <span className="term-cursor" style={{ color: '#0d0d0d', background: '#5bc873' }}>{at}</span>
        <span style={{ color: '#dfe6ee' }}>{after}</span>
      </>
    );
  };

  return (
    <div
      style={{
        display: 'flex', flexDirection: 'column',
        height: '100%', minHeight: 0,
        background: 'var(--t-bg)',
        fontFamily: "'JetBrains Mono', 'Cascadia Code', monospace",
        fontSize, lineHeight: 1.55,
        cursor: 'text',
      }}
      onClick={() => hiddenRef.current?.focus()}
    >
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', minHeight: 0 }}>
        {rows.map(row => {
          if (row.kind === 'welcome') return (
            <div key={row.id} style={{ color: '#5a5a5a', marginBottom: 8, fontSize: fontSize - 1 }}>
              <span style={{ color: '#39c5cf' }}>TerminalMaster</span> — Linux o&apos;rganish terminali
              <br />
              <span style={{ color: '#3a3a3a' }}>O&apos;ngdagi qo&apos;llanmani o&apos;qing va buyruqlarni shu yerda sinab ko&apos;ring.</span>
            </div>
          );
          if (row.kind === 'cmd') return (
            <div key={row.id} style={{ display: 'flex', flexWrap: 'wrap', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              <Prompt user={nickname} path={row.path} />
              <span style={{ color: '#dfe6ee' }}>{row.text}</span>
            </div>
          );
          return (
            <div key={row.id} style={{ color: row.err ? '#ff7b72' : '#adbac7', whiteSpace: 'pre-wrap', wordBreak: 'break-word', marginBottom: 2 }}>
              <Ansi text={row.text} />
            </div>
          );
        })}

        {/* Live editable line */}
        <div style={{ display: 'flex', flexWrap: 'wrap', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          <Prompt user={nickname} path={curPath} />
          {renderDraft()}
        </div>

        <input
          ref={hiddenRef}
          value=""
          onKeyDown={handleKey}
          onPaste={handlePaste}
          onChange={() => {}}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          style={{ position: 'absolute', opacity: 0, width: 1, height: 1, pointerEvents: 'none' }}
        />
      </div>
    </div>
  );
}
