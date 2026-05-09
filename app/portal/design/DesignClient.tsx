'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DARK, ACCENT } from '@/components/portal/theme'
import { Icon, Badge, Btn, TextArea } from '@/components/portal/ui'
import { ClientPortalShell } from '@/components/portal/PortalShell'
import type { Project, Design } from '@/lib/supabase/types'

const c = DARK
const MAX_REVISIONS = 2

export default function DesignClient({ project, design, userEmail }: {
  project: Project; design: Design | null; userEmail: string
}) {
  const router = useRouter()
  const [slide, setSlide] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const files = (design?.file_urls ?? []) as string[]
  const revisionsLeft = MAX_REVISIONS - (design?.revision_count ?? 0)
  const isConfirmed = !!design?.client_confirmed_at

  const handleConfirm = async () => {
    if (!design) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('designs').update({ client_confirmed_at: new Date().toISOString() }).eq('id', design.id)
    await supabase.from('projects').update({ stage: 2 }).eq('id', project.id)
    router.push('/portal/dashboard')
  }

  const handleSubmitComment = async () => {
    if (!design || !comment.trim()) return
    setLoading(true)
    const supabase = createClient()
    await supabase.from('designs').update({
      client_comment: comment,
      revision_count: (design.revision_count ?? 0) + 1,
    }).eq('id', design.id)
    await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'design_comment', projectId: project.id, comment }),
    })
    setComment('')
    setLoading(false)
    router.refresh()
  }

  if (!design) {
    return (
      <ClientPortalShell project={project} userEmail={userEmail}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <Icon name="clock" size={40} color={c.t2} style={{ marginBottom: 16 }} />
            <h2 style={{ fontSize: 18, fontWeight: 600, color: c.t0, marginBottom: 8 }}>等待設計初稿</h2>
            <p style={{ fontSize: 13, color: c.t1 }}>Admin 正在準備設計，上傳後將發送電郵通知你。</p>
          </div>
        </div>
      </ClientPortalShell>
    )
  }

  return (
    <ClientPortalShell project={project} userEmail={userEmail}>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '14px 28px', borderBottom: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: c.t2, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Stage 1 · 設計審閱</span>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: c.t0, margin: '2px 0 0' }}>{project.name} — 設計 v{design.version}</h2>
          </div>
          <Badge color={revisionsLeft > 0 ? ACCENT : c.warning} bg={(revisionsLeft > 0 ? ACCENT : c.warning) + '18'}>
            剩餘修改 {revisionsLeft} / {MAX_REVISIONS} 次
          </Badge>
          {!isConfirmed
            ? <Btn variant="success" icon="checkCircle" onClick={handleConfirm} disabled={loading}>確認設計</Btn>
            : <Badge color={c.success} bg={c.success + '18'}>✓ 設計已確認</Badge>}
        </div>

        <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
          {/* Slide thumbnails */}
          {files.length > 1 && (
            <div style={{ width: 160, borderRight: `1px solid ${c.border}`, padding: '12px 8px', overflowY: 'auto', flexShrink: 0 }}>
              {files.map((url, i) => (
                <div key={i} onClick={() => setSlide(i)} style={{
                  marginBottom: 8, cursor: 'pointer', borderRadius: 8, overflow: 'hidden',
                  border: `2px solid ${slide === i ? ACCENT : c.border}`,
                }}>
                  <img src={url} alt={`Slide ${i + 1}`} style={{ width: '100%', height: 88, objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          )}

          {/* Main viewer */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: c.bg1, position: 'relative' }}>
              {slide > 0 && (
                <button onClick={() => setSlide(s => s - 1)} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: c.bg2, border: `1px solid ${c.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="chevLeft" size={16} color={c.t1} />
                </button>
              )}
              {slide < files.length - 1 && (
                <button onClick={() => setSlide(s => s + 1)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 36, height: 36, borderRadius: '50%', background: c.bg2, border: `1px solid ${c.border}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="chevRight" size={16} color={c.t1} />
                </button>
              )}

              {files[slide] ? (
                <img key={slide} src={files[slide]} alt={`Design slide ${slide + 1}`}
                  style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 8, boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }} />
              ) : (
                <div style={{ width: '100%', maxWidth: 640, aspectRatio: '16/10', background: c.bg2, borderRadius: 12, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="image" size={40} color={c.t2} />
                </div>
              )}

              {files.length > 1 && (
                <div style={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: c.t2, background: c.bg2, border: `1px solid ${c.border}`, borderRadius: 20, padding: '4px 12px' }}>
                  {slide + 1} / {files.length}
                </div>
              )}
            </div>

            {/* Comment panel */}
            {!isConfirmed && (
              <div style={{ padding: '16px 24px', borderTop: `1px solid ${c.border}`, flexShrink: 0, background: c.bg1 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                  <TextArea placeholder="提交整體修改意見（針對所有頁面）..." value={comment} onChange={e => setComment(e.target.value)} rows={2} style={{ flex: 1 }} />
                  <Btn variant="primary" icon="send" disabled={!comment.trim() || loading || revisionsLeft === 0} onClick={handleSubmitComment}>提交意見</Btn>
                </div>
                {revisionsLeft === 0 && <p style={{ fontSize: 11, color: c.warning, marginTop: 8 }}>⚠ 已用盡免費修改次數，額外修改需另行報價</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientPortalShell>
  )
}
