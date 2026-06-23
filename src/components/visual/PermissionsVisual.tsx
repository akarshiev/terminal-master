'use client';
import { useState, useEffect } from 'react';
import { PermissionState } from '@/types';

interface Props {
  initialPermissions?: string;
  onChange?: (octal: string) => void;
  lang?: 'uz' | 'en';
}

function parsePerms(s: string): PermissionState {
  const p = s.padStart(10, '-');
  return {
    owner:  { r: p[1]==='r', w: p[2]==='w', x: p[3]==='x' },
    group:  { r: p[4]==='r', w: p[5]==='w', x: p[6]==='x' },
    others: { r: p[7]==='r', w: p[8]==='w', x: p[9]==='x' },
  };
}
const oct = (p: PermissionState) => {
  const n = (r:boolean,w:boolean,x:boolean) => (r?4:0)+(w?2:0)+(x?1:0);
  return `${n(p.owner.r,p.owner.w,p.owner.x)}${n(p.group.r,p.group.w,p.group.x)}${n(p.others.r,p.others.w,p.others.x)}`;
};
const sym = (p: PermissionState) => {
  const s = (r:boolean,w:boolean,x:boolean) => `${r?'r':'-'}${w?'w':'-'}${x?'x':'-'}`;
  return `-${s(p.owner.r,p.owner.w,p.owner.x)}${s(p.group.r,p.group.w,p.group.x)}${s(p.others.r,p.others.w,p.others.x)}`;
};

export default function PermissionsVisual({ initialPermissions='-rwxr-xr--', onChange, lang='uz' }: Props) {
  const [perms, setPerms] = useState<PermissionState>(parsePerms(initialPermissions));
  useEffect(() => { onChange?.(oct(perms)); }, [perms]);

  const toggle = (g: 'owner'|'group'|'others', b: 'r'|'w'|'x') =>
    setPerms(p => ({ ...p, [g]: { ...p[g], [b]: !p[g][b] } }));

  const o = oct(perms), s = sym(perms);
  return (
    <div style={{ padding:14, borderRadius:7, border:'1px solid var(--line)', background:'var(--bg-3)' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
        <span style={{ fontSize:10, fontWeight:600, color:'var(--fg-2)', textTransform:'uppercase', letterSpacing:'0.1em' }}>Permissions</span>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <span className="mono" style={{ fontSize:10, color:'var(--fg-1)' }}>chmod</span>
          <span className="mono" style={{ fontSize:14, fontWeight:700, color:'var(--accent)', background:'var(--accent-dim)', padding:'2px 8px', borderRadius:4, border:'1px solid var(--accent-border)' }}>{o}</span>
        </div>
      </div>
      <div className="mono" style={{ fontSize:14, letterSpacing:'0.06em', marginBottom:14 }}>
        {s.split('').map((c,i) => {
          let color='var(--fg-2)';
          if(c==='r') color='var(--t-dir)';
          if(c==='w') color='var(--accent)';
          if(c==='x') color='var(--teal)';
          return <span key={i} style={{color}}>{c}</span>;
        })}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {(['owner','group','others'] as const).map(g => (
          <div key={g} style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span className="mono" style={{ fontSize:9, color:'var(--fg-2)', width:46, textTransform:'uppercase', letterSpacing:'0.06em' }}>{g}</span>
            {(['r','w','x'] as const).map(b => {
              const active = perms[g][b];
              return (
                <button key={b} onClick={() => toggle(g,b)}
                  className={`pb ${active ? b : ''}`}
                  title={b==='r'?'Read (4)':b==='w'?'Write (2)':'Execute (1)'}
                >{b}</button>
              );
            })}
            <span className="mono" style={{ fontSize:10, color:'var(--fg-2)', marginLeft:4 }}>
              = <span style={{color:'var(--teal)'}}>{(perms[g].r?4:0)+(perms[g].w?2:0)+(perms[g].x?1:0)}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="mono" style={{ marginTop:12, padding:'7px 10px', borderRadius:5, background:'var(--bg-0)', border:'1px solid var(--line)', fontSize:11 }}>
        <span style={{color:'var(--fg-2)'}}>$ </span>
        <span style={{color:'var(--teal)'}}>chmod </span>
        <span style={{color:'var(--accent)', fontWeight:700}}>{o}</span>
        <span style={{color:'var(--fg-1)'}}> file.sh</span>
      </div>
    </div>
  );
}
