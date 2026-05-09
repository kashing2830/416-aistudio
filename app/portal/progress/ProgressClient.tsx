'use client'
import { DARK, ACCENT } from '@/components/portal/theme'
import { Icon, Badge, Card, PageShell } from '@/components/portal/ui'
import { ClientPortalShell } from '@/components/portal/PortalShell'
import type { Project, Milestone } from '@/lib/supabase/types'

const c = DARK

export default function ProgressClient({ project, milestones, userEmail }: {
  project: Project; milestones: Milestone[]; userEmail: string
}) {
  const done = milestones.filter(m => m.status === 'done').length
  const pct = milestones.length > 0 ? Math.round((done / milestones.length) * 100) : 0

  return (
    <ClientPortalShell project={project} userEmail={userEmail}>
      <PageShell title="開發進度" subtitle="Admin 正在開發你的系統，所有 Milestone 完成後系統將通知你進行 UAT" maxWidth={720}>
        {milestones.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Icon name="clock" size={40} color={c.t2} style={{ marginBottom: 16 }} />
            <p style={{ fontSize: 13, color: c.t1 }}>開發尚未開始，等待 Admin 設置 Milestone。</p>
          </div>
        ) : (
          <>
            {/* Progress summary */}
            <Card style={{ marginBottom: 24, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 13, color: c.t1 }}>整體進度</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: c.t0 }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: c.border, borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${ACCENT}, ${ACCENT}BB)`, borderRadius: 3, transition: 'width 0.5s' }} />
              </div>
              <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
                {[
                  { label: '完成', count: done, color: c.success },
                  { label: '進行中', count: milestones.filter(m => m.status === 'active').length, color: ACCENT },
                  { label: '待開始', count: milestones.filter(m => m.status === 'pending').length, color: c.t2 },
                ].map(s => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.color }} />
                    <span style={{ fontSize: 11, color: c.t1 }}>{s.label} <strong style={{ color: c.t0 }}>{s.count}</strong></span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Timeline */}
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: 15, top: 16, bottom: 16, width: 2, background: c.border, zIndex: 0 }} />
              {milestones.map((m, i) => {
                const isDone = m.status === 'done', isActive = m.status === 'active'
                const dotColor = isDone ? c.success : isActive ? ACCENT : c.t2
                return (
                  <div key={m.id} style={{ display: 'flex', gap: 20, marginBottom: 20, position: 'relative', zIndex: 1 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: isDone ? c.success + '22' : isActive ? ACCENT + '22' : c.bg3,
                      border: `2px solid ${dotColor}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0, transition: 'all 0.2s',
                    }}>
                      {isDone ? <Icon name="check" size={13} color={c.success} /> :
                        isActive ? <div className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT }} /> :
                          <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.t2 + '60' }} />}
                    </div>
                    <div style={{ flex: 1, paddingTop: 4 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: isDone || isActive ? c.t0 : c.t1 }}>{m.title}</span>
                        {isActive && <Badge color={ACCENT} bg={ACCENT + '18'}>進行中</Badge>}
                        {isDone && m.completed_at && <span style={{ fontSize: 11, color: c.t2, marginLeft: 'auto' }}>{new Date(m.completed_at).toLocaleDateString('zh-HK')}</span>}
                      </div>
                      {m.note && <p style={{ fontSize: 12, color: c.t2, margin: 0, lineHeight: 1.5 }}>{m.note}</p>}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </PageShell>
    </ClientPortalShell>
  )
}
