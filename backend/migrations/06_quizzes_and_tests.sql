-- ==============================================================================
-- 06_quizzes_and_tests.sql
-- Tables: public.tests, public.test_questions, public.test_attempts
-- Description: Stores practice mock tests, chapter quizzes, and student attempts.
-- ==============================================================================

-- 1. Tests & Quizzes Catalog
CREATE TABLE IF NOT EXISTS public.tests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  standard INT NOT NULL CHECK (standard >= 1 AND standard <= 10),
  chapter TEXT,
  duration_minutes INT DEFAULT 30,
  total_questions INT DEFAULT 10,
  max_marks INT DEFAULT 20,
  difficulty TEXT DEFAULT 'Medium' CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  attempts_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Test Questions
CREATE TABLE IF NOT EXISTS public.test_questions (
  id BIGSERIAL PRIMARY KEY,
  test_id TEXT NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  question_number INT NOT NULL DEFAULT 1,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]'::jsonb,
  correct_option_index INT NOT NULL DEFAULT 0,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Student Test Attempts
CREATE TABLE IF NOT EXISTS public.test_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id TEXT NOT NULL REFERENCES public.tests(id) ON DELETE CASCADE,
  score INT NOT NULL DEFAULT 0,
  total_marks INT NOT NULL DEFAULT 20,
  correct_answers INT NOT NULL DEFAULT 0,
  wrong_answers INT NOT NULL DEFAULT 0,
  time_spent_seconds INT DEFAULT 0,
  user_answers JSONB DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Indexes
CREATE INDEX IF NOT EXISTS idx_tests_standard ON public.tests(standard);
CREATE INDEX IF NOT EXISTS idx_tests_subject ON public.tests(subject);
CREATE INDEX IF NOT EXISTS idx_test_questions_test_id ON public.test_questions(test_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_user_id ON public.test_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_test_attempts_test_id ON public.test_attempts(test_id);

-- 5. Row Level Security Policies
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_attempts ENABLE ROW LEVEL SECURITY;

-- Tests: viewable by all
DROP POLICY IF EXISTS "Public can view tests" ON public.tests;
CREATE POLICY "Public can view tests" ON public.tests
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Test Questions: viewable by all
DROP POLICY IF EXISTS "Public can view test questions" ON public.test_questions;
CREATE POLICY "Public can view test questions" ON public.test_questions
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- Test Attempts: private to student
DROP POLICY IF EXISTS "Users can view own test attempts" ON public.test_attempts;
CREATE POLICY "Users can view own test attempts" ON public.test_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can submit test attempts" ON public.test_attempts;
CREATE POLICY "Users can submit test attempts" ON public.test_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

