'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DARK, ACCENT, SEV_COLORS, STATUS_COLORS, STATUS_LABELS } from '@/components/portal/theme'
import { Icon, Badge, Card, Btn, TextInput, TextArea, PortalSelect, Label, PageShell } from '@/components/portal/ui'
import { ClientPortalShell } from '@/components/portal/PortalShell'
import type { Project, Bug } from '@/lib/supabase/types'

const c = DARK
const FREE_FIX_DAYS = 14

export default function UATClient({ project, bugs, stagingUrl, deliveredAt, userEmail }: {
  project: Project; bugs: Bug[]; stagingUrl: string | null
  deliveredAt: string | null; userEmail: string
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [newBug, setNewBug] = useState<{ title: string; desc: string; severity: 'Critical' | 'Major' | 'Minor' }>({ title: '', desc: '', severity: 'Minor' })
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(false)

  const daysLeft = deliveredAt
    ? Math.max(0, FREE_FIX_DAYS - Math.floor((Date.now() - new Date(deliveredAt).getTime()) / 86400000))
    : FREE_FIX_DAYS

  const filtered = filter === 'All' ? bugs :
    filter === 'Open' ? bugs.filter(b => b.status !== 'fixed') :
      bugs.filter(b => b.severity === filter)

  const handleSubmitBug = async () => {
    if (!newBug.title.trim()) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('bugs').insert({
      project_id: project.id,
      title: newBug.title,
      description: newBug.desc,
      severity: newBug.severity,
      reported_by: user?.id,
    })
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'bug_submitted', projectId: project.id, bugTitle: newBug.title, severity: newBug.severity }),
    })
    setNewBug({ title: '', desc: '', severity: 'Minor' })
    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  return (
    <ClientPortalShell project={project} userEmail={userEmail}>
      <PageShell title="UAT 測試" subtitle="在試用版本中測試所有功能，並提交 Bug 報告。免費修復期限為 2 週。" maxWidth={860}>
        {/* UAT link + countdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, marginBottom: 24 }}>
          <Card style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
            <Icon name="link" size={18} color={ACCENT} />
            <div style={{ flex: 1 }}>
              <Label style={{ marginBottom: 3, display: 'block' }}>試用連結</Label>
              {stagingUrl ? (
                <div style={{ fontSize: 13, color: ACCENT, fontFamily: 'monospace' }}>{stagingUrl}</div>
              ) : (
                <div style={{ fontSize: 13, color: c.t2 }}>Admin 尚未提供試用連結</div>
              )}
            </div>
            {stagingUrl && <a href={stagingUrl} target="_blank" rel="noopener noreferrer">
              <Btn variant="accent" size="sm" icon="externalLink">開啟</Btn>
            </a>}
          </Card>
          <Card style={{ textAlign: 'center', padding: '16px 24px', background: daysLeft <= 3 ? c.warning + '12' : c.bg2, border: `1px solid ${daysLeft <= 3 ? c.warning + '40' : c.border}` }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: daysLeft <= 3 ? c.warning : c.t0, lineHeight: 1 }}>{daysLeft}</div>
            <div style={{ fontSize: 10, color: c.t2, marginTop: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Free Fix Days</div>
          </Card>
        </div>

        {/* Submit Bug button */}
        <div style={{ marginBottom: 20 }}>
          <button onClick={() => setShowForm(!showForm)} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 8,
            background: showForm ? c.bg3 : ACCENT + '18', border: `1px solid ${showForm ? c.border : ACCENT + '40'}`,
            color: showForm ? c.t1 : ACCENT, cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
          }}>
            <Icon name={showForm ? 'x' : 'plus'} size={14} color="currentColor" />
            {showForm ? '取消' : '提交新 Bug'}
          </button>
          {showForm && (
            <Card style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <TextInput label="Bug 標題" placeholder="簡短描述問題" value={newBug.title} onChange={e => setNewBug(b => ({ ...b, title: e.target.value }))} />
                <TextArea label="詳細描述" placeholder="步驟、預期行為、實際行為..." value={newBug.desc} onChange={e => setNewBug(b => ({ ...b, desc: e.target.value }))} rows={3} />
                <div style={{ display: 'flex', gap: 16 }}>
                  <PortalSelect label="嚴重程度" value={newBug.severity} onChange={e => setNewBug(b => ({ ...b, severity: e.target.value as 'Critical' | 'Major' | 'Minor' }))} options={['Critical', 'Major', 'Minor']} style={{ flex: 1 }} />
                  <div style={{ flex: 1 }} />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn variant="primary" icon="send" onClick={handleSubmitBug} disabled={!newBug.title.trim() || loading}>提交 Bug</Btn>
                  <Btn variant="ghost" onClick={() => setShowForm(false)}>取消</Btn>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Bug list */}
        <Card style={{ padding: 0 }}>
          <div style={{ padding: '14px 20px', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: c.t0 }}>Bug List</span>
            <span style={{ fontSize: 11, color: c.t2 }}>{bugs.length} 個</span>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              {['All', 'Critical', 'Major', 'Minor', 'Open'].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: '4px 10px', borderRadius: 20,
                  border: `1px solid ${filter === f ? ACCENT : c.border}`,
                  background: filter === f ? ACCENT + '18' : 'transparent',
                  color: filter === f ? ACCENT : c.t2,
                  fontSize: 11, fontWeight: filter === f ? 600 : 400, cursor: 'pointer', fontFamily: 'inherit',
                }}>{f}</button>
              ))}
            </div>
          </div>
          {filtered.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: 13, color: c.t2 }}>
              {bugs.length === 0 ? '暫無 Bug，繼續測試！' : '沒有符合條件的 Bug'}
            </div>
          ) : filtered.map((bug, i) => (
            <div key={bug.id} style={{ padding: '14px 20px', borderBottom: i < filtered.length - 1 ? `1px solid ${c.border}` : 'none', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: SEV_COLORS[bug.severity], flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: c.t0, marginBottom: 2 }}>{bug.title}</div>
                <div style={{ fontSize: 11, color: c.t2, display: 'flex', gap: 8 }}>
                  <span>{new Date(bug.created_at).toLocaleDateString('zh-HK')}</span>
                </div>
              </div>
              <Badge color={SEV_COLORS[bug.severity]} bg={SEV_COLORS[bug.severity] + '18'}>{bug.severity}</Badge>
              <Badge color={STATUS_COLORS[bug.status]} bg={STATUS_COLORS[bug.status] + '18'}>{STATUS_LABELS[bug.status]}</Badge>
            </div>
          ))}
        </Card>
      </PageShell>
    </ClientPortalShell>
  )
}
