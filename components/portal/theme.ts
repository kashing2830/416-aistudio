export const DARK = {
  bg0: '#0D1B2A', bg1: '#0F2136', bg2: '#122540', bg3: '#1A3254',
  border: 'rgba(255,255,255,0.07)', borderStrong: 'rgba(255,255,255,0.14)',
  t0: '#E2ECF7', t1: '#7A9AB8', t2: '#4A6A88',
  success: '#27C882', warning: '#F5A623', danger: '#E05B5B',
}

export const ACCENT = '#2D7DD2'

export const STAGE_LABELS: Record<number, string> = {
  0: 'Requirement',
  1: 'Design',
  2: 'Development',
  3: 'UAT',
  4: 'Delivery',
  5: 'Completed',
}
export const STAGE_COLORS: Record<number, string> = {
  0: '#7A9AB8',
  1: '#9B59B6',
  2: '#2D7DD2',
  3: '#F5A623',
  4: '#27C882',
  5: '#27C882',
}

export const SEV_COLORS: Record<string, string> = {
  Critical: '#E05B5B',
  Major: '#F5A623',
  Minor: '#7A9AB8',
}
export const STATUS_COLORS: Record<string, string> = {
  fixed: '#27C882',
  in_progress: '#2D7DD2',
  open: '#7A9AB8',
}
export const STATUS_LABELS: Record<string, string> = {
  fixed: '已修復',
  in_progress: '修復中',
  open: '待處理',
}

export const fmt = (n: number) => 'HKD ' + Number(n).toLocaleString()
