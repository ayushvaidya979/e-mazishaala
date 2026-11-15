-- ==============================================================================
-- 04_books.sql
-- Table: public.books
-- Description: Stores publication catalog for e-MaziShaala proprietary books.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  standard INT NOT NULL CHECK (standard >= 1 AND standard <= 10),
  subject TEXT NOT NULL,
  author TEXT NOT NULL,
  publisher TEXT DEFAULT 'ई-माझीशाळा प्रकाशने',
  cover_image TEXT,
  price NUMERIC(10,2) DEFAULT 0,
  original_price NUMERIC(10,2) DEFAULT 0,
  publication_status TEXT DEFAULT 'published' CHECK (publication_status IN ('published', 'coming_soon')),
  release_date TEXT,
  pages INT DEFAULT 120,
  edition TEXT DEFAULT '2025 Revised Edition',
  isbn TEXT,
  description TEXT,
  table_of_contents JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  is_bestseller BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_books_standard ON public.books(standard);
CREATE INDEX IF NOT EXISTS idx_books_subject ON public.books(subject);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(publication_status);

-- Row Level Security
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Allow everyone (authenticated & visitors) to browse the book catalog
DROP POLICY IF EXISTS "Public can view books" ON public.books;
CREATE POLICY "Public can view books" ON public.books
  FOR SELECT
  TO authenticated, anon
  USING (true);

