create extension if not exists "pgcrypto";

create table if not exists public.tasks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  project text default '',
  category text default '其他',
  quadrant text check (quadrant in ('Q1','Q2','Q3','Q4')) default 'Q2',
  priority text check (priority in ('P0','P1','P2','P3')) default 'P2',
  importance text check (importance in ('高','中','低')) default '中',
  urgency text check (urgency in ('高','中','低')) default '中',
  estimated_time integer default 30,
  plan_date date,
  due_time text default '',
  status text check (status in ('未开始','进行中','已完成','延期','放弃')) default '未开始',
  delay_count integer default 0,
  auto_rollover boolean default true,
  is_stuck boolean default false,
  output_link text default '',
  note text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  completed_at timestamptz
);

create table if not exists public.inbox_items (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  source text default '手动输入',
  is_processed boolean default false,
  note text default '',
  attachment_url text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.weekly_tasks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  project text default '',
  goal text default '',
  priority text check (priority in ('P0','P1','P2','P3')) default 'P2',
  progress integer default 0 check (progress >= 0 and progress <= 100),
  status text check (status in ('未开始','进行中','已完成','延期','放弃')) default '未开始',
  start_date date,
  end_date date,
  related_task_ids text[] default '{}',
  note text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.recurring_tasks (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  frequency text check (frequency in ('每天','每周','每月')) default '每天',
  default_time text default '',
  priority text check (priority in ('P0','P1','P2','P3')) default 'P2',
  category text default '其他',
  enabled boolean default true,
  note text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.output_logs (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  task_id text,
  completed_date date,
  title text not null,
  project text default '',
  category text default '其他',
  output_link text default '',
  reusable boolean default false,
  sop_candidate boolean default false,
  value_level text check (value_level in ('高','中','低')) default '中',
  note text default '',
  created_at timestamptz default now()
);

create table if not exists public.daily_reviews (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  completed_summary text default '',
  unfinished_summary text default '',
  reason text default '',
  rollover_tasks text default '',
  outputs text default '',
  score integer default 7 check (score >= 1 and score <= 10),
  tomorrow_top3 text default '',
  note text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, date)
);

create table if not exists public.user_settings (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  reminder_time text default '17:00',
  theme text default 'light',
  notification_enabled boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id)
);

alter table public.tasks enable row level security;
alter table public.inbox_items enable row level security;
alter table public.weekly_tasks enable row level security;
alter table public.recurring_tasks enable row level security;
alter table public.output_logs enable row level security;
alter table public.daily_reviews enable row level security;
alter table public.user_settings enable row level security;

create policy "Users manage own tasks" on public.tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own inbox" on public.inbox_items for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own weekly tasks" on public.weekly_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own recurring tasks" on public.recurring_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own output logs" on public.output_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own reviews" on public.daily_reviews for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own settings" on public.user_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists tasks_user_plan_idx on public.tasks (user_id, plan_date);
create index if not exists inbox_user_processed_idx on public.inbox_items (user_id, is_processed);
create index if not exists output_user_date_idx on public.output_logs (user_id, completed_date);
create index if not exists review_user_date_idx on public.daily_reviews (user_id, date);
