-- ==============================================================================
-- 02_courses_and_curriculum.sql
-- Tables: public.courses, public.course_chapters, public.course_lessons,
--         public.enrollments, public.lesson_progress
-- ==============================================================================

-- 1. Courses Table
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  standard INT NOT NULL CHECK (standard >= 1 AND standard <= 10),
  subject TEXT NOT NULL,
  thumbnail TEXT,
  instructor_name TEXT NOT NULL,
  instructor_title TEXT,
  instructor_avatar TEXT,
  instructor_bio TEXT,
  instructor_rating NUMERIC(3,2) DEFAULT 4.90,
  instructor_students_count INT DEFAULT 14000,
  instructor_experience_years INT DEFAULT 12,
  price NUMERIC(10,2) DEFAULT 0,
  discounted_price NUMERIC(10,2) DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 4.90,
  review_count INT DEFAULT 120,
  lessons_count INT DEFAULT 50,
  duration TEXT DEFAULT '80 Hours',
  language TEXT DEFAULT 'Marathi & English',
  is_popular BOOLEAN DEFAULT false,
  is_upcoming BOOLEAN DEFAULT false,
  start_date TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Course Chapters Table
CREATE TABLE IF NOT EXISTS public.course_chapters (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Course Lessons Table
CREATE TABLE IF NOT EXISTS public.course_lessons (
  id TEXT PRIMARY KEY,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id TEXT NOT NULL REFERENCES public.course_chapters(id) ON DELETE CASCADE,
  lesson_number INT NOT NULL DEFAULT 1,
  title TEXT NOT NULL,
  duration TEXT DEFAULT '45 mins',
  is_free_preview BOOLEAN DEFAULT false,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Student Enrollments Table
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  progress_percent INT DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  completed_lessons INT DEFAULT 0,
  last_lesson_title TEXT,
  UNIQUE(user_id, course_id)
);

-- 5. Individual Lesson Progress Table
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL REFERENCES public.course_lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT true,
  completed_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, course_id, lesson_id)
);

-- 6. Indexes for High Performance Queries
CREATE INDEX IF NOT EXISTS idx_courses_standard ON public.courses(standard);
CREATE INDEX IF NOT EXISTS idx_courses_subject ON public.courses(subject);
CREATE INDEX IF NOT EXISTS idx_course_chapters_course_id ON public.course_chapters(course_id);
CREATE INDEX IF NOT EXISTS idx_course_lessons_chapter_id ON public.course_lessons(chapter_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course ON public.lesson_progress(user_id, course_id);

-- 7. Row Level Security Policies
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Courses: Read-only for authenticated & anonymous users
DROP POLICY IF EXISTS "Public can view courses" ON public.courses;
CREATE POLICY "Public can view courses" ON public.courses
  FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Public can view course chapters" ON public.course_chapters;
CREATE POLICY "Public can view course chapters" ON public.course_chapters
  FOR SELECT TO authenticated, anon USING (true);

DROP POLICY IF EXISTS "Public can view course lessons" ON public.course_lessons;
CREATE POLICY "Public can view course lessons" ON public.course_lessons
  FOR SELECT TO authenticated, anon USING (true);

-- Enrollments: Strict User Isolation (Only the owner can view or update their enrollments)
DROP POLICY IF EXISTS "Users can view own enrollments" ON public.enrollments;
CREATE POLICY "Users can view own enrollments" ON public.enrollments
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can enroll into courses" ON public.enrollments;
CREATE POLICY "Users can enroll into courses" ON public.enrollments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own enrollment progress" ON public.enrollments;
CREATE POLICY "Users can update own enrollment progress" ON public.enrollments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Lesson Progress: Strict User Isolation
DROP POLICY IF EXISTS "Users can view own lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can view own lesson progress" ON public.lesson_progress
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can mark lessons complete" ON public.lesson_progress;
CREATE POLICY "Users can mark lessons complete" ON public.lesson_progress
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update lesson progress" ON public.lesson_progress;
CREATE POLICY "Users can update lesson progress" ON public.lesson_progress
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

