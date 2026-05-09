'use client'
import React, { CSSProperties, ReactNode, useState } from 'react'
import { DARK, ACCENT } from './theme'

const c = DARK
const accent = ACCENT

// ─── Icon paths ──────────────────────────────────────────────────────────────
const ICONS: Record<string, string[]> = {
  home: ['M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z', 'M9 22V12h6v10'],
  user: ['M12 12a4 4 0 100-8 4 4 0 000 8z', 'M4 20v-1a8 8 0 0116 0v1'],
  folder: ['M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z'],
  file: ['M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z', 'M14 2v6h6', 'M16 13H8', 'M16 17H8', 'M10 9H8'],
  check: ['M20 6L9 17l-5-5'],
  checkCircle: ['M22 11.08V12a10 10 0 11-5.93-9.14', 'M22 4L12 14.01l-3-3'],
  clock: ['M12 22a10 10 0 100-20 10 10 0 000 20z', 'M12 6v6l4 2'],
  dollar: ['M12 1v22', 'M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6'],
  alert: ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', 'M12 9v4', 'M12 17h.01'],
  upload: ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M17 8l-5-5-5 5', 'M12 3v12'],
  download: ['M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4', 'M7 10l5 5 5-5', 'M12 15V3'],
  plus: ['M12 5v14', 'M5 12h14'],
  x: ['M18 6L6 18', 'M6 6l12 12'],
  arrowRight: ['M5 12h14', 'M12 5l7 7-7 7'],
  eye: ['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z', 'M12 9a3 3 0 100 6 3 3 0 000-6z'],
  edit: ['M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7', 'M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z'],
  code: ['M16 18l6-6-6-6', 'M8 6l-6 6 6 6'],
  bug: ['M12 2a7 7 0 017 7v5a7 7 0 01-14 0V9a7 7 0 017-7z', 'M9 2L7 0', 'M15 2l2-2', 'M5 9H2', 'M22 9h-3', 'M5 16H2', 'M22 16h-3'],
  package: ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  settings: ['M12 15a3 3 0 100-6 3 3 0 000 6z', 'M12 2v2', 'M12 20v2', 'M4.93 4.93l1.41 1.41', 'M17.66 17.66l1.41 1.41', 'M2 12h2', 'M20 12h2', 'M4.93 19.07l1.41-1.41', 'M17.66 6.34l1.41-1.41'],
  chevRight: ['M9 18l6-6-6-6'],
  chevLeft: ['M15 18l-6-6 6-6'],
  chevDown: ['M6 9l6 6 6-6'],
  link: ['M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71', 'M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71'],
  mail: ['M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z', 'M22 6l-10 7L2 6'],
  creditCard: ['M21 4H3a2 2 0 00-2 2v12a2 2 0 002 2h18a2 2 0 002-2V6a2 2 0 00-2-2z', 'M1 10h22'],
  image: ['M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2z', 'M8.5 10a1.5 1.5 0 100-3 1.5 1.5 0 000 3z', 'M21 15l-5-5L5 21'],
  zap: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'],
  list: ['M8 6h13', 'M8 12h13', 'M8 18h13', 'M3 6h.01', 'M3 12h.01', 'M3 18h.01'],
  externalLink: ['M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6', 'M15 3h6v6', 'M10 14L21 3'],
  send: ['M22 2L11 13', 'M22 2L15 22 11 13 2 9l20-7z'],
  lock: ['M19 11H5a2 2 0 00-2 2v7a2 2 0 002 2h14a2 2 0 002-2v-7a2 2 0 00-2-2z', 'M7 11V7a5 5 0 0110 0v4'],
  refresh: ['M23 4v6h-6', 'M1 20v-6h6', 'M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15'],
  filter: ['M22 3H2l8 9.46V19l4 2v-8.54L22 3'],
  tag: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01'],
  logout: ['M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4', 'M16 17l5-5-5-5', 'M21 12H9'],
  save: ['M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z', 'M17 21v-8H7v8', 'M7 3v5h8'],
  alertTriangle: ['M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z', 'M12 9v4', 'M12 17h.01'],
  layers: ['M12 2L2 7l10 5 10-5-10-5z', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'],
  bell: ['M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 01-3.46 0'],
}

export function Icon({ name, size = 16, color, style }: {
  name: string; size?: number; color?: string; style?: CSSProperties
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color || c.t1} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      style={{ flexShrink: 0, ...style }}>
      {(ICONS[name] || []).map((d, i) => <path key={i} d={d} />)}
    </svg>
  )
}

