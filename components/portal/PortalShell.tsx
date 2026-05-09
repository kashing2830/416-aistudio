'use client'
import React, { ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { DARK, ACCENT, STAGE_LABELS, STAGE_COLORS } from './theme'
import { Icon } from './ui'
import { createClient } from '@/lib/supabase/client'
import type { Project } from '@/lib/supabase/types'

const c = DARK

interface NavItem {
  href: string; icon: string; label: string; stage?: number
}

const CLIENT_NAV: NavItem[] = [
  { href: '/portal/dashboard', icon: 'home', label: 'Dashboard' },
  { href: '/portal/requirements', icon: 'file', label: '需求表格', stage: 0 },
  { href: '/portal/scope', icon: 'checkCircle', label: 'Scope 確認', stage: 0 },
  { href: '/portal/quote', icon: 'dollar', label: '報價單', stage: 0 },
  { href: '/portal/design', icon: 'image', label: '設計審閱', stage: 1 },
  { href: '/portal/progress', icon: 'code', label: '開發進度', stage: 2 },
  { href: '/portal/uat', icon: 'bug', label: 'UAT 測試', stage: 3 },
  { href: '/portal/delivery', icon: 'package', label: '驗收交付', stage: 4 },
]

const ADMIN_NAV: NavItem[] = [
  { href: '/admin/dashboard', icon: 'home', label: 'Dashboard' },
  { href: '/admin/projects', icon: 'folder', label: '所有項目' },
  { href: '/admin/payments', icon: 'dollar', label: '付款記錄' },
  { href: '/admin/settings', icon: 'settings', label: '設定' },
]

function NavLink({ item, currentPath }: { item: NavItem; currentPath: string }) {
  const active = currentPath.startsWith(item.href)
  return (
    <Link href={item.href} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '8px 12px', borderRadius: 8, fontSize: 13,
      color: active ? '#fff' : c.t1, fontWeight: active ? 600 : 400,
      background: active ? ACCENT + '22' : 'transparent',
      borderLeft: active ? `2px solid ${ACCENT}` : '2px solid transparent',
      transition: 'all 0.13s', textDecoration: 'none',
    }}>
      <Icon name={item.icon} size={14} color={active ? ACCENT : c.t2} />
      {item.label}
    </Link>
  )
}

export function ClientPortalShell({ children, project, userEmail }: {
  children: ReactNode; project?: Project | null; userEmail?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/portal/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: c.bg0, fontFamily: 'Inter, "Noto Sans TC", sans-serif', color: c.t0 }}>
      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0, background: c.bg1,
        borderRight: `1px solid ${c.border}`,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, background: ACCENT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 800, color: '#fff',
            }}>AI</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.t0 }}>AI Software Studio</div>
              <div style={{ fontSize: 10, color: c.t2 }}>Client Portal</div>
            </div>
          </div>
        </div>

        {/* Project info */}
        {project && (
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${c.border}` }}>
            <div style={{ fontSize: 10, color: c.t2, marginBottom: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>當前項目</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: c.t0, marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{project.name}</div>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 20,
              color: STAGE_COLORS[project.stage], background: STAGE_COLORS[project.stage] + '18',
            }}>Stage {project.stage} · {STAGE_LABELS[project.stage]}</span>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {CLIENT_NAV.map(item => <NavLink key={item.href} item={item} currentPath={pathname} />)}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: `1px solid ${c.border}` }}>
          {userEmail && <div style={{ fontSize: 11, color: c.t2, marginBottom: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userEmail}</div>}
          <button onClick={handleSignOut} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '7px 10px', borderRadius: 7, border: `1px solid ${c.border}`,
            background: 'transparent', color: c.t2, fontSize: 12, cursor: 'pointer',
            fontFamily: 'inherit', transition: 'all 0.13s',
          }}>
            <Icon name="logout" size={12} color={c.t2} /> 登出
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

export function AdminPortalShell({ children, userEmail }: {
  children: ReactNode; userEmail?: string
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', background: c.bg0, fontFamily: 'Inter, "Noto Sans TC", sans-serif', color: c.t0 }}>
      {/* Sidebar */}
      <div style={{
        width: 220, flexShrink: 0, background: c.bg1,
        borderRight: `1px solid ${c.border}`,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ padding: '20px 16px 16px', borderBottom: `1px solid ${c.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, background: c.bg3,
              border: `1px solid ${c.borderStrong}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="lock" size={14} color={c.t1} />
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.t0 }}>AI Software Studio</div>
              <div style={{ fontSize: 10, color: '#E05B5B' }}>Admin Portal</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {ADMIN_NAV.map(item => <NavLink key={item.href} item={item} currentPath={pathname} />)}
        </nav>

        <div style={{ padding: '12px 16px', borderTop: `1px solid ${c.border}` }}>
          {userEmail && <div style={{ fontSize: 11, color: c.t2, marginBottom: 8 }}>{userEmail}</div>}
          <button onClick={handleSignOut} style={{
            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
            padding: '7px 10px', borderRadius: 7, border: `1px solid ${c.border}`,
            background: 'transparent', color: c.t2, fontSize: 12, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            <Icon name="logout" size={12} color={c.t2} /> 登出
          </button>
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}
