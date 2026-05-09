-- 416 AI Studio — Client Portal Schema
-- Run this in Supabase SQL Editor

create extension if not exists "uuid-ossp";

-- ─── profiles ───────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  full_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz default now() not null
);
alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Admin can view all profiles" on public.profiles for select using (
  exists (select 1 from public.profiles p2 where p2.id = auth.uid() and p2.role = 'admin')
);

-- ─── projects ───────────────────────────────────────────────────────────────
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text not null,
  stage integer not null default 0 check (stage between 0 and 5),
  total_amount integer,
  estimated_completion date,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
alter table public.projects enable row level security;
create policy "Client can view own projects" on public.projects for select using (client_id = auth.uid());
create policy "Client can insert own projects" on public.projects for insert with check (client_id = auth.uid());
create policy "Admin can manage all projects" on public.projects for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── requirements ───────────────────────────────────────────────────────────
create table public.requirements (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade unique not null,
  project_type text not null,
  description text,
  budget integer,
  deadline text,
  reference_urls text,
  notes text,
  attachment_urls jsonb default '[]',
  submitted_at timestamptz default now() not null
);
alter table public.requirements enable row level security;
create policy "Client can manage own requirements" on public.requirements for all using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Admin can view all requirements" on public.requirements for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── scope_documents ────────────────────────────────────────────────────────
create table public.scope_documents (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  file_url text not null,
  version integer not null default 1,
  client_confirmed_at timestamptz,
  revision_note text,
  created_at timestamptz default now() not null
);
alter table public.scope_documents enable row level security;
create policy "Client can view own scope docs" on public.scope_documents for select using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Client can update scope docs" on public.scope_documents for update using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Admin can manage all scope docs" on public.scope_documents for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── quotes ─────────────────────────────────────────────────────────────────
create table public.quotes (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade unique not null,
  total_amount integer not null,
  lock_fee integer default 800,
  features jsonb not null default '[]',
  notes text,
  estimated_weeks text,
  accepted_at timestamptz,
  created_at timestamptz default now() not null
);
alter table public.quotes enable row level security;
create policy "Client can view own quotes" on public.quotes for select using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Client can accept quotes" on public.quotes for update using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Admin can manage all quotes" on public.quotes for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── payments ───────────────────────────────────────────────────────────────
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  amount integer not null,
  type text not null,
  method text not null check (method in ('stripe', 'fps')),
  stripe_payment_intent_id text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'failed', 'refunded', 'rejected')),
  confirmed_at timestamptz,
  created_at timestamptz default now() not null
);
alter table public.payments enable row level security;
create policy "Client can view own payments" on public.payments for select using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Client can insert own payments" on public.payments for insert with check (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Admin can manage all payments" on public.payments for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── designs ────────────────────────────────────────────────────────────────
create table public.designs (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  version integer not null default 1,
  file_urls jsonb not null default '[]',
  revision_count integer not null default 0,
  client_comment text,
  client_confirmed_at timestamptz,
  created_at timestamptz default now() not null
);
alter table public.designs enable row level security;
create policy "Client can view own designs" on public.designs for select using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Client can comment on designs" on public.designs for update using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Admin can manage all designs" on public.designs for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── milestones ─────────────────────────────────────────────────────────────
create table public.milestones (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  "order" integer not null default 0,
  status text not null default 'pending' check (status in ('pending', 'active', 'done')),
  note text,
  screenshot_url text,
  completed_at timestamptz,
  created_at timestamptz default now() not null
);
alter table public.milestones enable row level security;
create policy "Client can view own milestones" on public.milestones for select using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Admin can manage all milestones" on public.milestones for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── bugs ───────────────────────────────────────────────────────────────────
create table public.bugs (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  severity text not null check (severity in ('Critical', 'Major', 'Minor')),
  status text not null default 'open' check (status in ('open', 'in_progress', 'fixed')),
  screenshot_url text,
  reported_by uuid references public.profiles(id),
  created_at timestamptz default now() not null
);
alter table public.bugs enable row level security;
create policy "Client can manage own bugs" on public.bugs for all using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Admin can manage all bugs" on public.bugs for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── bug_replies ────────────────────────────────────────────────────────────
create table public.bug_replies (
  id uuid default uuid_generate_v4() primary key,
  bug_id uuid references public.bugs(id) on delete cascade not null,
  author_id uuid references public.profiles(id) not null,
  author_role text not null check (author_role in ('client', 'admin')),
  message text not null,
  created_at timestamptz default now() not null
);
alter table public.bug_replies enable row level security;
create policy "Client can view replies on own bugs" on public.bug_replies for select using (
  exists (select 1 from public.bugs b join public.projects p on b.project_id = p.id where b.id = bug_id and p.client_id = auth.uid())
);
create policy "Users can create replies" on public.bug_replies for insert with check (auth.uid() = author_id);
create policy "Admin can manage all replies" on public.bug_replies for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── deliveries ─────────────────────────────────────────────────────────────
create table public.deliveries (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade unique not null,
  file_urls jsonb not null default '[]',
  notes text,
  staging_url text,
  credentials text,
  delivered_at timestamptz,
  client_accepted_at timestamptz,
  created_at timestamptz default now() not null
);
alter table public.deliveries enable row level security;
create policy "Client can view own delivery" on public.deliveries for select using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Client can update delivery" on public.deliveries for update using (
  exists (select 1 from public.projects where id = project_id and client_id = auth.uid())
);
create policy "Admin can manage all deliveries" on public.deliveries for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── notifications ──────────────────────────────────────────────────────────
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  project_id uuid references public.projects(id) on delete cascade,
  type text not null,
  message text not null,
  read boolean not null default false,
  created_at timestamptz default now() not null
);
alter table public.notifications enable row level security;
create policy "Users can view own notifications" on public.notifications for select using (user_id = auth.uid() or
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Authenticated can create notifications" on public.notifications for insert with check (auth.uid() is not null);
create policy "Users can mark own notifications read" on public.notifications for update using (user_id = auth.uid());
create policy "Admin can manage all notifications" on public.notifications for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
);

-- ─── trigger: update project updated_at ─────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger projects_updated_at before update on public.projects
  for each row execute function update_updated_at();

-- ─── trigger: auto-create profile on signup ─────────────────────────────────
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Storage buckets (create in Supabase dashboard) ─────────────────────────
-- scope-documents  (private)
-- design-files     (private)
-- delivery-files   (private)
-- bug-screenshots  (private)