// ─── Badge ───────────────────────────────────────────────────────────────────
export function Badge({ children, color = accent, bg, size = 'sm', style }: {
  children: ReactNode; color?: string; bg?: string; size?: 'sm' | 'md'; style?: CSSProperties
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: size === 'md' ? '4px 10px' : '2px 8px',
      borderRadius: 20, fontSize: size === 'md' ? 12 : 10,
      fontWeight: 600, color,
      background: bg || color + '18',
      border: `1px solid ${color}33`,
      whiteSpace: 'nowrap', ...style,
    }}>{children}</span>
  )
}

// ─── Label ───────────────────────────────────────────────────────────────────
export function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, color: c.t2,
      letterSpacing: '0.08em', textTransform: 'uppercase', ...style,
    }}>{children}</span>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────
export function Card({ children, style, accentLeft }: {
  children: ReactNode; style?: CSSProperties; accentLeft?: string
}) {
  return (
    <div style={{
      background: c.bg2, border: `1px solid ${c.border}`,
      borderRadius: 12, padding: '20px 24px',
      borderLeft: accentLeft ? `3px solid ${accentLeft}` : undefined,
      ...style,
    }}>{children}</div>
  )
}

// ─── Button ──────────────────────────────────────────────────────────────────
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger' | 'accent'

export function Btn({ children, variant = 'primary', onClick, disabled, size = 'md', icon, full, style, type = 'button', href }: {
  children?: ReactNode; variant?: BtnVariant; onClick?: () => void; disabled?: boolean
  size?: 'sm' | 'md' | 'lg'; icon?: string; full?: boolean; style?: CSSProperties
  type?: 'button' | 'submit'; href?: string
}) {
  const [hov, setHov] = useState(false)
  const BG: Record<BtnVariant, string> = {
    primary: accent, secondary: c.bg3, ghost: 'transparent',
    success: DARK.success, danger: DARK.danger, accent,
  }
  const TC: Record<BtnVariant, string> = {
    primary: '#fff', secondary: c.t0, ghost: c.t1,
    success: '#fff', danger: '#fff', accent: '#fff',
  }
  const PAD = { sm: '5px 12px', md: '8px 16px', lg: '11px 20px' }
  const FS = { sm: 11, md: 13, lg: 14 }

  const s: CSSProperties = {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    padding: PAD[size], borderRadius: 8, border: variant === 'ghost' ? `1px solid ${c.border}` : 'none',
    background: disabled ? c.bg3 : hov ? BG[variant] + 'DD' : BG[variant],
    color: disabled ? c.t2 : TC[variant],
    fontSize: FS[size], fontWeight: 500, cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: 'inherit', transition: 'all 0.13s', opacity: disabled ? 0.5 : 1,
    width: full ? '100%' : undefined,
    justifyContent: full ? 'center' : undefined,
    ...style,
  }

  const content = (
    <>
      {icon && <Icon name={icon} size={FS[size] + 1} color={disabled ? c.t2 : TC[variant]} />}
      {children}
    </>
  )

  if (href) return <a href={href} style={s} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>{content}</a>
  return (
    <button type={type} onClick={disabled ? undefined : onClick} disabled={disabled} style={s}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {content}
    </button>
  )
}

// ─── TextInput ───────────────────────────────────────────────────────────────
export function TextInput({ label, placeholder, value, onChange, type = 'text', prefix, style }: {
  label?: string; placeholder?: string; value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string; prefix?: string; style?: CSSProperties
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <Label>{label}</Label>}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {prefix && <span style={{ position: 'absolute', left: 10, fontSize: 13 }}>{prefix}</span>}
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={onChange}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{
            width: '100%', background: c.bg3, border: `1.5px solid ${focus ? accent : c.border}`,
            borderRadius: 8, padding: `9px ${prefix ? '12px 9px 28px' : '12px'}`,
            color: c.t0, fontFamily: 'inherit', fontSize: 13, outline: 'none',
            transition: 'border-color 0.15s',
          }}
        />
      </div>
    </div>
  )
}

