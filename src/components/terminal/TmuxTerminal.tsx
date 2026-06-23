'use client';
import { useState, useEffect, useRef } from 'react';

/* A REAL tmux experience inside the terminal area.
   Shows actual panes that split, a status bar, and responds to keyboard prefix. */

export type TmuxAction =
  | { type: 'new'; session: string }
  | { type: 'detach' }
  | { type: 'attach'; session: string }
  | { type: 'split-v' }   // Ctrl+B %  → left|right
  | { type: 'split-h' }   // Ctrl+B "  → top/bottom
  | { type: 'new-window' }
  | { type: 'nav'; dir: 'left'|'right'|'up'|'down' }
  | { type: 'list' }
  | { type: 'reset' };

interface Pane { id: number; }
interface TmuxStateShape {
  attached: boolean;
  session: string;
  panes: Pane[];
  layout: 'single' | 'v' | 'h' | 'triple';
  active: number;
  windows: number;
  activeWindow: number;
}

interface Props {
  nickname: string;
  fontSize?: number;
  /* External action stream from lesson commands */
  action?: TmuxAction | null;
  onPrefixHint?: (active: boolean) => void;
}

export default function TmuxTerminal({ nickname, fontSize = 13, action }: Props) {
  const [st, setSt] = useState<TmuxStateShape>({
    attached: false, session: '', panes: [{ id: 0 }], layout: 'single', active: 0, windows: 1, activeWindow: 0,
  });

  /* Apply external actions (from lesson terminal commands) */
  useEffect(() => {
    if (!action) return;
    applyAction(action);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action]);

  const applyAction = (a: TmuxAction) => {
    setSt(prev => {
      switch (a.type) {
        case 'new':
          return { attached: true, session: a.session, panes: [{ id: 0 }], layout: 'single', active: 0, windows: 1, activeWindow: 0 };
        case 'attach':
          return { ...prev, attached: true, session: a.session || prev.session || 'backend' };
        case 'detach':
          return { ...prev, attached: false };
        case 'split-v':
          if (!prev.attached) return prev;
          if (prev.layout === 'single') return { ...prev, panes: [{ id: 0 }, { id: 1 }], layout: 'v', active: 1 };
          if (prev.layout === 'v') return { ...prev, panes: [{ id: 0 }, { id: 1 }, { id: 2 }], layout: 'triple', active: 2 };
          return prev;
        case 'split-h':
          if (!prev.attached) return prev;
          if (prev.layout === 'single') return { ...prev, panes: [{ id: 0 }, { id: 1 }], layout: 'h', active: 1 };
          return prev;
        case 'new-window':
          if (!prev.attached) return prev;
          return { ...prev, windows: prev.windows + 1, activeWindow: prev.windows };
        case 'nav': {
          if (!prev.attached || prev.panes.length < 2) return prev;
          const next = (prev.active + 1) % prev.panes.length;
          return { ...prev, active: next };
        }
        case 'reset':
          return { attached: false, session: '', panes: [{ id: 0 }], layout: 'single', active: 0, windows: 1, activeWindow: 0 };
        default:
          return prev;
      }
    });
  };

  const Pane = ({ id }: { id: number }) => (
    <div style={{
      flex: 1, padding: '8px 10px', position: 'relative',
      borderColor: st.active === id ? '#5bc873' : '#1e1e1e',
      fontFamily: "'JetBrains Mono', monospace", fontSize, color: '#8b949e',
      minHeight: 0, overflow: 'hidden',
    }}>
      <div>
        <span style={{ color: '#5bc873', fontWeight: 700 }}>{nickname}@linux</span>
        <span style={{ color: '#7d8590' }}>:~$ </span>
        {st.active === id
          ? <span className="term-cursor" style={{ color: '#0d0d0d', background: '#5bc873' }}>&nbsp;</span>
          : <span style={{ color: '#555' }}>&nbsp;</span>}
      </div>
      {st.panes.length > 1 && (
        <div style={{ position: 'absolute', top: 4, right: 6, fontSize: 9, color: st.active === id ? '#5bc873' : '#444' }}>
          pane {id}
        </div>
      )}
    </div>
  );

  /* Not attached → show shell with hint */
  if (!st.attached) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0d0d0d', fontFamily: "'JetBrains Mono', monospace", fontSize, color: '#8b949e' }}>
        <div style={{ flex: 1, padding: '12px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'center', color: '#444' }}>
            <div style={{ fontSize: fontSize + 2, color: '#666', marginBottom: 8 }}>tmux</div>
            <div style={{ fontSize: fontSize - 1, lineHeight: 1.7 }}>
              Sessiya hali ochilmagan.<br />
              <span style={{ color: '#5bc873' }}>tmux new -s backend</span> buyrug&apos;ini yozing.
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* Attached → show panes + status bar */
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0d0d0d' }}>
      {/* Pane area */}
      <div style={{ flex: 1, display: 'flex', minHeight: 0,
        flexDirection: st.layout === 'h' ? 'column' : 'row' }}>
        {st.layout === 'single' && (
          <div style={{ flex: 1, display: 'flex', border: '1px solid #1e1e1e' }}><Pane id={0} /></div>
        )}
        {st.layout === 'v' && (
          <>
            <div style={{ flex: 1, display: 'flex', borderRight: st.active===0?'1px solid #5bc873':'1px solid #1e1e1e', border: st.active===0?'1px solid #5bc873':'1px solid #1e1e1e' }}><Pane id={0} /></div>
            <div style={{ flex: 1, display: 'flex', border: st.active===1?'1px solid #5bc873':'1px solid #1e1e1e' }}><Pane id={1} /></div>
          </>
        )}
        {st.layout === 'h' && (
          <>
            <div style={{ flex: 1, display: 'flex', border: st.active===0?'1px solid #5bc873':'1px solid #1e1e1e' }}><Pane id={0} /></div>
            <div style={{ flex: 1, display: 'flex', border: st.active===1?'1px solid #5bc873':'1px solid #1e1e1e' }}><Pane id={1} /></div>
          </>
        )}
        {st.layout === 'triple' && (
          <>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, display: 'flex', border: st.active===0?'1px solid #5bc873':'1px solid #1e1e1e' }}><Pane id={0} /></div>
              <div style={{ flex: 1, display: 'flex', border: st.active===1?'1px solid #5bc873':'1px solid #1e1e1e' }}><Pane id={1} /></div>
            </div>
            <div style={{ flex: 1, display: 'flex', border: st.active===2?'1px solid #5bc873':'1px solid #1e1e1e' }}><Pane id={2} /></div>
          </>
        )}
      </div>

      {/* tmux status bar */}
      <div style={{
        flexShrink: 0, background: '#5bc873', color: '#0d0d0d',
        padding: '3px 10px', display: 'flex', justifyContent: 'space-between',
        fontFamily: "'JetBrains Mono', monospace", fontSize: fontSize - 1, fontWeight: 700,
      }}>
        <span>
          {Array.from({ length: st.windows }, (_, i) => (
            <span key={i} style={{ marginRight: 12, opacity: i === st.activeWindow ? 1 : 0.55 }}>
              {i}:{i === 0 ? 'bash' : 'shell'}{i === st.activeWindow ? '*' : ''}
            </span>
          ))}
        </span>
        <span>[{st.session}]</span>
        <span style={{ opacity: 0.8 }}>{new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  );
}
