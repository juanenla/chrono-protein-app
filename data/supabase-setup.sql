-- ═══════════════════════════════════════════════════════════════
-- CHRONOPROTEIN — Supabase Database Setup
-- Run this in Supabase Dashboard → SQL Editor → New Query
-- ═══════════════════════════════════════════════════════════════

-- ── 1. Profiles table ──
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  weight_kg   NUMERIC,
  age         INTEGER,
  sex         TEXT,
  body_fat    NUMERIC,
  chronotype  TEXT,
  goal        TEXT,
  activity    TEXT,
  diet        TEXT,
  training_time TEXT,
  training_days INTEGER
);

-- ── 2. Plans table (stores full calculator output) ──
CREATE TABLE IF NOT EXISTS plans (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT now(),
  plan_json   JSONB
);

-- ── 3. Admin roles table ──
CREATE TABLE IF NOT EXISTS admin_roles (
  user_id     UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role        TEXT DEFAULT 'admin',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;

-- ── Profiles: users can read/write their own row ──
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ── Profiles: admins can view ALL profiles ──
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'admin'
    )
  );

-- ── Plans: users can read/write their own plans ──
CREATE POLICY "Users can view own plans"
  ON plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own plans"
  ON plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ── Admin roles: only admins can read admin_roles ──
CREATE POLICY "Users can check own admin status"
  ON admin_roles FOR SELECT
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════════
-- SEED: Add the initial admin user
-- Run this AFTER the admin has signed up with chronotherapyapp@gmail.com
-- Replace the UUID below with the actual user ID from auth.users
-- ═══════════════════════════════════════════════════════════════

-- To find the user ID after signup, run:
-- SELECT id, email FROM auth.users WHERE email = 'chronotherapyapp@gmail.com';

-- Then insert the admin role:
-- INSERT INTO admin_roles (user_id, role)
-- VALUES ('PASTE-UUID-HERE', 'admin');

-- ═══════════════════════════════════════════════════════════════
-- FEEDBACK TABLE
-- Stores user feedback submitted via the in-app widget
-- ═══════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS feedback (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at  TIMESTAMPTZ DEFAULT now(),
  page        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('bug', 'improvement', 'positive')),
  message     TEXT NOT NULL,
  user_name   TEXT,
  user_email  TEXT
);

-- RLS: allow anyone (including anonymous/unauthenticated) to INSERT feedback
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

-- Only admins can read feedback
CREATE POLICY "Admins can read all feedback"
  ON feedback FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM admin_roles
      WHERE admin_roles.user_id = auth.uid()
      AND admin_roles.role = 'admin'
    )
  );
