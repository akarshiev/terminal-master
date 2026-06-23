'use client';
import { Module, Lesson } from '@/types';
import { Check, ChevronLeft, ChevronRight, Terminal, Lightbulb, BookOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Props {
  module: Module;
  lesson: Lesson;
  currentStepIdx: number;
  completedSteps: string[];
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  lang: 'uz' | 'en';
}

/* Render theory text with markdown-ish formatting:
   `code` spans, ```blocks```, and line breaks */
function RichText({ text }: { text: string }) {
  const blocks = text.split(/```/);
  return (
    <>
      {blocks.map((block, bi) => {
        // Odd indices are code blocks
        if (bi % 2 === 1) {
          return (
            <pre key={bi} className="mono" style={{
              background: 'var(--bg-0)', border: '1px solid var(--line)',
              borderRadius: 6, padding: '10px 12px', margin: '8px 0',
              fontSize: 11.5, color: '#adbac7', overflowX: 'auto',
              whiteSpace: 'pre', lineHeight: 1.6,
            }}>{block.trim()}</pre>
          );
        }
        // Normal text: split by lines, render inline `code`
        return (
          <span key={bi}>
            {block.split('\n').map((line, li) => (
              <span key={li}>
                {li > 0 && <br />}
                <InlineCode text={line} />
              </span>
            ))}
          </span>
        );
      })}
    </>
  );
}

function InlineCode({ text }: { text: string }) {
  const parts = text.split('`');
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 0
          ? <span key={i}>{p}</span>
          : <code key={i} className="mono" style={{
              background: 'var(--bg-3)', border: '1px solid var(--line)',
              padding: '1px 5px', borderRadius: 4, fontSize: 11,
              color: 'var(--green)', whiteSpace: 'nowrap',
            }}>{p}</code>
      )}
    </>
  );
}

