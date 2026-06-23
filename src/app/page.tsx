'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Moon, Sun, GitBranch, Send, BookOpen, ChevronRight } from 'lucide-react';
import { getNickname, saveNickname, initProgress, getLang, setLang, getTheme, setTheme } from '@/lib/storage';
import { MODULES, getTotalLessons } from '@/data/curriculum';

type DR = { kind: 'cmd'; path: string; text: string } | { kind: 'out'; text: string };
const DEMO: { row: DR; delay: number }[] = [
  { row: { kind: 'cmd', path: '~',        text: 'pwd' },              delay: 700 },
  { row: { kind: 'out',                   text: '/home/akarshiev' },   delay: 200 },
  { row: { kind: 'cmd', path: '~',        text: 'ls -la' },            delay: 900 },
  { row: { kind: 'out',                   text: 'drwxr-xr-x  projects\n-rw-r--r--  notes.md\n-rw-r--r--  README.md' }, delay: 220 },
  { row: { kind: 'cmd', path: '~',        text: 'cd projects' },       delay: 900 },
  { row: { kind: 'cmd', path: '~/projects', text: 'git status' },      delay: 700 },
  { row: { kind: 'out',                   text: 'On branch main\nYour branch is up to date.\nnothing to commit' }, delay: 220 },
];

function DPrompt({ path }: { path: string }) {
  return (
    <>
      <span style={{ color: '#3fb950', fontWeight: 600 }}>akarshiev</span>
      <span style={{ color: '#484f58' }}>@linux:</span>
      <span style={{ color: '#58a6ff' }}>{path}</span>
      <span style={{ color: '#e0a458' }}> → </span>
    </>
  );
}

