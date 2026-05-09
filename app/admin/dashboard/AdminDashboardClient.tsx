'use client'
import { useRouter } from 'next/navigation'
import { DARK, ACCENT, STAGE_LABELS, STAGE_COLORS } from '@/components/portal/theme'
import { Icon, Badge, Card, Btn, PageShell } from '@/components/portal/ui'
import { AdminPortalShell } from '@/components/portal/PortalShell'
import type { Project, Payment, Bug, Notification } from '@/lib/supabase/types'

const c = DARK

type ProjectWithClient = Project & { profiles?: { email: string; full_name: string | null } | null }

export default function AdminDashboardClient({ projects, pendingPayments, openBugs, notifications, userEmail }: {
  projects: ProjectWithClient[]
  pendingPayments: Payment[]
  openBugs: Bug[]
  notifications: Notification[]
  userEmail: string
}) {
  const router = useRouter()

  const stats = [
    { label: '活躍項目', value: projects.filter(p => p.stage < 5).length, icon: 'layers', color: ACCENT },
    { label: '待確認付款', value: pendingPayments.length, icon: 'creditCard', color: '#f59e0b' },
    { label: '未解決 Bug', value: openBugs.length, icon: 'alertTriangle', color: '#ef4444' },
    { label: '未讀通知', value: notifications.length, icon: 'bell', color: c.success },
  ]

  return (
    <AdminPortalShell userEmail={userEmail}>
      <PageShell title="管理後台" subtitle="項目總覽、付款確認、Bug 追蹤" maxWidth={1100}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {stats.map(s => (
            <Card key={s.label} style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={s.icon} size={20} color={s.color} />
              </div>
              <div>
                <div style={{ fontSize: 26, fontWeight: 800, color: c.t0, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 11, color: c.t2, marginTop: 4 }}>{s.label}</div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
          {/* Project list */}
          <Card style={{ padding: 0 }}>
            <div style={{ padding: '14px 20px', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: c.t0 }}>所有項目</span>
              <span style={{ fontSize: 11, color: c.t2 }}>{projects.length} 個</span>
              <div style={{ marginLeft: 'auto' }}>
                <Btn variant="primary" size="sm" icon="plus" href="/admin/projects/new">新建項目</Btn>
              </div>
            </div>
            {projects.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', fontSize: 13, color: c.t2 }}>暫無項目</div>
            ) : projects.map((p, i) => (
              <div
                key={p.id}
                onClick={() => router.push(`/admin/projects/${p.id}`)}
                style={{
                  padding: '14px 20px', borderBottom: i < projects.length - 1 ? `1px solid ${c.border}` : 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = c.bg2)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: c.t2 }}>{p.profiles?.email ?? '未知客戶'}</div>
                </div>
                <Badge color={STAGE_COLORS[p.stage] ?? c.t2} bg={(STAGE_COLORS[p.stage] ?? c.t2) + '18'}>
                  {STAGE_LABELS[p.stage] ?? `Stage ${p.stage}`}
                </Badge>
                {p.total_amount && (
                  <span style={{ fontSize: 12, color: c.t1, minWidth: 80, textAlign: 'right' }}>
                    HK${p.total_amount.toLocaleString()}
                  </span>
                )}
                <Icon name="chevRight" size={14} color={c.t2} />
              </div>
            ))}
          </Card>

          {/* Notifications panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ padding: 0 }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${c.border}` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: c.t0 }}>最新通知</span>
              </div>
              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: 12, color: c.t2 }}>無未讀通知</div>
              ) : notifications.slice(0, 8).map((n, i) => (
                <div key={n.id} style={{ padding: '12px 16px', borderBottom: i < Math.min(notifications.length, 8) - 1 ? `1px solid ${c.border}` : 'none' }}>
                  <div style={{ fontSize: 12, color: c.t0, marginBottom: 3, lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: 10, color: c.t2 }}>{new Date(n.created_at).toLocaleDateString('zh-HK')}</div>
                </div>
              ))}
            </Card>

            {pendingPayments.length > 0 && (
              <Card style={{ padding: '16px 20px', border: `1px solid #f59e0b40`, background: '#f59e0b08' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 10 }}>
                  ⚠ {pendingPayments.length} 筆待確認付款
                </div>
                <Btn variant="accent" size="sm" href="/admin/payments" style={{ width: '100%' }}>前往確認付款</Btn>
              </Card>
            )}
          </div>
        </div>
      </PageShell>
    </AdminPortalShell>
  )
}
