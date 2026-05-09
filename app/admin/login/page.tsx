'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DARK, ACCENT } from '@/components/portal/theme'

const c = DARK

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setError('帳號或密碼錯誤')
      setLoading(false)
      return
    }
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    if (profile?.role !== 'admin') {
      await supabase.auth.signOut()
      setError('此帳號無管理員權限')
      setLoading(false)
      return
    }
    router.push('/admin/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', background: c.bg1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', 'Noto Sans TC', sans-serif" }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '0 24px' }}>
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: c.t0, marginBottom: 6 }}>
            <span style={{ color: ACCENT }}>416</span> AI Studio
          </div>
          <div style={{ fontSize: 13, color: c.t2 }}>管理員後台</div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: c.t2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>電子郵件</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                background: c.bg2, border: `1px solid ${c.border}`,
                color: c.t0, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: c.t2, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>密碼</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8,
                background: c.bg2, border: `1px solid ${c.border}`,
                color: c.t0, fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{ padding: '10px 14px', borderRadius: 8, background: '#ef444418', border: '1px solid #ef444440', fontSize: 12, color: '#ef4444' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px', borderRadius: 8, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? c.bg3 : ACCENT, color: loading ? c.t2 : '#fff',
              fontSize: 14, fontWeight: 600, fontFamily: 'inherit', transition: 'opacity 0.15s',
            }}
          >
            {loading ? '登入中…' : '登入後台'}
          </button>
        </form>
      </div>
    </div>
  )
}
