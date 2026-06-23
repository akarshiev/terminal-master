'use client';
import { Moon, Sun, GitBranch, Send, BookOpen, Zap } from 'lucide-react';
import Link from 'next/link';

interface Props {
  nickname: string;
  xp: number;
  currentModule?: string;
  theme: 'dark' | 'light';
  lang: 'uz' | 'en';
  onToggleTheme: () => void;
  onToggleLang: () => void;
}

export default function LearnNavbar({ nickname, xp, currentModule, theme, lang, onToggleTheme, onToggleLang }: Props) {
  return (
    <nav style={{
      height: 48, flexShrink: 0,
      borderBottom: '1px solid var(--line)',
      background: 'var(--bg-1)',
      display: 'flex', alignItems: 'center',
      padding: '0 16px', gap: 12,
    }}>
      <Link href="/" style={{ fontWeight: 700, fontSize: 14, color: 'var(--fg-0)', textDecoration: 'none', letterSpacing: '-0.03em', flexShrink: 0 }}>
        TerminalMaster
      </Link>

      {currentModule && (
        <>
          <span style={{ color: 'var(--fg-2)', fontSize: 16, lineHeight: 1 }}>/</span>
          <span style={{ fontSize: 12, color: 'var(--fg-1)', flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 200 }}>
            {currentModule}
          </span>
        </>
      )}

      <div style={{ flex: 1 }} />

      {/* Nav links */}
      <NavA href="https://github.com/akarshiev/terminal-master"><BookOpen size={13} />&nbsp;Docs</NavA>
      <NavA href="https://github.com/akarshiev"><GitBranch size={13} />&nbsp;GitHub</NavA>
      <NavA href="https://t.me/abdukarim_qarshiyev"><Send size={13} />&nbsp;Telegram</NavA>

      <div style={{ width: 1, height: 16, background: 'var(--line)', flexShrink: 0 }} />

      {/* XP */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 5, background: 'var(--bg-3)', border: '1px solid var(--line)', flexShrink: 0 }}>
        <Zap size={11} color="var(--yellow)" />
        <span className="mono" style={{ fontSize: 11, color: 'var(--yellow)', fontWeight: 700 }}>{xp}</span>
      </div>

      {/* Nickname */}
      <span className="mono" style={{ fontSize: 11, color: 'var(--fg-2)', flexShrink: 0 }}>
        <span style={{ color: 'var(--green)' }}>{nickname}</span>@linux
      </span>

      <div style={{ width: 1, height: 16, background: 'var(--line)', flexShrink: 0 }} />

      <button onClick={onToggleLang} className="mono" style={{
        padding: '3px 8px', borderRadius: 5, flexShrink: 0,
        border: '1px solid var(--line)', background: 'transparent',
        color: 'var(--fg-1)', fontSize: 10, fontWeight: 700, cursor: 'pointer',
      }}>{lang === 'uz' ? 'EN' : 'UZ'}</button>

      <button onClick={onToggleTheme} style={{
        width: 28, height: 28, borderRadius: 5, flexShrink: 0,
        border: '1px solid var(--line)', background: 'var(--bg-3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', color: 'var(--fg-1)',
      }}>
        {theme === 'dark' ? <Sun size={12} /> : <Moon size={12} />}
      </button>
    </nav>
  );
}

function NavA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      display: 'flex', alignItems: 'center',
      fontSize: 12, color: 'var(--fg-1)', textDecoration: 'none',
      transition: 'color 0.1s', flexShrink: 0, whiteSpace: 'nowrap',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-0)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--fg-1)'; }}
    >{children}</a>
  );
}
