-- ==============================================================================
-- 05_study_materials.sql
-- Tables: public.study_materials, public.user_downloads
-- Description: Stores downloadable study resources (PDFs, notes, question papers)
--              and tracks student downloads/offline items.
-- ==============================================================================

-- 1. Study Materials Table
CREATE TABLE IF NOT EXISTS public.study_materials (
  id TEXT PRIMARY KEY,
  file_name TEXT NOT NULL,
  subject TEXT NOT NULL,
  standard INT NOT NULL CHECK (standard >= 1 AND standard <= 10),
  category TEXT NOT NULL CHECK (category IN ('pdf_notes', 'study_material', 'worksheet', 'question_paper', 'book')),
  file_type TEXT DEFAULT 'PDF' CHECK (file_type IN ('PDF', 'DOCX', 'ZIP')),
  file_size TEXT DEFAULT '2.4 MB',
  chapter TEXT,
  pages_count INT DEFAULT 10,
  summary TEXT,
  downloads_count INT DEFAULT 0,
  download_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Student Downloaded Items (Bookmarks / Saved offline records)
CREATE TABLE IF NOT EXISTS public.user_downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  material_id TEXT NOT NULL REFERENCES public.study_materials(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, material_id)
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_study_materials_standard ON public.study_materials(standard);
CREATE INDEX IF NOT EXISTS idx_study_materials_category ON public.study_materials(category);
CREATE INDEX IF NOT EXISTS idx_study_materials_subject ON public.study_materials(subject);
CREATE INDEX IF NOT EXISTS idx_user_downloads_user ON public.user_downloads(user_id);

-- 4. Row Level Security Policies
ALTER TABLE public.study_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_downloads ENABLE ROW LEVEL SECURITY;

-- Study materials: viewable by all
DROP POLICY IF EXISTS "Public can view study materials" ON public.study_materials;
CREATE POLICY "Public can view study materials" ON public.study_materials
  FOR SELECT
  TO authenticated, anon
  USING (true);

-- User downloads: private to the student
DROP POLICY IF EXISTS "Users can view own downloads" ON public.user_downloads;
CREATE POLICY "Users can view own downloads" ON public.user_downloads
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can save downloads" ON public.user_downloads;
CREATE POLICY "Users can save downloads" ON public.user_downloads
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove own downloads" ON public.user_downloads;
CREATE POLICY "Users can remove own downloads" ON public.user_downloads
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

