-- ==============================================================================
-- 03_live_classes.sql
-- Tables: public.live_classes, public.live_class_reminders
-- ==============================================================================

-- 1. Live Classes Table
CREATE TABLE IF NOT EXISTS public.live_classes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  standard INT NOT NULL CHECK (standard >= 1 AND standard <= 10),
  teacher_name TEXT NOT NULL,
  teacher_avatar TEXT,
  teacher_title TEXT,
  status TEXT NOT NULL CHECK (status IN ('live', 'upcoming', 'completed')),
  scheduled_date TEXT NOT NULL,
  scheduled_time TEXT NOT NULL,
  duration TEXT DEFAULT '75 mins',
  thumbnail TEXT,
  attendees_count INT DEFAULT 0,
  has_recording BOOLEAN DEFAULT false,
  recording_duration TEXT,
  recording_url TEXT,
  meeting_link TEXT DEFAULT 'https://meet.google.com',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Student Live Class Reminders Table
CREATE TABLE IF NOT EXISTS public.live_class_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  live_class_id TEXT NOT NULL REFERENCES public.live_classes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, live_class_id)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_live_classes_status ON public.live_classes(status);
CREATE INDEX IF NOT EXISTS idx_live_classes_standard ON public.live_classes(standard);
CREATE INDEX IF NOT EXISTS idx_live_class_reminders_user ON public.live_class_reminders(user_id);

-- 4. Row Level Security Policies
ALTER TABLE public.live_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.live_class_reminders ENABLE ROW LEVEL SECURITY;

-- Live Classes: Readable by everyone
DROP POLICY IF EXISTS "Public can view live classes" ON public.live_classes;
CREATE POLICY "Public can view live classes" ON public.live_classes
  FOR SELECT TO authenticated, anon USING (true);

-- Live Reminders: User-specific access
DROP POLICY IF EXISTS "Users can view own class reminders" ON public.live_class_reminders;
CREATE POLICY "Users can view own class reminders" ON public.live_class_reminders
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can set class reminders" ON public.live_class_reminders;
CREATE POLICY "Users can set class reminders" ON public.live_class_reminders
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own class reminders" ON public.live_class_reminders;
CREATE POLICY "Users can delete own class reminders" ON public.live_class_reminders
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

