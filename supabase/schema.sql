-- ThreadCounty Supabase Schema

create extension if not exists "uuid-ossp";

-- PROFILES (extends auth.users)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'user' check (role in ('user','admin')),
  plan text default 'free' check (plan in ('free','student','professional','enterprise')),
  storage_used_mb numeric default 0,
  created_at timestamptz default now()
);

-- UPLOADS
create table uploads (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  file_url text not null,
  file_name text not null,
  file_size integer,
  status text default 'processing' check (status in ('processing','completed','failed')),
  created_at timestamptz default now()
);

-- REPORTS
create table reports (
  id uuid primary key default uuid_generate_v4(),
  upload_id uuid references uploads(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  thread_density numeric,
  warp_count integer,
  weft_count integer,
  fabric_type text,
  fiber_composition text,
  pattern text,
  color text,
  texture text,
  confidence numeric,
  quality_grade text,
  recommended_use text[],
  defects_detected text[],
  ai_suggestions text[],
  analysis_method text default 'gemini',
  created_at timestamptz default now()
);

-- SUBSCRIPTIONS
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  plan text not null,
  status text default 'active' check (status in ('active','cancelled','expired')),
  started_at timestamptz default now(),
  expires_at timestamptz
);

-- CONTACT MESSAGES
create table contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now()
);

-- NOTIFICATIONS
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  body text,
  read boolean default false,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage bucket for fabric images and avatars (run once)
insert into storage.buckets (id, name, public) values ('fabric-images','fabric-images', true)
on conflict do nothing;
insert into storage.buckets (id, name, public) values ('avatars','avatars', true)
on conflict do nothing;

-- RLS
alter table profiles enable row level security;
alter table uploads enable row level security;
alter table reports enable row level security;
alter table subscriptions enable row level security;
alter table contact_messages enable row level security;
alter table notifications enable row level security;


create policy "profiles_select_own" on profiles for select using (auth.uid() = id or exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));
create policy "profiles_update_own" on profiles for update using (auth.uid() = id);

create policy "uploads_select_own" on uploads for select using (auth.uid() = user_id or exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));
create policy "uploads_insert_own" on uploads for insert with check (auth.uid() = user_id);
create policy "uploads_delete_own" on uploads for delete using (auth.uid() = user_id or exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));

create policy "reports_select_own" on reports for select using (auth.uid() = user_id or exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));
create policy "reports_insert_own" on reports for insert with check (auth.uid() = user_id);
create policy "reports_delete_own" on reports for delete using (auth.uid() = user_id or exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));

create policy "subscriptions_select_own" on subscriptions for select using (auth.uid() = user_id or exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));

create policy "contact_insert_anyone" on contact_messages for insert with check (true);
create policy "contact_select_admin" on contact_messages for select using (exists(select 1 from profiles p where p.id=auth.uid() and p.role='admin'));

create policy "notifications_select_own" on notifications for select using (auth.uid() = user_id);