export default function Home() {
  const [nick, setNick] = useState('');
  const [err,  setErr]  = useState('');
  const [theme, setTh]  = useState<'dark'|'light'>('dark');
  const [lang,  setLg]  = useState<'uz'|'en'>('uz');
  const [mounted, setM] = useState(false);
  const [demo,  setDemo] = useState<DR[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const router   = useRouter();

  useEffect(() => {
    setM(true);
    setTh(getTheme());
    setLg(getLang());
    const saved = getNickname();
    if (saved) setNick(saved);

    let i = 0;
    const next = () => {
      if (i >= DEMO.length) return;
      const item = DEMO[i++];
      setTimeout(() => { setDemo(p => [...p, item.row]); next(); }, item.delay);
    };
    setTimeout(next, 500);
  }, []);

  const toggleTheme = () => {
    const n = theme === 'dark' ? 'light' : 'dark';
    setTheme(n); setTh(n);
    document.documentElement.setAttribute('data-theme', n);
  };
  const toggleLang = () => { const n = lang === 'uz' ? 'en' : 'uz'; setLang(n); setLg(n); };

  const start = () => {
    const t = nick.trim();
    if (!t) { setErr(lang==='uz'?'Nickname kiriting':'Enter nickname'); return; }
    if (t.length < 2) { setErr(lang==='uz'?'Kamida 2 belgi':'At least 2 chars'); return; }
    if (!/^[a-zA-Z0-9_-]+$/.test(t)) { setErr(lang==='uz'?'Faqat harf, raqam, _ va -':'Only a-z 0-9 _ -'); return; }
    saveNickname(t); initProgress(t); router.push('/learn');
  };

  const L = (u: string, e: string) => lang === 'uz' ? u : e;

  if (!mounted) return null;

  return (
    <div style={{ background: 'var(--bg-1)', minHeight: '100vh', color: 'var(--fg-0)' }}>

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 52, borderBottom: '1px solid var(--line)',
        background: 'var(--bg-1)',
      }}>
        {/* Container */}
        <div style={{ maxWidth: 1080, margin: '0 auto', height: '100%', padding: '0 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontWeight: 700, fontSize: 14, letterSpacing: '-0.03em' }}>TerminalMaster</span>
          <div style={{ flex: 1 }} />
          <NavA href="https://github.com/akarshiev/terminal-master"><BookOpen size={13} />&nbsp;Docs</NavA>
          <NavA href="https://github.com/akarshiev"><GitBranch size={13} />&nbsp;GitHub</NavA>
          <NavA href="https://t.me/abdukarim_qarshiyev"><Send size={13} />&nbsp;Telegram</NavA>
          <div style={{ width: 1, height: 16, background: 'var(--line)' }} />
          <button onClick={toggleLang} className="mono" style={{ padding:'3px 8px', borderRadius:5, border:'1px solid var(--line)', background:'transparent', color:'var(--fg-1)', fontSize:10, fontWeight:700, cursor:'pointer' }}>
            {lang==='uz'?'EN':'UZ'}
          </button>
          <button onClick={toggleTheme} style={{ width:30, height:30, borderRadius:6, border:'1px solid var(--line)', background:'var(--bg-3)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--fg-1)' }}>
            {theme==='dark'?<Sun size={13}/>:<Moon size={13}/>}
          </button>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>
        <section style={{
          paddingTop: 100, paddingBottom: 72,
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 56, alignItems: 'center',
        }}>
          {/* LEFT */}
          <div>
            <p className="mono" style={{ fontSize: 11, color: 'var(--green)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>
              {L('// Backend developerlar uchun', '// For backend developers')}
            </p>
            <h1 style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 20 }}>
              {L('Linux Terminalini', 'Master the Linux')}
              <br />
              <span style={{ color: 'var(--fg-2)' }}>{L("o'zlashtiring.", 'Terminal.')}</span>
            </h1>
            <p style={{ fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.7, marginBottom: 36, maxWidth: 420 }}>
              {L(
                "Interaktiv terminal muhitida buyruqlarni mashq qiling. pwd, cd, chmod, tmux — hammasi brauzerda, hech narsa o'rnatmasdan.",
                "Practice Linux commands in an interactive terminal. pwd, cd, chmod, tmux — all in the browser, zero setup.",
              )}
            </p>

            {/* Input row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <span className="mono" style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--fg-2)', fontSize:13, pointerEvents:'none' }}>$</span>
                <input
                  ref={inputRef}
                  value={nick}
                  onChange={e => { setNick(e.target.value); setErr(''); }}
                  onKeyDown={e => e.key==='Enter' && start()}
                  placeholder={L('nickname kiriting', 'enter nickname')}
                  className="mono"
                  style={{ width:'100%', padding:'11px 12px 11px 28px', borderRadius:7, border:`1px solid ${err?'var(--red)':'var(--line)'}`, background:'var(--bg-3)', color:'var(--fg-0)', fontSize:13, outline:'none', transition:'border-color 0.12s' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--green)'; }}
                  onBlur={e => { e.target.style.borderColor = err ? 'var(--red)' : 'var(--line)'; }}
                />
              </div>
              <button onClick={start} style={{ padding:'11px 22px', borderRadius:7, border:'none', background:'var(--fg-0)', color:'var(--bg-1)', fontWeight:700, fontSize:13, cursor:'pointer', display:'flex', alignItems:'center', gap:5, flexShrink:0, transition:'opacity 0.12s' }}
                onMouseEnter={e=>{e.currentTarget.style.opacity='0.82'}}
                onMouseLeave={e=>{e.currentTarget.style.opacity='1'}}
              >
                {L('Boshlash','Start')} <ChevronRight size={14}/>
              </button>
            </div>
            {err && <p className="mono" style={{ fontSize:11, color:'var(--red)', marginBottom:6 }}>{err}</p>}
            <p className="mono" style={{ fontSize:11, color:'var(--fg-2)', marginTop:14 }}>
              <span style={{ color:'var(--green)' }}>●</span>&nbsp;
              {L('Bepul · Serverisiz · localStorage','Free · No server · localStorage')}
            </p>
          </div>

          {/* RIGHT — demo terminal */}
          <div style={{ background:'#0d0d0d', border:'1px solid #1e1e1e', borderRadius:8, overflow:'hidden', fontFamily:"'JetBrains Mono', monospace", fontSize:13 }}>
            <div style={{ background:'#141414', padding:'8px 12px', display:'flex', alignItems:'center', gap:7, borderBottom:'1px solid #1a1a1a' }}>
              <span style={{ width:11, height:11, borderRadius:'50%', background:'#ff5f56', display:'block' }} />
              <span style={{ width:11, height:11, borderRadius:'50%', background:'#ffbd2e', display:'block' }} />
              <span style={{ width:11, height:11, borderRadius:'50%', background:'#27c93f', display:'block' }} />
              <span style={{ flex:1, textAlign:'center', fontSize:10, color:'#333' }}>akarshiev@linux:~</span>
            </div>
            <div style={{ padding:'12px 16px', minHeight:200, lineHeight:'21px' }}>
              {demo.map((r, i) => (
                <div key={i}>
                  {r.kind==='cmd' ? (
                    <div style={{ display:'flex', flexWrap:'wrap' }}>
                      <DPrompt path={r.path} />
                      <span style={{ color:'#c9d1d9' }}>{r.text}</span>
                    </div>
                  ) : (
                    <div style={{ color:'#8b949e', whiteSpace:'pre', fontSize:12 }}>{r.text}</div>
                  )}
                </div>
              ))}
              <div style={{ display:'flex', alignItems:'baseline', marginTop:2 }}>
                <DPrompt path="~" />
                <span style={{ color:'#3fb950' }}>█</span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ STATS ═══════════ */}
        <div style={{ borderTop:'1px solid var(--line)', padding:'28px 0', display:'flex', gap:56, marginBottom:56 }}>
          {[
            {v:MODULES.length,      l:L('Modul','Modules')},
            {v:getTotalLessons(),   l:L('Dars','Lessons')},
            {v:'100%',              l:L('Bepul','Free')},
            {v:'localStorage',      l:L('Saqlash','Storage')},
          ].map((s,i) => (
            <div key={i}>
              <div className="mono" style={{ fontSize:26, fontWeight:700, letterSpacing:'-0.04em' }}>{s.v}</div>
              <div style={{ fontSize:11, color:'var(--fg-2)', marginTop:3, textTransform:'uppercase', letterSpacing:'0.08em' }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* ═══════════ MODULES GRID ═══════════ */}
        <section style={{ paddingBottom:64 }}>
          <p className="mono" style={{ fontSize:11, color:'var(--fg-2)', letterSpacing:'0.1em', marginBottom:16 }}>
            // {L('Modullar','Modules')}
          </p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))', gap:1, border:'1px solid var(--line)', borderRadius:8, overflow:'hidden' }}>
            {MODULES.map((m,i) => (
              <div key={m.id}
                style={{ padding:'16px', background:'var(--bg-2)', borderRight:'1px solid var(--line)', borderBottom:'1px solid var(--line)', transition:'background 0.1s', cursor:'default' }}
                onMouseEnter={e=>{(e.currentTarget as HTMLDivElement).style.background='var(--bg-3)';}}
                onMouseLeave={e=>{(e.currentTarget as HTMLDivElement).style.background='var(--bg-2)';}}
              >
                <div className="mono" style={{ fontSize:11, color:'var(--fg-2)', marginBottom:5 }}>{String(i+1).padStart(2,'0')}</div>
                <div style={{ fontWeight:600, fontSize:13, marginBottom:3 }}>{m.title[lang]}</div>
                <div className="mono" style={{ fontSize:10, color:'var(--fg-2)' }}>{m.lessons.length} {L('dars','lessons')}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer style={{ borderTop:'1px solid var(--line)', padding:'20px 24px' }}>
        <div style={{ maxWidth:1080, margin:'0 auto', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <span className="mono" style={{ fontSize:11, color:'var(--fg-2)' }}>© 2026 TerminalMaster</span>
          <a href="https://github.com/akarshiev" target="_blank" rel="noreferrer" className="mono"
            style={{ fontSize:11, color:'var(--green)', textDecoration:'none' }}>@akarshiev</a>
        </div>
      </footer>
    </div>
  );
}

function NavA({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer"
      style={{ display:'flex', alignItems:'center', fontSize:12, color:'var(--fg-1)', textDecoration:'none', transition:'color 0.1s', whiteSpace:'nowrap' }}
      onMouseEnter={e=>{(e.currentTarget as HTMLAnchorElement).style.color='var(--fg-0)';}}
      onMouseLeave={e=>{(e.currentTarget as HTMLAnchorElement).style.color='var(--fg-1)';}}
    >{children}</a>
  );
}