// ─── TextArea ────────────────────────────────────────────────────────────────
export function TextArea({ label, placeholder, value, onChange, rows = 4, style }: {
  label?: string; placeholder?: string; value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  rows?: number; style?: CSSProperties
}) {
  const [focus, setFocus] = useState(false)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <Label>{label}</Label>}
      <textarea
        value={value} placeholder={placeholder} rows={rows} onChange={onChange}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          width: '100%', background: c.bg3, border: `1.5px solid ${focus ? accent : c.border}`,
          borderRadius: 8, padding: '9px 12px', color: c.t0,
          fontFamily: 'inherit', fontSize: 13, outline: 'none', resize: 'vertical',
          transition: 'border-color 0.15s',
        }}
      />
    </div>
  )
}

// ─── Select ──────────────────────────────────────────────────────────────────
export function PortalSelect({ label, value, onChange, options, style }: {
  label?: string; value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  options: string[] | { value: string; label: string }[]
  style?: CSSProperties
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, ...style }}>
      {label && <Label>{label}</Label>}
      <select value={value} onChange={onChange} style={{
        background: c.bg3, border: `1.5px solid ${c.border}`,
        borderRadius: 8, padding: '9px 12px', color: c.t0,
        fontFamily: 'inherit', fontSize: 13, outline: 'none', cursor: 'pointer',
      }}>
        {options.map(opt => {
          const v = typeof opt === 'string' ? opt : opt.value
          const l = typeof opt === 'string' ? opt : opt.label
          return <option key={v} value={v}>{l}</option>
        })}
      </select>
    </div>
  )
}

// ─── StageBar ────────────────────────────────────────────────────────────────
const STAGE_COLORS_ARR = ['#7A9AB8', '#9B59B6', '#2D7DD2', '#F5A623', '#27C882']
const STAGE_LABELS_ARR = ['Requirement', 'Design', 'Development', 'UAT', 'Delivery']

export function StageBar({ current, stage, style: outerStyle }: { current?: number; stage?: number; style?: CSSProperties }) {
  const active = stage ?? current ?? 0
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, ...outerStyle }}>
      {STAGE_LABELS_ARR.map((label, i) => {
        const col = STAGE_COLORS_ARR[i]
        const done = active > i
        const isActive = active === i
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <div style={{ flex: 1, height: 2, background: done ? col : c.border, transition: 'background 0.3s' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: done || isActive ? col + '22' : c.bg3,
                border: `2px solid ${done || isActive ? col : c.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700,
                color: done || isActive ? col : c.t2, transition: 'all 0.2s',
              }}>
                {done ? '✓' : i}
              </div>
              <span style={{
                fontSize: 9, color: isActive ? col : done ? c.t1 : c.t2,
                fontWeight: isActive ? 700 : 400, whiteSpace: 'nowrap',
                letterSpacing: '0.04em',
              }}>{label}</span>
            </div>
          </React.Fragment>
        )
      })}
    </div>
  )
}

// ─── PageShell ───────────────────────────────────────────────────────────────
export function PageShell({ children, title, subtitle, maxWidth = 900, actions }: {
  children: ReactNode; title?: string; subtitle?: string
  maxWidth?: number; actions?: ReactNode
}) {
  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
      <div style={{ maxWidth, margin: '0 auto' }}>
        {(title || actions) && (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              {title && <h1 style={{ fontSize: 20, fontWeight: 700, color: c.t0, margin: 0, letterSpacing: '-0.01em' }}>{title}</h1>}
              {subtitle && <p style={{ fontSize: 13, color: c.t1, margin: '6px 0 0', lineHeight: 1.5 }}>{subtitle}</p>}
            </div>
            {actions && <div style={{ flexShrink: 0, marginTop: 2 }}>{actions}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
