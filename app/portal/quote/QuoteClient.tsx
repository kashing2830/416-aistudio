'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { loadStripe } from '@stripe/stripe-js'
import { DARK, ACCENT, fmt } from '@/components/portal/theme'
import { Icon, Badge, Card, Btn, Label, PageShell } from '@/components/portal/ui'
import { ClientPortalShell } from '@/components/portal/PortalShell'
import type { Project, Quote } from '@/lib/supabase/types'

const c = DARK

export default function QuoteClient({ project, quote, userEmail }: {
  project: Project; quote: Quote | null; userEmail: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [payMethod, setPayMethod] = useState<'stripe' | 'fps' | null>(null)
  const [showFPS, setShowFPS] = useState(false)

  const handleAccept = async () => {
    if (!quote) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('quotes').update({ accepted_at: new Date().toISOString() }).eq('id', quote.id)
    await supabase.from('projects').update({ stage: 1 }).eq('id', project.id)
    setLoading(false)
    router.refresh()
  }

  const handleStripePayment = async (amount: number, type: string) => {
    setLoading(true)
    const res = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id, amount, type }),
    })
    const { clientSecret } = await res.json()
    if (!clientSecret) { setLoading(false); return }
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
    if (stripeJs) {
      const { error } = await stripeJs.confirmPayment({
        clientSecret,
        confirmParams: { return_url: `${window.location.origin}/portal/quote?payment=success` },
      })
      if (error) console.error(error.message)
    }
    setLoading(false)
  }

  if (!quote) {
    return (
      <ClientPortalShell project={project} userEmail={userEmail}>
        <PageShell title="報價單" maxWidth={700}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Icon name="clock" size={40} color={c.t2} style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: c.t0, marginBottom: 8 }}>等待報價單</h2>
            <p style={{ fontSize: 13, color: c.t1, lineHeight: 1.6 }}>
              Admin 正在生成你的正式報價單，請稍候。<br />生成後系統會發送電郵通知你。
            </p>
          </div>
        </PageShell>
      </ClientPortalShell>
    )
  }

  const design = Math.round(quote.total_amount * 0.3)
  const dev = Math.round(quote.total_amount * 0.3)
  const final = quote.total_amount - design - dev

  const payments = [
    { stage: 0, item: 'Requirement Lock Fee', amount: quote.lock_fee ?? 800, note: '已繳付', status: 'paid' as const },
    { stage: 1, item: 'Design Deposit (30%)', amount: design, note: '設計確認後', status: quote.accepted_at ? 'pending' : 'upcoming' as const },
    { stage: 2, item: 'Dev Deposit (30%)', amount: dev, note: '開發開始前', status: 'upcoming' as const },
    { stage: 4, item: 'Final Payment (40%)', amount: final, note: '驗收確認後', status: 'upcoming' as const },
  ]

  return (
    <ClientPortalShell project={project} userEmail={userEmail}>
      <PageShell title="正式報價單" subtitle={`${project.name} · 報價日期：${new Date(quote.created_at).toLocaleDateString('zh-HK')}`} maxWidth={760}
        actions={<Btn variant="ghost" size="sm" icon="download">Download PDF</Btn>}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Feature list */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: c.t0 }}>功能列表</div>
              <Badge color={ACCENT} bg={ACCENT + '18'}>{project.type}</Badge>
            </div>
            {quote.estimated_weeks && (
              <div style={{ marginBottom: 16, padding: '10px 14px', background: c.bg3, borderRadius: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: c.t1 }}>預計完成時間</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: c.t0 }}>{quote.estimated_weeks}</span>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              {(quote.features as string[]).map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: `1px solid ${c.border}` }}>
                  <Icon name="check" size={13} color={c.success} />
                  <span style={{ fontSize: 12, color: c.t0 }}>{f}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Payment breakdown */}
          <Card>
            <div style={{ fontSize: 14, fontWeight: 600, color: c.t0, marginBottom: 20 }}>付款分期</div>
            {payments.map((row, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: i < payments.length - 1 ? `1px solid ${c.border}` : 'none' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: row.status === 'paid' ? c.success + '22' : c.bg3,
                  border: `1.5px solid ${row.status === 'paid' ? c.success : c.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {row.status === 'paid' ? <Icon name="check" size={11} color={c.success} /> : <span style={{ fontSize: 10, color: c.t2, fontWeight: 600 }}>{i + 1}</span>}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: c.t0 }}>{row.item}</div>
                  <div style={{ fontSize: 11, color: c.t2, marginTop: 2 }}>{row.note}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: row.status === 'paid' ? c.success : c.t0 }}>{fmt(row.amount)}</div>
                  {row.status === 'paid' && <div style={{ fontSize: 10, color: c.success, marginTop: 1 }}>✓ 已收</div>}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: `2px solid ${c.border}` }}>
              <span style={{ fontSize: 13, color: c.t1 }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 700, color: c.t0 }}>{fmt(quote.total_amount + (quote.lock_fee ?? 0))}</span>
            </div>
          </Card>

          {/* Accept / Pay */}
          {!quote.accepted_at ? (
            <div style={{ display: 'flex', gap: 12 }}>
              <Btn variant="primary" full size="lg" icon="checkCircle" onClick={handleAccept} disabled={loading}>
                {loading ? '處理中...' : '接受報價 → 繳付 Design Deposit'}
              </Btn>
            </div>
          ) : (
            <Card style={{ background: ACCENT + '10', border: `1px solid ${ACCENT}30` }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 12 }}>繳付 Design Deposit</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: c.t0, marginBottom: 16 }}>{fmt(design)}</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Btn variant="primary" icon="creditCard" onClick={() => handleStripePayment(design, 'design_deposit')} disabled={loading}>
                  Stripe 信用卡
                </Btn>
                <Btn variant="secondary" icon="send" onClick={() => setShowFPS(true)}>FPS 轉帳</Btn>
              </div>
              {showFPS && (
                <div style={{ marginTop: 16, padding: '14px 16px', background: c.bg3, borderRadius: 8 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 8 }}>FPS 付款詳情</div>
                  <div style={{ fontSize: 12, color: c.t1, lineHeight: 1.8 }}>
                    FPS 號碼：<strong style={{ color: c.t0 }}>12345678</strong><br />
                    收款人：<strong style={{ color: c.t0 }}>416 AI Studio</strong><br />
                    金額：<strong style={{ color: c.t0 }}>{fmt(design)}</strong><br />
                    備注：<strong style={{ color: c.t0 }}>{project.id.slice(0, 8)}</strong>
                  </div>
                  <div style={{ fontSize: 11, color: c.t2, marginTop: 8 }}>付款後 Admin 將手動確認，請稍候。</div>
                </div>
              )}
            </Card>
          )}

          <p style={{ fontSize: 11, color: c.t2, textAlign: 'center', lineHeight: 1.6 }}>
            接受報價即代表你同意服務條款及退款政策。Lock Fee {fmt(quote.lock_fee ?? 800)} 不予退還。
          </p>
        </div>
      </PageShell>
    </ClientPortalShell>
  )
}
