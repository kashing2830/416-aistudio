'use client'
import { DARK, ACCENT, STAGE_LABELS, STAGE_COLORS, fmt } from '@/components/portal/theme'
import { Icon, Badge, Label, Card, Btn, StageBar, PageShell } from '@/components/portal/ui'
import { ClientPortalShell } from '@/components/portal/PortalShell'
import type { Project, Quote, Notification } from '@/lib/supabase/types'

const c = DARK

const NEXT_ACTIONS = [
  { title: '填寫需求表格', desc: '請填寫項目需求，讓 Admin 準備 Scope Document（1–2 個工作天）', btn: '開始填寫', btnHref: '/portal/requirements', icon: 'file' },
  { title: '審閱 Scope Document', desc: 'Scope Document 已上傳，請查閱內容並確認或提出修改意見', btn: '查看 Scope', btnHref: '/portal/scope', icon: 'checkCircle' },
  { title: '確認報價及付款', desc: '正式報價已生成，請審閱功能列表及付款分期安排', btn: '查看報價', btnHref: '/portal/quote', icon: 'dollar' },
  { title: '審閱設計初稿', desc: '設計初稿已上傳，請查閱並提交意見（剩餘 2 次免費修改）', btn: '查看設計', btnHref: '/portal/design', icon: 'image' },
  { title: '追蹤開發進度', desc: 'Admin 正在開發你的系統，你可以隨時查看 Milestone 進度更新', btn: '查看進度', btnHref: '/portal/progress', icon: 'code' },
  { title: '進行 UAT 測試', desc: '試用連結已就緒，請開始測試並提交 Bug List（2 週免費修復期）', btn: '前往測試', btnHref: '/portal/uat', icon: 'bug' },
  { title: '確認驗收及繳付尾款', desc: '所有 Bug 已標記修復，請最終確認後完成付款以取得交付物', btn: '確認驗收', btnHref: '/portal/delivery', icon: 'package' },
]

export default function ClientDashboard({ project, quote, paidTotal, notifications, userEmail }: {
  project: Project | null
  quote: Quote | null
  paidTotal: number
  notifications: Notification[]
  userEmail: string
}) {
  const stage = project?.stage ?? 0
  const na = NEXT_ACTIONS[Math.min(stage, NEXT_ACTIONS.length - 1)]
  const total = quote ? quote.total_amount + (quote.lock_fee ?? 0) : 0

  return (
    <ClientPortalShell project={project} userEmail={userEmail}>
      <PageShell maxWidth={900}>
        {!project ? (
          /* No project yet */
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👋</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: c.t0, marginBottom: 8 }}>歡迎來到 416 AI Studio</h2>
            <p style={{ fontSize: 14, color: c.t1, marginBottom: 28, lineHeight: 1.6 }}>
              你尚未有進行中的項目。<br />立即填寫需求表格開始你的第一個項目！
            </p>
            <Btn variant="primary" size="lg" icon="arrowRight" href="/portal/requirements">開始新項目</Btn>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <Label>項目</Label>
                <h1 style={{ fontSize: 22, fontWeight: 700, color: c.t0, margin: '4px 0 0', letterSpacing: '-0.01em' }}>{project.name}</h1>
              </div>
              <Badge color={STAGE_COLORS[stage]} bg={STAGE_COLORS[stage] + '18'} size="md">{STAGE_LABELS[stage]}</Badge>
            </div>

            {/* Stage bar */}
            <Card style={{ marginBottom: 28, padding: '20px 28px' }}>
              <StageBar current={stage} />
            </Card>

            {/* Next Action */}
            <div style={{
              background: ACCENT + '12', border: `1.5px solid ${ACCENT}40`,
              borderRadius: 14, padding: '24px 28px', marginBottom: 24,
              display: 'flex', alignItems: 'flex-start', gap: 20,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: ACCENT + '25',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                <Icon name={na.icon} size={20} color={ACCENT} />
              </div>
              <div style={{ flex: 1 }}>
                <Label style={{ color: ACCENT + 'AA' }}>Next Action</Label>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: c.t0, margin: '4px 0 8px', letterSpacing: '-0.01em' }}>{na.title}</h2>
                <p style={{ fontSize: 13, color: c.t1, lineHeight: 1.6, margin: '0 0 16px' }}>{na.desc}</p>
                <Btn variant="primary" href={na.btnHref} icon="arrowRight">{na.btn}</Btn>
              </div>
            </div>

            {/* Info row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <Card>
                <Label style={{ marginBottom: 12, display: 'block' }}>項目資料</Label>
                <div style={{ fontSize: 14, fontWeight: 600, color: c.t0, marginBottom: 6 }}>{project.type}</div>
                <div style={{ fontSize: 12, color: c.t1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span>建立 {new Date(project.created_at).toLocaleDateString('zh-HK')}</span>
                  {project.estimated_completion && <span>預計完成 {project.estimated_completion}</span>}
                </div>
              </Card>

              <Card>
                <Label style={{ marginBottom: 12, display: 'block' }}>付款狀態</Label>
                {total > 0 ? (
                  <>
                    <div style={{ fontSize: 20, fontWeight: 700, color: c.t0, marginBottom: 4 }}>{fmt(paidTotal)}</div>
                    <div style={{ fontSize: 11, color: c.t1, marginBottom: 12 }}>已付 / {fmt(total)} 總金額</div>
                    <div style={{ height: 4, background: c.border, borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((paidTotal / total) * 100)}%`, height: '100%', background: ACCENT, borderRadius: 2, transition: 'width 0.4s' }} />
                    </div>
                  </>
                ) : (
                  <div style={{ fontSize: 13, color: c.t2 }}>報價待生成</div>
                )}
              </Card>

              <Card>
                <Label style={{ marginBottom: 12, display: 'block' }}>近期通知</Label>
                {notifications.length === 0 ? (
                  <div style={{ fontSize: 12, color: c.t2 }}>暫無通知</div>
                ) : notifications.map((n, i) => (
                  <div key={n.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < notifications.length - 1 ? 10 : 0 }}>
                    <Icon name="checkCircle" size={13} color={c.success} style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, color: c.t0, lineHeight: 1.4 }}>{n.message}</div>
                      <div style={{ fontSize: 10, color: c.t2, marginTop: 2 }}>{new Date(n.created_at).toLocaleDateString('zh-HK')}</div>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          </>
        )}
      </PageShell>
    </ClientPortalShell>
  )
}
