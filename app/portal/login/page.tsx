'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { DARK, ACCENT } from '@/components/portal/theme'
import { Icon, Btn, TextInput } from '@/components/portal/ui'
import Link from 'next/link'

const c = DARK

export default function ClientLoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!email.trim()) { setError('請輸入電郵地址'); return }
    setLoading(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/portal/dashboard`,
      },
    })
    if (err) { setError(err.message) } else { setSent(true) }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', background: c.bg1, display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, "Noto Sans TC", sans-serif',
    }}>
      <div className="pf" style={{ width: 380, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* Logo */}
        <div style={{
          width: 52, height: 52, borderRadius: 14, background: ACCENT,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 800, color: '#fff', letterSpacing: '0.02em', marginBottom: 24,
        }}>AI</div>
        <div style={{ fontSize: 13, fontWeight: 700, color: c.t1, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>AI Software Studio</div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: c.t0, marginBottom: 8, letterSpacing: '-0.02em' }}>客戶登入</h1>
        <p style={{ fontSize: 13, color: c.t1, marginBottom: 32, textAlign: 'center', lineHeight: 1.6 }}>輸入電郵，系統將發送一次性登入連結</p>

        {!sent ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <TextInput
              label="電郵地址 Email"
              placeholder="yourname@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              type="email"
            />
            {error && <p style={{ fontSize: 12, color: c.danger, textAlign: 'center' }}>{error}</p>}
            <Btn variant="primary" full onClick={handleSend} size="lg" icon="send" disabled={loading}>
              {loading ? '發送中...' : 'Send Magic Link'}
            </Btn>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
              <div style={{ flex: 1, height: 1, background: c.border }} />
              <span style={{ fontSize: 11, color: c.t2 }}>無需密碼</span>
              <div style={{ flex: 1, height: 1, background: c.border }} />
            </div>
            <p style={{ fontSize: 11, color: c.t2, textAlign: 'center', lineHeight: 1.6 }}>登入連結有效期為 15 分鐘，請檢查你的收件箱</p>
          </div>
        ) : (
          <div className="pf" style={{
            width: '100%', textAlign: 'center', padding: '28px 24px',
            background: ACCENT + '15', border: `1px solid ${ACCENT}33`, borderRadius: 12,
          }}>
            <Icon name="mail" size={28} color={ACCENT} style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, color: c.t0, marginBottom: 8 }}>連結已發送！</div>
            <div style={{ fontSize: 12, color: c.t1, lineHeight: 1.6 }}>
              請查閱 <strong style={{ color: c.t0 }}>{email}</strong> 的收件箱，<br />點擊登入連結即可進入 Client Portal
            </div>
            <button onClick={() => setSent(false)} style={{
              marginTop: 16, fontSize: 12, color: c.t2, background: 'none',
              border: 'none', cursor: 'pointer', textDecoration: 'underline',
            }}>重新發送</button>
          </div>
        )}

        <Link href="/admin/login" style={{
          marginTop: 32, fontSize: 11, color: c.t2,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <Icon name="lock" size={11} color={c.t2} />
          Admin 入口 →
        </Link>
      </div>
    </div>
  )
}