export default function LessonPanel({
  module, lesson, currentStepIdx, completedSteps,
  onPrev, onNext, hasPrev, hasNext, lang,
}: Props) {
  const [showHint, setShowHint] = useState(false);
  const [tab, setTab] = useState<'guide' | 'task'>('guide');
  const step = lesson.steps[currentStepIdx];
  const allDone = lesson.steps.every(s => completedSteps.includes(s.id));
  const stepDone = step && completedSteps.includes(step.id);
  const L = (u: string, e: string) => lang === 'uz' ? u : e;

  /* When a step is completed, jump to task tab to show success */
  useEffect(() => { setShowHint(false); }, [step?.id]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: 'var(--bg-2)' }}>

      {/* Header */}
      <div style={{ padding: '14px 16px 0', flexShrink: 0 }}>
        <div style={{ fontSize: 10, color: 'var(--fg-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
          {module.title[lang]}
        </div>
        <h3 style={{ fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--fg-0)', marginBottom: 10, lineHeight: 1.3 }}>
          {lesson.title[lang]}
        </h3>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: -1 }}>
          {([['guide', L('Qo\'llanma', 'Guide'), BookOpen], ['task', L('Vazifa', 'Task'), Terminal]] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '7px 12px', fontSize: 12, cursor: 'pointer',
              background: 'transparent', border: 'none',
              borderBottom: tab === id ? '2px solid var(--green)' : '2px solid transparent',
              color: tab === id ? 'var(--fg-0)' : 'var(--fg-2)',
              fontWeight: tab === id ? 600 : 400,
            }}>
              <Icon size={12} /> {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--line)', flexShrink: 0 }} />

      {/* Body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        {tab === 'guide' ? (
          <div key={`guide-${lesson.id}`} className="fade-up">
            {/* Short description */}
            <p style={{ fontSize: 12.5, color: 'var(--fg-1)', lineHeight: 1.6, marginBottom: 16 }}>
              <InlineCode text={lesson.description[lang]} />
            </p>

            {/* Theory */}
            {lesson.theory && (
              <div style={{ fontSize: 12.5, color: 'var(--fg-0)', lineHeight: 1.75, marginBottom: 18 }}>
                <RichText text={lesson.theory[lang]} />
              </div>
            )}

            {/* Examples */}
            {lesson.examples && lesson.examples.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div className="mono" style={{ fontSize: 10, color: 'var(--fg-2)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {L('// Misollar', '// Examples')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {lesson.examples.map((ex, i) => (
                    <div key={i} style={{
                      padding: '8px 10px', borderRadius: 6,
                      background: 'var(--bg-0)', border: '1px solid var(--line)',
                    }}>
                      <code className="mono" style={{ fontSize: 11.5, color: 'var(--green)', display: 'block', marginBottom: 3 }}>
                        $ {ex.cmd}
                      </code>
                      <span style={{ fontSize: 11, color: 'var(--fg-2)' }}>{ex.desc[lang]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA to task */}
            <button onClick={() => setTab('task')} style={{
              marginTop: 20, width: '100%', padding: '9px',
              borderRadius: 7, border: '1px solid var(--green-border)',
              background: 'var(--green-dim)', color: 'var(--green)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Terminal size={13} /> {L('Vazifaga o\'tish', 'Go to task')}
            </button>
          </div>
        ) : (
          <div key={`task-${lesson.id}-${step?.id}`} className="fade-up">
            {/* Step progress */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
              {lesson.steps.map((s, i) => (
                <div key={s.id} style={{
                  flex: 1, height: 3, borderRadius: 2,
                  background: completedSteps.includes(s.id) ? 'var(--green)'
                    : i === currentStepIdx ? 'var(--fg-2)' : 'var(--line)',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
            <div className="mono" style={{ fontSize: 10, color: 'var(--fg-2)', marginBottom: 16 }}>
              {L(`${currentStepIdx + 1}/${lesson.steps.length}-qadam`, `Step ${currentStepIdx + 1}/${lesson.steps.length}`)}
            </div>

            {step && (
              <>
                {/* Status label */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 18, height: 18, borderRadius: '50%',
                    background: stepDone ? 'var(--green)' : 'var(--bg-4)',
                  }}>
                    {stepDone
                      ? <Check size={11} color="#0d0d0d" strokeWidth={3} />
                      : <Terminal size={10} color="var(--fg-2)" />}
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: stepDone ? 'var(--green)' : 'var(--fg-2)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {stepDone ? L('Bajarildi', 'Completed') : L('Vazifa', 'Your task')}
                  </span>
                </div>

                {/* Instruction */}
                <p style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--fg-0)', marginBottom: 14 }}>
                  <InlineCode text={step.instruction[lang]} />
                </p>

                {/* The command to type, prominent */}
                {step.expectedCommands[0] && !stepDone && (
                  <div style={{
                    padding: '10px 12px', borderRadius: 7,
                    background: 'var(--bg-0)', border: '1px solid var(--line)',
                    marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                  }}>
                    <code className="mono" style={{ fontSize: 12.5, color: '#adbac7' }}>
                      <span style={{ color: 'var(--fg-2)' }}>$ </span>
                      {step.expectedCommands[0].replace(/__USER__/g, '')}
                    </code>
                  </div>
                )}

                {/* Success message */}
                {stepDone && (
                  <div style={{
                    padding: '11px 12px', borderRadius: 7,
                    background: 'var(--green-dim)', border: '1px solid var(--green-border)',
                    display: 'flex', gap: 8, marginBottom: 14,
                  }}>
                    <Check size={14} color="var(--green)" strokeWidth={2.5} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 12, color: 'var(--green)', lineHeight: 1.5 }}>
                      {step.successMessage[lang]}
                    </span>
                  </div>
                )}

                {/* Hint */}
                {step.hint && !stepDone && (
                  <div>
                    <button onClick={() => setShowHint(!showHint)} style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '6px 10px', borderRadius: 6,
                      border: '1px solid var(--line)', background: 'transparent',
                      color: 'var(--fg-2)', fontSize: 11, cursor: 'pointer',
                    }}>
                      <Lightbulb size={11} /> {showHint ? L('Yashirish', 'Hide') : L('Maslahat', 'Hint')}
                    </button>
                    {showHint && (
                      <div className="mono" style={{
                        marginTop: 8, padding: '9px 11px', borderRadius: 6,
                        background: 'rgba(227,179,65,0.06)', border: '1px solid rgba(227,179,65,0.18)',
                        fontSize: 11.5, color: 'var(--amber)', lineHeight: 1.5,
                      }}>
                        {step.hint[lang]}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Lesson complete */}
            {allDone && (
              <div style={{
                marginTop: 16, padding: '14px', borderRadius: 8,
                background: 'var(--green-dim)', border: '1px solid var(--green-border)',
                textAlign: 'center',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', background: 'var(--green)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px',
                }}>
                  <Check size={18} color="#0d0d0d" strokeWidth={2.5} />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)', marginBottom: 2 }}>
                  {L('Dars tugallandi!', 'Lesson complete!')}
                </div>
                <div className="mono" style={{ fontSize: 11, color: 'var(--fg-2)' }}>
                  +50 <span style={{ color: 'var(--yellow)' }}>⚡</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ flexShrink: 0, padding: '10px 14px', borderTop: '1px solid var(--line)', display: 'flex', gap: 6 }}>
        <button onClick={onPrev} disabled={!hasPrev} style={{
          flex: 1, padding: '8px 0', borderRadius: 6,
          border: '1px solid var(--line)', background: 'transparent',
          color: hasPrev ? 'var(--fg-0)' : 'var(--fg-2)',
          cursor: hasPrev ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 12,
          opacity: hasPrev ? 1 : 0.5,
        }}>
          <ChevronLeft size={13} /> {L('Oldingi', 'Prev')}
        </button>
        <button onClick={onNext} disabled={!hasNext} style={{
          flex: 1, padding: '8px 0', borderRadius: 6,
          border: `1px solid ${hasNext ? 'var(--green)' : 'var(--line)'}`,
          background: hasNext ? 'var(--green-dim)' : 'transparent',
          color: hasNext ? 'var(--green)' : 'var(--fg-2)',
          cursor: hasNext ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 12, fontWeight: 600,
          opacity: hasNext ? 1 : 0.5,
        }}>
          {L('Keyingi', 'Next')} <ChevronRight size={13} />
        </button>
      </div>
    </div>
  );
}
