export type UserRole = 'client' | 'admin'
export type ProjectType = '網站' | 'Web App' | 'Mobile App' | '企業系統'
export type ProjectStage = 0 | 1 | 2 | 3 | 4 | 5
export type PaymentMethod = 'stripe' | 'fps'
export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded' | 'rejected'
export type MilestoneStatus = 'pending' | 'active' | 'done'
export type BugSeverity = 'Critical' | 'Major' | 'Minor'
export type BugStatus = 'open' | 'in_progress' | 'fixed'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface Project {
  id: string
  client_id: string
  name: string
  type: ProjectType | string
  stage: number
  total_amount: number | null
  estimated_completion: string | null
  created_at: string
  updated_at: string
  profiles?: Profile | null
}

export interface Requirement {
  id: string
  project_id: string
  project_type: string
  description: string | null
  budget: number | null
  deadline: string | null
  reference_urls: string | null
  notes: string | null
  attachment_urls: string[]
  submitted_at: string
}

export interface ScopeDocument {
  id: string
  project_id: string
  file_url: string
  version: number
  client_confirmed_at: string | null
  revision_note: string | null
  created_at: string
}

export interface Quote {
  id: string
  project_id: string
  total_amount: number
  lock_fee: number | null
  features: string[]
  notes: string | null
  estimated_weeks: string | null
  accepted_at: string | null
  created_at: string
}

export interface PaymentBreakdownItem {
  stage: number
  label: string
  amount: number
  pct: string | null
}

export interface Payment {
  id: string
  project_id: string
  amount: number
  type: string
  method: PaymentMethod
  stripe_payment_intent_id: string | null
  status: PaymentStatus
  confirmed_at: string | null
  created_at: string
  projects?: { name: string; client_id: string; profiles?: { email: string } | null } | null
}

export interface Design {
  id: string
  project_id: string
  version: number
  file_urls: string[]
  revision_count: number
  client_comment: string | null
  client_confirmed_at: string | null
  created_at: string
}

export interface Milestone {
  id: string
  project_id: string
  title: string
  order: number
  status: MilestoneStatus
  note: string | null
  screenshot_url: string | null
  completed_at: string | null
  created_at: string
}

export interface Bug {
  id: string
  project_id: string
  title: string
  description: string | null
  severity: BugSeverity
  status: BugStatus
  screenshot_url: string | null
  reported_by: string | null
  created_at: string
}

export interface BugReply {
  id: string
  bug_id: string
  author_id: string
  author_role: UserRole
  message: string
  created_at: string
  profiles?: Profile
}

export interface Delivery {
  id: string
  project_id: string
  file_urls: string[]
  notes: string | null
  staging_url: string | null
  credentials: string | null
  delivered_at: string | null
  client_accepted_at: string | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string | null
  project_id: string | null
  type: string
  message: string
  read: boolean
  created_at: string
}
