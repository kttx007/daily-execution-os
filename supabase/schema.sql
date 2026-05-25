-- Tasks Table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    project TEXT,
    category TEXT,
    quadrant TEXT CHECK (quadrant IN ('Q1', 'Q2', 'Q3', 'Q4')),
    priority TEXT CHECK (priority IN ('P0', 'P1', 'P2', 'P3')),
    importance TEXT CHECK (importance IN ('高', '中', '低')),
    urgency TEXT CHECK (urgency IN ('高', '中', '低')),
    estimated_time INTEGER,
    plan_date DATE DEFAULT CURRENT_DATE,
    due_time TIME,
    status TEXT DEFAULT '未开始' CHECK (status IN ('未开始', '进行中', '已完成', '延期', '放弃')),
    delay_count INTEGER DEFAULT 0,
    auto_rollover BOOLEAN DEFAULT TRUE,
    is_stuck BOOLEAN DEFAULT FALSE,
    output_link TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Inbox Items Table
CREATE TABLE inbox_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    source TEXT DEFAULT '手动输入',
    is_processed BOOLEAN DEFAULT FALSE,
    note TEXT,
    attachment_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Weekly Tasks Table
CREATE TABLE weekly_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    project TEXT,
    goal TEXT,
    priority TEXT,
    progress INTEGER DEFAULT 0,
    status TEXT DEFAULT '进行中',
    start_date DATE,
    end_date DATE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recurring Tasks Table
CREATE TABLE recurring_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    title TEXT NOT NULL,
    frequency TEXT CHECK (frequency IN ('每天', '每周', '每月')),
    default_time TIME,
    priority TEXT,
    category TEXT,
    enabled BOOLEAN DEFAULT TRUE,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Output Logs Table
CREATE TABLE output_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    task_id UUID REFERENCES tasks,
    completed_date DATE DEFAULT CURRENT_DATE,
    title TEXT NOT NULL,
    project TEXT,
    category TEXT,
    output_link TEXT,
    reusable BOOLEAN DEFAULT FALSE,
    sop_candidate BOOLEAN DEFAULT FALSE,
    value_level TEXT CHECK (value_level IN ('高', '中', '低')),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Reviews Table
CREATE TABLE daily_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    completed_summary TEXT,
    unfinished_summary TEXT,
    reason TEXT,
    rollover_tasks TEXT,
    outputs TEXT,
    score INTEGER CHECK (score >= 1 AND score <= 10),
    tomorrow_top3 TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Settings Table
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users UNIQUE NOT NULL,
    reminder_time TIME DEFAULT '17:00',
    theme TEXT DEFAULT 'light',
    notification_enabled BOOLEAN DEFAULT TRUE,
    feishu_webhook_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE inbox_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own inbox" ON inbox_items FOR ALL USING (auth.uid() = user_id);

ALTER TABLE weekly_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own weekly tasks" ON weekly_tasks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE recurring_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own recurring tasks" ON recurring_tasks FOR ALL USING (auth.uid() = user_id);

ALTER TABLE output_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own output logs" ON output_logs FOR ALL USING (auth.uid() = user_id);

ALTER TABLE daily_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own daily reviews" ON daily_reviews FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can only access their own settings" ON user_settings FOR ALL USING (auth.uid() = user_id);
