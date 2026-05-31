-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  project TEXT,
  category TEXT NOT NULL,
  quadrant TEXT NOT NULL,
  priority TEXT NOT NULL,
  importance TEXT,
  urgency TEXT,
  estimated_time INTEGER,
  plan_date DATE NOT NULL,
  due_time TIME,
  status TEXT NOT NULL,
  delay_count INTEGER DEFAULT 0,
  auto_rollover BOOLEAN DEFAULT TRUE,
  is_stuck BOOLEAN DEFAULT FALSE,
  output_link TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Inbox Items table
CREATE TABLE IF NOT EXISTS inbox_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  source TEXT NOT NULL,
  is_processed BOOLEAN DEFAULT FALSE,
  note TEXT,
  attachment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weekly Tasks table
CREATE TABLE IF NOT EXISTS weekly_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  project TEXT,
  goal TEXT,
  priority TEXT,
  progress INTEGER DEFAULT 0,
  status TEXT NOT NULL,
  week_number INTEGER,
  year INTEGER,
  start_date DATE,
  end_date DATE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recurring Tasks table
CREATE TABLE IF NOT EXISTS recurring_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  frequency TEXT NOT NULL,
  default_time TIME,
  priority TEXT,
  category TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Output Logs table
CREATE TABLE IF NOT EXISTS output_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  task_id UUID REFERENCES tasks(id),
  completed_date DATE NOT NULL,
  title TEXT NOT NULL,
  project TEXT,
  category TEXT,
  output_link TEXT,
  reusable BOOLEAN DEFAULT FALSE,
  sop_candidate BOOLEAN DEFAULT FALSE,
  value_level TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily Reviews table
CREATE TABLE IF NOT EXISTS daily_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  summary TEXT,
  completed_summary TEXT,
  unfinished_summary TEXT,
  reason TEXT,
  rollover_tasks TEXT,
  outputs TEXT,
  score INTEGER,
  top_learnings TEXT[],
  tomorrow_top3 TEXT,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Settings table
CREATE TABLE IF NOT EXISTS user_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  reminder_time TIME,
  theme TEXT DEFAULT 'dark',
  notification_enabled BOOLEAN DEFAULT TRUE,
  feishu_webhook_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) - Basic Policy (User-based)
-- Enable RLS on all tables
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE inbox_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE output_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create simple policies for authenticated users
-- (Replace 'authenticated' with your preferred auth method or keep 'anon' for development)
CREATE POLICY "Users can only access their own tasks" ON tasks FOR ALL USING (auth.uid()::text = user_id);
CREATE POLICY "Users can only access their own inbox" ON inbox_items FOR ALL USING (auth.uid()::text = user_id);
-- ... repeat for other tables if using real auth
