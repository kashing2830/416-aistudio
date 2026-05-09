'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DARK, ACCENT, STAGE_LABELS, SEV_COLORS, STATUS_COLORS, STATUS_LABELS, fmt } from '@/components/portal/theme'
import { Icon, Badge, Card, Btn, TextInput, TextArea, PortalSelect, Label, PageShell, StageBar } from '@/components/portal/ui'
import { AdminPortalShell } from '@/components/portal/PortalShell'
import type { Project, Requirement, ScopeDocument, Quote, Payment, Design, Milestone, Bug, Delivery } from '@/lib/supabase/types'

const c = DARK
type Tab = 'overview' | 'scope' | 'quote' | 'design' | 'dev' | 'uat' | 'delivery'

type ProjectWithClient = Project & { profiles?: { email: string; full_name: string | null } | null }

export default function AdminProjectClient({ project, requirements, scopeDoc, quote, payments, design, milestones, bugs, delivery }: {
  project: ProjectWithClient
  requirements: Requirement | null
  scopeDoc: ScopeDocument | null
  quote: Quote | null
  payments: Payment[]
  design: Design | null
  milestones: Milestone[]
  bugs: Bug[]
  delivery: Delivery | null
}) {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')
  const [loading, setLoading] = useState(false)

  // Scope upload
  const [scopeUrl, setScopeUrl] = useState('')
  // Quote form
  const [quoteForm, setQuoteForm] = useState({ totalAmount: quote?.total_amount?.toString() ?? '', notes: quote?.notes ?? '', features: quote?.features ? JSON.stringify(quote.features) : '[]' })
  // Milestone form
  const [mlTitle, setMlTitle] = useState('')
  const [mlNote, setMlNote] = useState('')
  // Design upload
  const [designUrls, setDesignUrls] = useState('')
  // Delivery form
  const [deliveryNotes, setDeliveryNotes] = useState(delivery?.notes ?? '')
  const [deliveryUrls, setDeliveryUrls] = useState((delivery?.file_urls as string[] ?? []).join('\n'))
  const [deliveryCreds, setDeliveryCreds] = useState(delivery?.credentials ?? '')
  // Staging url
  const [stagingUrl, setStagingUrl] = useState(delivery?.staging_url ?? '')

  const notify = async (type: string, extra = {}) => {
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, projectId: project.id, ...extra }),
    })
  }

  const setStage = async (stage: number) => {
    setLoading(true)
    const supabase = createClient()
    await supabase.from('projects').update({ stage }).eq('id', project.id)
    router.refresh()
    setLoading(false)
  }

  const handleUploadScope = async () => {
    if (!scopeUrl.trim()) return
    setLoading(true)
    const supabase = createClient()
    if (scopeDoc) {
      await supabase.from('scope_documents').update({ file_url: scopeUrl }).eq('id', scopeDoc.id)
    } else {
      await supabase.from('scope_documents').insert({ project_id: project.id, file_url: scopeUrl })
    }
    await notify('scope_uploaded')
    setLoading(false)
    router.refresh()
  }

  const handleSaveQuote = async () => {
    setLoading(true)
    const supabase = createClient()
    const payload = {
      project_id: project.id,
      total_amount: parseFloat(quoteForm.totalAmount),
      notes: quoteForm.notes,
      features: JSON.parse(quoteForm.features || '[]'),
    }
    if (quote) {
      await supabase.from('quotes').update(payload).eq('id', quote.id)
    } else {
      await supabase.from('quotes').insert(payload)
    }
    await supabase.from('projects').update({ total_amount: payload.total_amount }).eq('id', project.id)
    await notify('quote_sent')
    setLoading(false)
    router.refresh()
  }

  const handleAddMilestone = async () => {
    if (!mlTitle.trim()) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('milestones').insert({
      project_id: project.id,
      title: mlTitle,
      note: mlNote,
      order: milestones.length,
      status: 'pending',
    })
    setMlTitle('')
    setMlNote('')
    setLoading(false)
    router.refresh()
  }

  const handleUpdateMilestone = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('milestones').update({
      status,
      completed_at: status === 'done' ? new Date().toISOString() : null,
    }).eq('id', id)
    router.refresh()
  }

  const handleUploadDesign = async () => {
    if (!designUrls.trim()) return
    setLoading(true)
    const supabase = createClient()
    const urls = designUrls.split('\n').map(s => s.trim()).filter(Boolean)
    if (design) {
      await supabase.from('designs').update({ file_urls: urls, version: (design.version ?? 1) + 1 }).eq('id', design.id)
    } else {
      await supabase.from('designs').insert({ project_id: project.id, file_urls: urls, version: 1 })
    }
    await notify('design_uploaded')
    setLoading(false)
    router.refresh()
  }

  const handleUpdateBug = async (id: string, status: string) => {
    const supabase = createClient()
    await supabase.from('bugs').update({ status }).eq('id', id)
    router.refresh()
  }

  const handleSaveDelivery = async () => {
    setLoading(true)
    const supabase = createClient()
    const fileUrls = deliveryUrls.split('\n').map(s => s.trim()).filter(Boolean)
    const payload = { project_id: project.id, notes: deliveryNotes, file_urls: fileUrls, credentials: deliveryCreds, staging_url: stagingUrl }
    if (delivery) {
      await supabase.from('deliveries').update(payload).eq('id', delivery.id)
    } else {
      await supabase.from('deliveries').insert(payload)
    }
    await notify('delivery_ready')
    setLoading(false)
    router.refresh()
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: '總覽' },
    { id: 'scope', label: '需求範圍' },
    { id: 'quote', label: '報價' },
    { id: 'design', label: '設計' },
    { id: 'dev', label: '開發' },
    { id: 'uat', label: 'UAT' },
    { id: 'delivery', label: '交付' },
  ]

  return (
    <AdminPortalShell userEmail="">
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 24 }}>
          <button onClick={() => router.push('/admin/dashboard')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: c.t2, padding: 0, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
            <Icon name="chevLeft" size={14} color={c.t2} />
          </button>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: c.t0, margin: '0 0 4px' }}>{project.name}</h1>
            <div style={{ fontSize: 12, color: c.t2 }}>{project.profiles?.email}</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Btn variant="ghost" size="sm" onClick={() => setStage(Math.max(0, project.stage - 1))} disabled={loading || project.stage === 0}>← 上一階段</Btn>
            <Btn variant="primary" size="sm" onClick={() => setStage(Math.min(5, project.stage + 1))} disabled={loading || project.stage === 5}>下一階段 →</Btn>
          </div>
        </div>

        <StageBar stage={project.stage} style={{ marginBottom: 24 }} />

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: `1px solid ${c.border}`, paddingBottom: 0 }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '8px 16px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
              fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
              color: tab === t.id ? ACCENT : c.t1,
              borderBottom: `2px solid ${tab === t.id ? ACCENT : 'transparent'}`,
              marginBottom: -1,
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab: Overview */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Card style={{ padding: '20px 24px' }}>
              <Label style={{ marginBottom: 12, display: 'block' }}>客戶需求摘要</Label>
              {requirements ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 12, color: c.t1 }}><strong style={{ color: c.t0 }}>類型：</strong>{requirements.project_type}</div>
                  <div style={{ fontSize: 12, color: c.t1 }}><strong style={{ color: c.t0 }}>預算：</strong>HK${requirements.budget?.toLocaleString() ?? '未填'}</div>
                  <div style={{ fontSize: 12, color: c.t1 }}><strong style={{ color: c.t0 }}>期限：</strong>{requirements.deadline ?? '未填'}</div>
                  <div style={{ fontSize: 12, color: c.t1, marginTop: 4 }}>{requirements.description}</div>
                </div>
              ) : <div style={{ fontSize: 12, color: c.t2 }}>尚未提交需求</div>}
            </Card>
            <Card style={{ padding: '20px 24px' }}>
              <Label style={{ marginBottom: 12, display: 'block' }}>付款狀況</Label>
              {payments.map(p => (
                <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${c.border}`, fontSize: 12 }}>
                  <span style={{ color: c.t1 }}>{p.type} ({p.method})</span>
                  <span style={{ color: p.status === 'confirmed' ? c.success : '#f59e0b' }}>HK${p.amount.toLocaleString()} · {p.status}</span>
                </div>
              ))}
              {payments.length === 0 && <div style={{ fontSize: 12, color: c.t2 }}>暫無付款記錄</div>}
            </Card>
          </div>
        )}

        {/* Tab: Scope */}
        {tab === 'scope' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ padding: '20px 24px' }}>
              <Label style={{ marginBottom: 12, display: 'block' }}>上傳需求範圍文件 URL</Label>
              <div style={{ display: 'flex', gap: 12 }}>
                <TextInput placeholder="文件公開 URL（PDF/Notion 等）" value={scopeUrl} onChange={e => setScopeUrl(e.target.value)} style={{ flex: 1 }} />
                <Btn variant="primary" icon="upload" onClick={handleUploadScope} disabled={loading}>上傳</Btn>
              </div>
              {scopeDoc?.file_url && (
                <div style={{ marginTop: 12, fontSize: 12, color: ACCENT }}>
                  當前：<a href={scopeDoc.file_url} target="_blank" rel="noopener noreferrer" style={{ color: ACCENT }}>{scopeDoc.file_url}</a>
                  {scopeDoc.client_confirmed_at && <Badge color={c.success} bg={c.success + '18'} style={{ marginLeft: 8 }}>已確認</Badge>}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Tab: Quote */}
        {tab === 'quote' && (
          <Card style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <TextInput label="總報價 (HKD)" type="number" placeholder="例如 28000" value={quoteForm.totalAmount} onChange={e => setQuoteForm(f => ({ ...f, totalAmount: e.target.value }))} />
              <TextArea label="報價備註" placeholder="付款方式、功能說明等..." value={quoteForm.notes} onChange={e => setQuoteForm(f => ({ ...f, notes: e.target.value }))} rows={3} />
              <TextArea label="功能列表 (JSON 陣列)" placeholder='["用戶登入", "資料管理", "報表匯出"]' value={quoteForm.features} onChange={e => setQuoteForm(f => ({ ...f, features: e.target.value }))} rows={4} />
              <div style={{ display: 'flex', gap: 10 }}>
                <Btn variant="primary" icon="send" onClick={handleSaveQuote} disabled={loading}>
                  {quote ? '更新報價' : '發送報價'}
                </Btn>
                {quote?.accepted_at && <Badge color={c.success} bg={c.success + '18'}>✓ 客戶已接受</Badge>}
              </div>
            </div>
          </Card>
        )}

        {/* Tab: Design */}
        {tab === 'design' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ padding: '20px 24px' }}>
              <Label style={{ marginBottom: 12, display: 'block' }}>上傳設計圖 URL（每行一個）</Label>
              <TextArea placeholder="https://..." value={designUrls} onChange={e => setDesignUrls(e.target.value)} rows={4} />
              <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
                <Btn variant="primary" icon="upload" onClick={handleUploadDesign} disabled={loading}>上傳設計</Btn>
                {design?.client_confirmed_at && <Badge color={c.success} bg={c.success + '18'}>✓ 客戶已確認</Badge>}
                {design?.client_comment && (
                  <div style={{ padding: '10px 14px', background: c.bg2, borderRadius: 8, border: `1px solid ${c.border}`, fontSize: 12, color: c.t1, flex: 1 }}>
                    <strong style={{ color: c.t0 }}>客戶意見：</strong>{design.client_comment}
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Tab: Dev (Milestones) */}
        {tab === 'dev' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ padding: '20px 24px' }}>
              <Label style={{ marginBottom: 12, display: 'block' }}>新增 Milestone</Label>
              <div style={{ display: 'flex', gap: 12 }}>
                <TextInput placeholder="標題" value={mlTitle} onChange={e => setMlTitle(e.target.value)} style={{ flex: 1 }} />
                <TextInput placeholder="備註（可選）" value={mlNote} onChange={e => setMlNote(e.target.value)} style={{ flex: 1 }} />
                <Btn variant="primary" icon="plus" onClick={handleAddMilestone} disabled={loading}>新增</Btn>
              </div>
            </Card>
            <Card style={{ padding: 0 }}>
              {milestones.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: 12, color: c.t2 }}>暫無 Milestone</div>
              ) : milestones.map((m, i) => (
                <div key={m.id} style={{ padding: '14px 20px', borderBottom: i < milestones.length - 1 ? `1px solid ${c.border}` : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: m.status === 'done' ? c.success : m.status === 'active' ? ACCENT : c.t2, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: c.t0 }}>{m.title}</div>
                    {m.note && <div style={{ fontSize: 11, color: c.t2 }}>{m.note}</div>}
                  </div>
                  <select
                    value={m.status}
                    onChange={e => handleUpdateMilestone(m.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${c.border}`, background: c.bg2, color: c.t0, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer' }}
                  >
                    <option value="pending">待開始</option>
                    <option value="active">進行中</option>
                    <option value="done">完成</option>
                  </select>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Tab: UAT */}
        {tab === 'uat' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Card style={{ padding: '20px 24px' }}>
              <Label style={{ marginBottom: 12, display: 'block' }}>試用連結</Label>
              <div style={{ display: 'flex', gap: 12 }}>
                <TextInput placeholder="https://staging.example.com" value={stagingUrl} onChange={e => setStagingUrl(e.target.value)} style={{ flex: 1 }} />
                <Btn variant="primary" icon="save" onClick={async () => {
                  setLoading(true)
                  const supabase = createClient()
                  if (delivery) {
                    await supabase.from('deliveries').update({ staging_url: stagingUrl }).eq('id', delivery.id)
                  } else {
                    await supabase.from('deliveries').insert({ project_id: project.id, staging_url: stagingUrl })
                  }
                  setLoading(false)
                  router.refresh()
                }} disabled={loading}>儲存</Btn>
              </div>
            </Card>
            <Card style={{ padding: 0 }}>
              <div style={{ padding: '14px 20px', borderBottom: `1px solid ${c.border}` }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: c.t0 }}>Bug 列表</span>
                <span style={{ fontSize: 11, color: c.t2, marginLeft: 8 }}>{bugs.length} 個</span>
              </div>
              {bugs.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: 12, color: c.t2 }}>暫無 Bug</div>
              ) : bugs.map((b, i) => (
                <div key={b.id} style={{ padding: '14px 20px', borderBottom: i < bugs.length - 1 ? `1px solid ${c.border}` : 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: SEV_COLORS[b.severity], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: c.t0 }}>{b.title}</div>
                    {b.description && <div style={{ fontSize: 11, color: c.t2 }}>{b.description}</div>}
                  </div>
                  <Badge color={SEV_COLORS[b.severity]} bg={SEV_COLORS[b.severity] + '18'}>{b.severity}</Badge>
                  <select
                    value={b.status}
                    onChange={e => handleUpdateBug(b.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${c.border}`, background: c.bg2, color: c.t0, fontSize: 11, fontFamily: 'inherit', cursor: 'pointer' }}
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">修復中</option>
                    <option value="fixed">已修復</option>
                  </select>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* Tab: Delivery */}
        {tab === 'delivery' && (
          <Card style={{ padding: '20px 24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <TextArea label="交付說明" placeholder="環境配置、部署說明、使用注意事項..." value={deliveryNotes} onChange={e => setDeliveryNotes(e.target.value)} rows={3} />
              <TextArea label="交付文件 URL（每行一個）" placeholder="https://..." value={deliveryUrls} onChange={e => setDeliveryUrls(e.target.value)} rows={4} />
              <TextArea label="登入憑證" placeholder="Admin URL: https://...&#10;帳號: admin@...&#10;密碼: ..." value={deliveryCreds} onChange={e => setDeliveryCreds(e.target.value)} rows={4} />
              <div style={{ display: 'flex', gap: 10 }}>
                <Btn variant="primary" icon="send" onClick={handleSaveDelivery} disabled={loading}>
                  {delivery ? '更新交付' : '發布交付'}
                </Btn>
                {delivery?.client_accepted_at && <Badge color={c.success} bg={c.success + '18'}>✓ 客戶已驗收</Badge>}
              </div>
            </div>
          </Card>
        )}
      </div>
    </AdminPortalShell>
  )
}
