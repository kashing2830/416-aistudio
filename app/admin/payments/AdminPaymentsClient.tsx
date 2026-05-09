'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DARK, ACCENT } from '@/components/portal/theme'
import { Icon, Badge, Card, Btn, PageShell } from '@/components/portal/ui'
import { AdminPortalShell } from '@/components/portal/PortalShell'

const c = DARK

type PaymentWithProject = {
  id: string
  amount: number
  type: string
  method: string
  status: string
  created_at: string
  project_id: string
  projects?: { name: string; profiles?: { email: string } | null } | null
}

export default function AdminPaymentsClient({ payments }: { payments: PaymentWithProject[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('all')

  const filtered = filter === 'all' ? payments :
    payments.filter(p => p.status === filter)

  const handleConfirm = async (paymentId: string, projectId: string, amount: number, type: string) => {
    setLoading(paymentId)
    const supabase = createClient()
    await supabase.from('payments').update({ status: 'confirmed', confirmed_at: new Date().toISOString() }).eq('id', paymentId)

    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'payment_confirmed', projectId, amount, paymentType: type }),
    })

    setLoading(null)
    router.refresh()
  }

  const handleReject = async (paymentId: string) => {
    setLoading(paymentId)
    const supabase = createClient()
    await supabase.from('payments').update({ status: 'rejected' }).eq('id', paymentId)
    setLoading(null)
    router.refresh()
  }

  const totalConfirmed = payments.filter(p => p.status === 'confirmed').reduce((s, p) => s + p.amount, 0)
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0)

  return (
    <AdminPortalShell userEmail="">
      <PageShell title="付款管理" subtitle="確認 FPS 人工轉帳，查看 Stripe 自動付款記錄。" maxWidth={900}>
        {/* Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: '待確認', value: totalPending, count: payments.filter(p => p.status === 'pending').length, color: '#f59e0b' },
            { label: '已確認', value: totalConfirmed, count: payments.filter(p => p.status === 'confirmed').length, color: c.success },
            { label: '全部收入', value: totalConfirmed, count: payments.length, color: ACCENT },
          ].map(s => (
            <Card key={s.label} style={{ padding: '16px 20px' }}>
              <div style={{ fontSize: 11, color: c.t2, marginBottom: 4 }}>{s.label} ({s.count} 筆)</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>HK${s.value.toLocaleString()}</div>
            </Card>
          ))}
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {(['all', 'pending', 'confirmed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 14px', borderRadius: 20, border: `1px solid ${filter === f ? ACCENT : c.border}`,
              background: filter === f ? ACCENT + '18' : 'transparent', color: filter === f ? ACCENT : c.t2,
              fontSize: 11, fontWeight: filter === f ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {f === 'all' ? '全部' : f === 'pending' ? '待確認' : '已確認'}
            </button>
          ))}
        </div>

        <Card style={{ padding: 0 }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 80px 90px 120px 160px', gap: 12, padding: '10px 20px', background: c.bg2, borderBottom: `1px solid ${c.border}`, fontSize: 11, fontWeight: 600, color: c.t2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <span>項目 / 客戶</span>
            <span>類型</span>
            <span>方式</span>
            <span style={{ textAlign: 'right' }}>金額</span>
            <span style={{ textAlign: 'center' }}>狀態</span>
            <span style={{ textAlign: 'center' }}>操作</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', fontSize: 13, color: c.t2 }}>無付款記錄</div>
          ) : filtered.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '1fr 100px 80px 90px 120px 160px', gap: 12,
              padding: '14px 20px', borderBottom: i < filtered.length - 1 ? `1px solid ${c.border}` : 'none',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: c.t0 }}>{p.projects?.name ?? '未知項目'}</div>
                <div style={{ fontSize: 11, color: c.t2 }}>{p.projects?.profiles?.email ?? ''}</div>
              </div>
              <div style={{ fontSize: 12, color: c.t1 }}>{p.type}</div>
              <div>
                <Badge
                  color={p.method === 'stripe' ? '#8b5cf6' : '#f59e0b'}
                  bg={(p.method === 'stripe' ? '#8b5cf6' : '#f59e0b') + '18'}
                >
                  {p.method === 'stripe' ? 'Stripe' : 'FPS'}
                </Badge>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: c.t0, textAlign: 'right' }}>
                HK${p.amount.toLocaleString()}
              </div>
              <div style={{ textAlign: 'center' }}>
                <Badge
                  color={p.status === 'confirmed' ? c.success : p.status === 'pending' ? '#f59e0b' : '#ef4444'}
                  bg={(p.status === 'confirmed' ? c.success : p.status === 'pending' ? '#f59e0b' : '#ef4444') + '18'}
                >
                  {p.status === 'confirmed' ? '已確認' : p.status === 'pending' ? '待確認' : '已拒絕'}
                </Badge>
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                {p.status === 'pending' && (
                  <>
                    <Btn
                      variant="success"
                      size="sm"
                      icon="check"
                      onClick={() => handleConfirm(p.id, p.project_id, p.amount, p.type)}
                      disabled={loading === p.id}
                    >確認</Btn>
                    <Btn
                      variant="danger"
                      size="sm"
                      onClick={() => handleReject(p.id)}
                      disabled={loading === p.id}
                    >拒絕</Btn>
                  </>
                )}
                {p.status !== 'pending' && (
                  <span style={{ fontSize: 11, color: c.t2 }}>{new Date(p.created_at).toLocaleDateString('zh-HK')}</span>
                )}
              </div>
            </div>
          ))}
        </Card>
      </PageShell>
    </AdminPortalShell>
  )
}
