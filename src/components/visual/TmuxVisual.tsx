'use client';
import { useState } from 'react';

type TState = 'idle' | 'session' | 'detached' | 'split-v' | 'split-h' | 'triple' | 'multi-window';

interface Props {
  state?: TState;
  sessionName?: string;
  nickname?: string;
  lang?: 'uz' | 'en';
  /* Controlled from outside: set when user types tmux commands */
  controlled?: boolean;
  externalState?: TState;
  externalActive?: number;
  externalSessName?: string;
  externalWindows?: number;
}

export default function TmuxVisual({
  state: initState = 'idle',
  sessionName: initSessName = 'backend',
  nickname = 'user',
  lang = 'uz',
  controlled = false,
  externalState,
  externalActive = 0,
  externalSessName,
  externalWindows = 1,
}: Props) {
  const [state,    setState]    = useState<TState>(initState);
  const [active,   setActive]   = useState(0);
  const [sessName, setSessName] = useState(initSessName);
  const [windows,  setWindows]  = useState(1);

  // If controlled from parent, use external state
  const S       = controlled ? (externalState ?? state) : state;
  const A       = controlled ? externalActive : active;
  const SN      = controlled ? (externalSessName ?? sessName) : sessName;
  const WN      = controlled ? externalWindows : windows;

  const L = (u: string, e: string) => lang === 'uz' ? u : e;
  const P = (id: number, label?: string) => (
    <div className={`tp ${A === id ? 'active' : ''}`}
      style={{ flex: 1, cursor: controlled ? 'default' : 'pointer' }}
      onClick={() => !controlled && setActive(id)}
    >
      <span style={{ color: '#3fb950', fontWeight: 600 }}>{nickname}@linux</span>
      <span style={{ color: '#444' }}>:~$ </span>
      {A === id
        ? <span style={{ color: '#3fb950' }}>█</span>
        : <span style={{ color: '#333' }}>_</span>}
      {label && <div style={{ color: '#333', fontSize: 10, marginTop: 3 }}>{label}</div>}
      {A === id && (
        <span style={{ position: 'absolute', bottom: 3, right: 6, fontSize: 9, color: '#3fb950', opacity: 0.6 }}>
          ACTIVE
        </span>
      )}
    </div>
  );

  /* Status bar at bottom */
  const StatusBar = () => (
    <div style={{
      background: '#3fb950', color: '#000',
      padding: '1px 8px', display: 'flex', justifyContent: 'space-between',
      fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700,
    }}>
      <span>
        {Array.from({ length: WN }, (_, i) => (
          <span key={i} style={{ marginRight: 10, opacity: i === 0 ? 1 : 0.6 }}>
            [{i}] {i === 0 ? 'bash' : 'vim'}
          </span>
        ))}
      </span>
      <span>{SN}</span>
      <span style={{ opacity: 0.7 }}>80×24</span>
    </div>
  );

  return (
    <div style={{ borderRadius: 7, border: '1px solid var(--line)', overflow: 'hidden', fontSize: 13 }}>
      {/* Title bar */}
      <div style={{
        background: '#141414', padding: '7px 12px',
        display: 'flex', alignItems: 'center', gap: 7,
        borderBottom: '1px solid #1a1a1a',
      }}>
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ff5f56', display: 'block' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#ffbd2e', display: 'block' }} />
        <span style={{ width: 11, height: 11, borderRadius: '50%', background: '#27c93f', display: 'block' }} />
        <span style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#333', fontFamily: 'monospace' }}>
          ZSH — 80×24
        </span>
      </div>

      {/* Content */}
      <div style={{ background: '#0d0d0d' }}>
        {S === 'idle' && (
          <div style={{ padding: '20px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#2a2a2a', textAlign: 'center' }}>
            {L("tmux buyrug'ini yozing", "type a tmux command to begin")}
          </div>
        )}

        {S === 'session' && (
          <>
            <div style={{ padding: '10px 12px', minHeight: 70 }}>
              {P(0)}
            </div>
            <StatusBar />
          </>
        )}

        {S === 'split-v' && (
          <>
            <div style={{ display: 'flex', minHeight: 80 }}>
              <div style={{ flex: 1, borderRight: '1px solid #222' }}>{P(0, L('Chap', 'Left'))}</div>
              <div style={{ flex: 1 }}>{P(1, L("O'ng", 'Right'))}</div>
            </div>
            <StatusBar />
          </>
        )}

        {S === 'split-h' && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: 90 }}>
              <div style={{ flex: 1, borderBottom: '1px solid #222' }}>{P(0, L('Yuqori', 'Top'))}</div>
              <div style={{ flex: 1 }}>{P(1, L('Quyi', 'Bottom'))}</div>
            </div>
            <StatusBar />
          </>
        )}

        {S === 'triple' && (
          <>
            <div style={{ display: 'flex', minHeight: 110 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRight: '1px solid #222' }}>
                <div style={{ flex: 1, borderBottom: '1px solid #222' }}>{P(0)}</div>
                <div style={{ flex: 1 }}>{P(1)}</div>
              </div>
              <div style={{ flex: 1 }}>{P(2, L("O'ng", 'Right'))}</div>
            </div>
            <StatusBar />
          </>
        )}

        {S === 'multi-window' && (
          <>
            <div style={{ padding: '10px 12px', minHeight: 70 }}>
              {P(0)}
            </div>
            <StatusBar />
          </>
        )}

        {S === 'detached' && (
          <div style={{ padding: '14px 16px', fontFamily: "'JetBrains Mono', monospace", fontSize: 12 }}>
            <div style={{ color: '#444', marginBottom: 10 }}>
              [detached (from session {SN})]
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#3fb950', display: 'block', boxShadow: '0 0 4px #3fb950' }} />
              <span style={{ color: '#3fb950' }}>
                {SN}: 1 {L("oyna — orqada ishlayapti", "window — running in background")}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Manual controls (only when NOT controlled externally) */}
      {!controlled && (
        <div style={{
          display: 'flex', gap: 4, padding: '8px', flexWrap: 'wrap',
          background: 'var(--bg-2)', borderTop: '1px solid var(--line)',
        }}>
          {([
            ['idle',         'Reset'],
            ['session',      'new -s'],
            ['detached',     'detach (B+D)'],
            ['split-v',      'split | (B+%)'],
            ['split-h',      'split — (B+")'],
            ['triple',       '3 pane'],
            ['multi-window', 'new win (B+C)'],
          ] as [TState, string][]).map(([s, lbl]) => (
            <button key={s} onClick={() => { setState(s); setActive(0); }}
              className="mono"
              style={{
                padding: '3px 8px', borderRadius: 4,
                border: '1px solid', fontSize: 10, cursor: 'pointer',
                background: S === s ? 'var(--bg-4)' : 'var(--bg-3)',
                color: S === s ? 'var(--green)' : 'var(--fg-2)',
                borderColor: S === s ? 'var(--green-border)' : 'var(--line)',
                transition: 'all 0.1s',
              }}>{lbl}</button>
          ))}
        </div>
      )}
    </div>
  );
}
