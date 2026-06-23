'use client';

interface PipeStep { command: string; color: string; output: string; }

interface Props { steps?: PipeStep[]; lang?: 'uz' | 'en'; }

export default function PipeVisual({ steps, lang = 'uz' }: Props) {
  const def: PipeStep[] = steps || [
    { command: 'cat file.txt',  color: 'var(--blue)',  output: 'line1\nline2\nline3' },
    { command: 'grep "line2"',  color: 'var(--amber)', output: 'line2' },
    { command: 'wc -l',         color: 'var(--green)', output: '1' },
  ];

  return (
    <div style={{ padding: '12px', borderRadius: 7, border: '1px solid var(--line)', background: 'var(--bg-3)' }}>
      <div className="mono" style={{ fontSize: 9, color: 'var(--fg-2)', letterSpacing: '0.1em', marginBottom: 10, textTransform: 'uppercase' }}>
        // {lang === 'uz' ? 'Pipe oqimi' : 'Pipe flow'}
      </div>

      {/* Command chain */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
        {def.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="mono" style={{
              padding: '3px 8px', borderRadius: 4,
              border: `1px solid ${s.color}33`,
              background: `${s.color}09`,
              color: s.color, fontSize: 11,
            }}>{s.command}</span>
            {i < def.length - 1 && <span className="mono" style={{ color: 'var(--green)', fontWeight: 700 }}>|</span>}
          </div>
        ))}
      </div>

      {/* Outputs */}
      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {def.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 5 }}>
            <div>
              <div className="mono" style={{ fontSize: 8, color: s.color, marginBottom: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                out{i + 1}
              </div>
              <div className="mono" style={{
                padding: '5px 7px', borderRadius: 4,
                background: 'var(--bg-0)', border: '1px solid var(--line)',
                fontSize: 10, color: 'var(--fg-1)', whiteSpace: 'pre',
                minWidth: 52,
              }}>{s.output}</div>
            </div>
            {i < def.length - 1 && (
              <div style={{ color: 'var(--green)', fontSize: 14, marginTop: 14, fontWeight: 700 }}>→</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
