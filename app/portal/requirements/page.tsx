'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DARK, ACCENT } from '@/components/portal/theme'
import { Icon, Card, Btn, TextInput, TextArea, PortalSelect, PageShell } from '@/components/portal/ui'
import { ClientPortalShell } from '@/components/portal/PortalShell'

const c = DARK

export default function RequirementsPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: '', type: 'Web App', users: '', features: '',
    budget: '', deadline: '', refs: '', notes: '',
  })
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))
  const steps = ['基本資料', '功能需求', '參考資料']

  const handleSubmit = async () => {
    if (!form.features.trim()) { setError('請填寫主要功能需求'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/portal/login'); return }

    // Create project
    const { data: project, error: pErr } = await supabase
      .from('projects')
      .insert({ client_id: user.id, name: form.name || '新項目', type: form.type, stage: 0 })
      .select()
      .single()

    if (pErr) { setError(pErr.message); setLoading(false); return }

    // Create requirement
    const { error: rErr } = await supabase
      .from('requirements')
      .insert({
        project_id: project.id,
        project_type: form.type,
        description: `目標用戶：${form.users}\n\n功能需求：${form.features}`,
        budget: form.budget ? parseInt(form.budget.replace(/[^0-9]/g, '')) || null : null,
        deadline: form.deadline || null,
        reference_urls: form.refs,
        notes: form.notes,
      })

    if (rErr) { setError(rErr.message); setLoading(false); return }

    // Notify admin via API
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'requirement_submitted', projectId: project.id }),
    })

    router.push('/portal/dashboard')
  }

  return (
    <ClientPortalShell>
      <PageShell title="需求表格" subtitle="填寫項目需求後，Admin 將在 1–2 個工作天內準備 Scope Document" maxWidth={680}>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 32 }}>
          {steps.map((s, i) => {
            const n = i + 1, done = step > n, active = step === n
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : undefined }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: done ? ACCENT : active ? ACCENT + '22' : c.bg3,
                    border: `2px solid ${done || active ? ACCENT : c.border}`,
                    fontSize: 11, fontWeight: 700,
                    color: done ? '#fff' : active ? ACCENT : c.t2,
                  }}>{done ? '✓' : n}</div>
                  <span style={{ fontSize: 10, color: active ? ACCENT : done ? c.t1 : c.t2, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{s}</span>
                </div>
                {i < steps.length - 1 && <div style={{ flex: 1, height: 1.5, background: done ? ACCENT : c.border, transition: 'background 0.3s', margin: '0 8px', marginBottom: 18 }} />}
              </div>
            )
          })}
        </div>

        <Card>
          {step === 1 && (
            <div className="pf" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <TextInput label="項目名稱" placeholder="例：OnePay 電子付款系統" value={form.name} onChange={e => set('name', e.target.value)} />
              <PortalSelect label="項目類型" value={form.type} onChange={e => set('type', e.target.value)} options={['網站', 'Web App', 'Mobile App', '企業系統']} />
              <TextArea label="目標用戶描述" placeholder="例：香港中小企業主，需要接受信用卡付款..." value={form.users} onChange={e => set('users', e.target.value)} rows={3} />
            </div>
          )}
          {step === 2 && (
            <div className="pf" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <TextArea label="主要功能需求 *" placeholder={`請詳細描述你需要的功能\n例：\n- 用戶登入 / 登出\n- 電子付款（Stripe）\n- 訂單管理...`} value={form.features} onChange={e => set('features', e.target.value)} rows={8} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <PortalSelect label="預算範圍（可選）" value={form.budget} onChange={e => set('budget', e.target.value)}
                  options={[{ value: '', label: '未定' }, { value: '<5k', label: 'HKD 5,000 以下' }, { value: '5k-15k', label: 'HKD 5,000–15,000' }, { value: '15k-30k', label: 'HKD 15,000–30,000' }, { value: '>30k', label: 'HKD 30,000+' }]} />
                <TextInput label="期望完成日期（可選）" placeholder="2026-04-01" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="pf" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <TextInput label="參考網站 URL（可選）" placeholder="https://example.com" value={form.refs} onChange={e => set('refs', e.target.value)} prefix="🔗" />
              <TextArea label="補充說明（可選）" placeholder="其他你覺得重要的資訊..." value={form.notes} onChange={e => set('notes', e.target.value)} rows={4} />
              <div style={{ border: `1px dashed ${c.border}`, borderRadius: 8, padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
                <Icon name="upload" size={20} color={c.t2} style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 12, color: c.t1 }}>拖放或點擊上傳截圖 / 參考圖片</div>
                <div style={{ fontSize: 11, color: c.t2, marginTop: 4 }}>PNG, JPG — 最大 10MB</div>
              </div>
            </div>
          )}

          {error && <p style={{ fontSize: 12, color: c.danger, marginTop: 12 }}>{error}</p>}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 28, paddingTop: 20, borderTop: `1px solid ${c.border}` }}>
            {step > 1 ? <Btn variant="ghost" onClick={() => setStep(s => s - 1)} icon="chevLeft">上一步</Btn> : <div />}
            {step < 3
              ? <Btn variant="primary" onClick={() => setStep(s => s + 1)} icon="arrowRight">下一步 · {steps[step]}</Btn>
              : <Btn variant="success" icon="send" onClick={handleSubmit} disabled={loading}>{loading ? '提交中...' : '提交需求'}</Btn>}
          </div>
        </Card>
      </PageShell>
    </ClientPortalShell>
  )
}
