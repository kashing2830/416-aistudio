'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DARK, ACCENT, fmt } from '@/components/portal/theme'
import { Icon, Badge, Card, Btn, TextArea, PageShell, Label } from '@/components/portal/ui'
import { ClientPortalShell } from '@/components/portal/PortalShell'
import type { Project, ScopeDocument, Quote } from '@/lib/supabase/types'

const c = DARK

export default function ScopeClient({ project, scope, quote, userEmail }: {
  project: Project; scope: ScopeDocument | null; quote: Quote | null; userEmail: string
}) {
  const router = useRouter()
  const [action, setAction] = useState<'confirm' | 'revise'>('confirm')
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    setLoading(true)
    const supabase = createClient()
    if (action === 'confirm' && scope) {
      await supabase.from('scope_documents').update({ client_confirmed_at: new Date().toISOString() }).eq('id', scope.id)
      await supabase.from('projects').update({ stage: scope && !quote ? 0 : 0 }).eq('id', project.id)
    } else if (scope) {
      await supabase.from('scope_documents').update({ revision_note: comment }).eq('id', scope.id)
    }
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'scope_action', projectId: project.id, action, comment }),
    })
    router.push('/portal/dashboard')
  }

  if (!scope) {
    return (
      <ClientPortalShell project={project} userEmail={userEmail}>
        <PageShell title="Scope 確認" maxWidth={600}>
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Icon name="clock" size={40} color={c.t2} style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: c.t0, marginBottom: 8 }}>等待 Scope Document</h2>
            <p style={{ fontSize: 13, color: c.t1, lineHeight: 1.6 }}>Admin 正在整理你的需求，1–2 個工作天內會上傳 Scope Document。<br />上傳後系統會發送電郵通知你。</p>
          </div>
        </PageShell>
      </ClientPortalShell>
    )
  }

  return (
    <ClientPortalShell project={project} userEmail={userEmail}>
      <PageShell title="Scope 確認" subtitle="請仔細閱讀 Scope Document，確認後系統將顯示 Lock Fee 付款指示" maxWidth={1000}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 20 }}>
          {/* Left: Document preview */}
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ background: ACCENT + '15', borderBottom: `1px solid ${c.border}`, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon name="file" size={15} color={ACCENT} />
              <span style={{ fontSize: 12, fontWeight: 600, color: c.t0 }}>Scope_Document_v{scope.version}.pdf</span>
              <a href={scope.file_url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto' }}>
                <Btn variant="ghost" size="sm" icon="download">Download</Btn>
              </a>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: c.t0, marginBottom: 4 }}>{project.name}</div>
              <div style={{ fontSize: 11, color: c.t2, marginBottom: 20 }}>Scope Document v{scope.version} · {new Date(scope.created_at).toLocaleDateString('zh-HK')}</div>

              {scope.client_confirmed_at ? (
                <div style={{ padding: '16px', background: c.success + '12', border: `1px solid ${c.success}30`, borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Icon name="checkCircle" size={18} color={c.success} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: c.t0 }}>Scope 已確認</div>
                    <div style={{ fontSize: 11, color: c.t2 }}>{new Date(scope.client_confirmed_at).toLocaleDateString('zh-HK')}</div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '16px', background: c.bg3, borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: c.t1, lineHeight: 1.6 }}>請點擊 Download 下載 PDF 查閱完整 Scope Document，確認範圍後選擇操作。</div>
                </div>
              )}
            </div>
          </Card>

          {/* Right: Action */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {!scope.client_confirmed_at && (
              <>
                <Card>
                  <div style={{ fontSize: 14, fontWeight: 600, color: c.t0, marginBottom: 16 }}>你的決定</div>
                  {([
                    { val: 'confirm', label: '確認 Scope', desc: '同意以上範圍，繼續繳付 Lock Fee', icon: 'checkCircle', color: c.success },
                    { val: 'revise', label: '提出修改意見', desc: '對範圍有疑問或需要調整', icon: 'edit', color: c.warning },
                  ] as const).map(opt => (
                    <div key={opt.val} onClick={() => setAction(opt.val)} style={{
                      padding: '12px 14px', borderRadius: 8, border: `1.5px solid ${action === opt.val ? opt.color : c.border}`,
                      marginBottom: 10, cursor: 'pointer', background: action === opt.val ? opt.color + '12' : 'transparent',
                      transition: 'all 0.15s', display: 'flex', gap: 12, alignItems: 'flex-start',
                    }}>
                      <Icon name={opt.icon} size={16} color={opt.color} style={{ marginTop: 1 }} />
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: c.t0, marginBottom: 2 }}>{opt.label}</div>
                        <div style={{ fontSize: 11, color: c.t1 }}>{opt.desc}</div>
                      </div>
                    </div>
                  ))}
                </Card>

                {action === 'revise' && (
                  <Card>
                    <TextArea label="修改意見" placeholder="請說明你希望修改的範圍或補充的功能..." value={comment} onChange={e => setComment(e.target.value)} rows={5} />
                  </Card>
                )}

                {quote && action === 'confirm' && (
                  <Card style={{ background: ACCENT + '10', border: `1px solid ${ACCENT}30` }}>
                    <div style={{ fontSize: 12, color: c.t1, marginBottom: 8, fontWeight: 600 }}>確認後下一步</div>
                    <div style={{ fontSize: 12, color: c.t1, lineHeight: 1.6 }}>
                      繳付 Lock Fee <strong style={{ color: c.t0 }}>{fmt(quote.lock_fee ?? 800)}</strong>，Admin 將生成正式報價單
                    </div>
                  </Card>
                )}

                <Btn variant={action === 'confirm' ? 'success' : 'primary'} full size="lg"
                  icon={action === 'confirm' ? 'checkCircle' : 'send'}
                  onClick={handleSubmit} disabled={loading || (action === 'revise' && !comment.trim())}>
                  {loading ? '處理中...' : action === 'confirm' ? '確認 Scope → 付款指示' : '提交修改意見'}
                </Btn>
              </>
            )}
          </div>
        </div>
      </PageShell>
    </ClientPortalShell>
  )
}
