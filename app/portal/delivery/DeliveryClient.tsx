'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { createClient } from '@/lib/supabase/client'
import { DARK, ACCENT, STATUS_COLORS } from '@/components/portal/theme'
import { Icon, Badge, Card, Btn, PageShell } from '@/components/portal/ui'
import { ClientPortalShell } from '@/components/portal/PortalShell'
import type { Project, Delivery } from '@/lib/supabase/types'

const c = DARK

type Step = 'review' | 'pay' | 'download'

export default function DeliveryClient({ project, delivery, confirmedTotal, bugCount, openBugCount, userEmail }: {
  project: Project; delivery: Delivery | null
  confirmedTotal: number; bugCount: number; openBugCount: number; userEmail: string
}) {
  const router = useRouter()
  const [step, setStep] = useState<Step>('review')
  const [payMethod, setPayMethod] = useState<'stripe' | 'fps'>('stripe')
  const [loading, setLoading] = useState(false)
  const [accepted, setAccepted] = useState(!!delivery?.client_accepted_at)

  const totalAmount = project.total_amount ?? 0
  const finalAmount = Math.round(totalAmount * 0.4)
  const alreadyPaid = confirmedTotal >= totalAmount
  const files = (delivery?.file_urls ?? []) as string[]

  const handleAccept = async () => {
    setLoading(true)
    const supabase = createClient()
    if (delivery) {
      await supabase.from('deliveries').update({ client_accepted_at: new Date().toISOString() }).eq('id', delivery.id)
    }
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'delivery_accepted', projectId: project.id }),
    })
    setAccepted(true)
    setLoading(false)
    if (alreadyPaid) setStep('download')
    else setStep('pay')
  }

  const handleStripePay = async () => {
    setLoading(true)
    const res = await fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId: project.id, amount: finalAmount, type: 'final' }),
    })
    const { clientSecret, error } = await res.json()
    if (error || !clientSecret) { setLoading(false); return }
    const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!)
    if (stripeJs) {
      const { error: stripeError } = await stripeJs.confirmPayment({
        clientSecret,
        confirmParams: { return_url: `${window.location.origin}/portal/delivery?payment=success` },
      })
      if (stripeError) console.error(stripeError.message)
    }
    setLoading(false)
  }

  const handleFpsDone = async () => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('payments').insert({
      project_id: project.id,
      amount: finalAmount,
      type: 'final',
      method: 'fps',
      status: 'pending',
    })
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'payment_submitted', projectId: project.id, amount: finalAmount, paymentType: 'final' }),
    })
    setLoading(false)
    router.refresh()
  }

  if (!delivery) {
    return (
      <ClientPortalShell project={project} userEmail={userEmail}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Icon name="clock" size={40} color={c.t2} style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: c.t0, marginBottom: 8 }}>等待交付準備</h2>
            <p style={{ fontSize: 13, color: c.t1 }}>Admin 正在準備最終交付，完成後將發送通知。</p>
          </div>
        </div>
      </ClientPortalShell>
    )
  }

  const steps: { id: Step; label: string; icon: string }[] = [
    { id: 'review', label: '審閱驗收', icon: 'checkCircle' },
    { id: 'pay', label: '尾款支付', icon: 'creditCard' },
    { id: 'download', label: '下載交付物', icon: 'download' },
  ]

  return (
    <ClientPortalShell project={project} userEmail={userEmail}>
      <PageShell title="項目交付" subtitle="完成最終驗收、支付尾款並下載所有交付物。" maxWidth={780}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 0 }}>
          {steps.map((s, i) => {
            const isActive = step === s.id
            const isDone = steps.findIndex(x => x.id === step) > i || (s.id === 'pay' && alreadyPaid) || (s.id === 'review' && accepted)
            const color = isDone ? c.success : isActive ? ACCENT : c.t2
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: isDone ? c.success + '22' : isActive ? ACCENT + '22' : c.bg3,
                    border: `2px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isDone ? <Icon name="check" size={14} color={c.success} /> : <Icon name={s.icon} size={14} color={color} />}
                  </div>
                  <span style={{ fontSize: 11, color, fontWeight: isActive ? 600 : 400, whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ flex: 1, height: 2, background: isDone ? c.success + '60' : c.border, margin: '0 8px', marginBottom: 22 }} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step content */}
        {step === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* UAT summary */}
            <Card style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 16 }}>UAT 測試總結</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {[
                  { label: '提交 Bug', value: bugCount, color: c.t0 },
                  { label: '已修復', value: bugCount - openBugCount, color: c.success },
                  { label: '未解決', value: openBugCount, color: openBugCount > 0 ? c.warning : c.t2 },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center', padding: '12px', background: c.bg2, borderRadius: 8, border: `1px solid ${c.border}` }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: stat.color }}>{stat.value}</div>
                    <div style={{ fontSize: 11, color: c.t2, marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
              {openBugCount > 0 && (
                <div style={{ marginTop: 12, padding: '10px 14px', background: c.warning + '12', border: `1px solid ${c.warning + '40'}`, borderRadius: 8, fontSize: 12, color: c.warning }}>
                  ⚠ 仍有 {openBugCount} 個未解決 Bug，確認驗收後將不再屬於免費修復範圍。
                </div>
              )}
            </Card>

            {/* Delivery notes */}
            {delivery.notes && (
              <Card style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 10 }}>交付說明</div>
                <p style={{ fontSize: 13, color: c.t1, lineHeight: 1.7, margin: 0 }}>{delivery.notes}</p>
              </Card>
            )}

            <Card style={{ padding: '20px 24px', border: `1px solid ${ACCENT + '40'}`, background: ACCENT + '08' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 8 }}>確認驗收聲明</div>
              <p style={{ fontSize: 12, color: c.t1, lineHeight: 1.7, marginBottom: 16 }}>
                本人確認已完整測試所有功能，並對交付的系統感到滿意。確認後將進入尾款支付流程，項目進入正式完結狀態。
              </p>
              {accepted
                ? <Badge color={c.success} bg={c.success + '18'}>✓ 已確認驗收</Badge>
                : <Btn variant="success" icon="checkCircle" onClick={handleAccept} disabled={loading}>確認驗收</Btn>}
            </Card>
          </div>
        )}

        {step === 'pay' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 16 }}>尾款明細</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${c.border}` }}>
                <span style={{ fontSize: 13, color: c.t1 }}>項目總額</span>
                <span style={{ fontSize: 13, color: c.t0 }}>HK${totalAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${c.border}` }}>
                <span style={{ fontSize: 13, color: c.t1 }}>已付款</span>
                <span style={{ fontSize: 13, color: c.success }}>- HK${confirmedTotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: c.t0 }}>尾款 (40%)</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: ACCENT }}>HK${finalAmount.toLocaleString()}</span>
              </div>
            </Card>

            <Card style={{ padding: '20px 24px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 16 }}>選擇付款方式</div>
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {(['stripe', 'fps'] as const).map(m => (
                  <button key={m} onClick={() => setPayMethod(m)} style={{
                    flex: 1, padding: '12px', borderRadius: 8, cursor: 'pointer',
                    border: `2px solid ${payMethod === m ? ACCENT : c.border}`,
                    background: payMethod === m ? ACCENT + '12' : c.bg2,
                    color: payMethod === m ? ACCENT : c.t1, fontSize: 13, fontWeight: 500, fontFamily: 'inherit',
                  }}>
                    {m === 'stripe' ? '💳 信用卡' : '🏦 FPS 轉數快'}
                  </button>
                ))}
              </div>

              {payMethod === 'stripe' ? (
                <Btn variant="primary" icon="creditCard" onClick={handleStripePay} disabled={loading} style={{ width: '100%' }}>
                  前往信用卡支付 HK${finalAmount.toLocaleString()}
                </Btn>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ padding: '16px', background: c.bg2, borderRadius: 8, border: `1px solid ${c.border}` }}>
                    <div style={{ fontSize: 12, color: c.t2, marginBottom: 8 }}>FPS 轉帳資料</div>
                    <div style={{ fontSize: 13, color: c.t0, lineHeight: 1.8 }}>
                      <div>收款人：<strong>416 AI Studio</strong></div>
                      <div>電話號碼：<strong>9XXX XXXX</strong></div>
                      <div>金額：<strong style={{ color: ACCENT }}>HK${finalAmount.toLocaleString()}</strong></div>
                      <div>備註：<strong>{project.name} - 尾款</strong></div>
                    </div>
                  </div>
                  <Btn variant="primary" icon="check" onClick={handleFpsDone} disabled={loading}>
                    已完成轉帳，等待確認
                  </Btn>
                </div>
              )}
            </Card>

            {alreadyPaid && (
              <div style={{ textAlign: 'center' }}>
                <Btn variant="success" icon="download" onClick={() => setStep('download')}>
                  尾款已付清，前往下載
                </Btn>
              </div>
            )}
          </div>
        )}

        {step === 'download' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ padding: '24px', textAlign: 'center', border: `1px solid ${c.success + '40'}`, background: c.success + '08' }}>
              <Icon name="checkCircle" size={40} color={c.success} style={{ marginBottom: 12 }} />
              <h3 style={{ fontSize: 18, fontWeight: 700, color: c.t0, marginBottom: 8 }}>項目交付完成！</h3>
              <p style={{ fontSize: 13, color: c.t1 }}>感謝選擇 416 AI Studio，下載所有交付物後請妥善保存。</p>
            </Card>

            {files.length > 0 ? (
              <Card style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 16 }}>交付文件</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {files.map((url, i) => {
                    const filename = url.split('/').pop() ?? `file-${i + 1}`
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: c.bg2, borderRadius: 8, border: `1px solid ${c.border}` }}>
                        <Icon name="file" size={16} color={ACCENT} />
                        <span style={{ flex: 1, fontSize: 13, color: c.t0 }}>{filename}</span>
                        <a href={url} target="_blank" rel="noopener noreferrer" download>
                          <Btn variant="accent" size="sm" icon="download">下載</Btn>
                        </a>
                      </div>
                    )
                  })}
                </div>
              </Card>
            ) : (
              <Card style={{ padding: '24px', textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: c.t2 }}>Admin 正在上傳交付文件，請稍候。</p>
              </Card>
            )}

            {delivery.credentials && (
              <Card style={{ padding: '20px 24px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 12 }}>登入憑證</div>
                <div style={{ padding: '14px', background: c.bg1, borderRadius: 8, border: `1px solid ${c.border}`, fontFamily: 'monospace', fontSize: 12, color: c.t1, whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                  {delivery.credentials}
                </div>
              </Card>
            )}
          </div>
        )}
      </PageShell>
    </ClientPortalShell>
  )
}
