-- ==============================================================================
-- 08_seed_data.sql
-- Description: Initial seed data for e-MaziShaala platform.
--              Inserts initial courses, chapters, lessons, live classes, books,
--              study materials, practice tests, and broadcast notifications.
-- ==============================================================================

-- 1. Insert Courses
INSERT INTO public.courses (
  id, title, subtitle, description, standard, subject, thumbnail,
  instructor_name, instructor_title, instructor_avatar, instructor_bio,
  instructor_rating, instructor_students_count, instructor_experience_years,
  price, discounted_price, rating, review_count, lessons_count, duration,
  language, is_popular, is_upcoming, start_date, features
) VALUES
(
  'c10-math-mastery',
  'Class 10 Mathematics: Board Toppers Batch 2026-27',
  'Complete Algebra & Geometry syllabus with Chapter-wise PYQs & Mock Tests',
  'Master Class 10th Board Mathematics with conceptual clarity, shortcut techniques, step-by-step theorem proofs, and full solutions for State Board & CBSE curricula in Marathi & English bilingual medium.',
  10, 'Mathematics',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
  'Prof. Rahul Deshmukh', 'Senior Mathematics Educator (Ex-Vidyapeeth)',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'Trained over 14,000 students across Maharashtra with 250+ students scoring 100/100 in Class 10 Board examinations.',
  4.90, 14200, 14,
  2499.00, 999.00, 4.90, 1840, 68, '90 Hours', 'Marathi & English',
  true, false, 'Starts Nov 20, 2026',
  '["68 Interactive Video Lessons with PDF Notes", "Solved Previous 10 Years Board Papers", "Weekly Live Doubt Solving Sessions", "Unlimited Chapter-wise Quizzes & Worksheets"]'::jsonb
),
(
  'c10-science-booster',
  'Class 10 Science & Tech: Concept & Experiment Masterclass',
  'Complete Science Part 1 & 2 with animated 3D diagrams & lab demonstrations',
  'Comprehensive coverage of Physics, Chemistry, and Biology tailored for Standard 10 board success. Understand complex chemical reactions, gravitation, life processes, and heredity.',
  10, 'Science',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  'Dr. Snehal Patil', 'M.Sc., Ph.D. in Physics, Gold Medalist',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'Specialist in simplifying core Physics and Chemistry through everyday experimental analogies and visual pedagogy.',
  4.95, 18500, 12,
  2999.00, 1199.00, 4.90, 2210, 75, '110 Hours', 'Marathi & English',
  true, false, 'Starts Nov 25, 2026',
  '["Complete Science 1 & 2 Syllabus with 3D Animations", "Board Practical & Lab Experiments Breakdown", "Model Answer Writing Guidelines", "Formula Handbook & Reaction Charts PDF"]'::jsonb
),
(
  'c9-math-foundation',
  'Standard 9: Mathematics Foundation & Concept Builder',
  'Build strong fundamentals for 10th Boards in Geometry, Polynomials & Circles',
  'Strengthen your core analytical foundation in Standard 9 Mathematics. Specially designed to ease transitions into high school geometry, coordinate geometry, and statistics.',
  9, 'Mathematics',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
  'Prof. Rahul Deshmukh', 'Senior Mathematics Educator',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'Expert in developing mathematical intuition in middle and high school students.',
  4.88, 9600, 14,
  1999.00, 799.00, 4.80, 920, 52, '72 Hours', 'Marathi & English',
  false, true, 'Starts Dec 01, 2026',
  '["52 HD Structured Video Lectures", "Daily Homework Sets with Solutions", "Bi-weekly Live Doubt Clearing", "Self-Assessment Diagnostic Quizzes"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  price = EXCLUDED.price,
  discounted_price = EXCLUDED.discounted_price;

-- 2. Insert Course Chapters & Lessons
INSERT INTO public.course_chapters (id, course_id, chapter_number, title) VALUES
('chap-1', 'c10-math-mastery', 1, 'Chapter 1: Linear Equations in Two Variables'),
('chap-2', 'c10-math-mastery', 2, 'Chapter 2: Quadratic Equations'),
('chap-3', 'c10-math-mastery', 3, 'Chapter 3: Arithmetic Progression (A.P.)'),
('sci-chap-1', 'c10-science-booster', 1, 'Science Part 1: Gravitation & Laws of Motion'),
('sci-chap-2', 'c10-science-booster', 2, 'Science Part 2: Heredity & Evolution')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.course_lessons (id, course_id, chapter_id, lesson_number, title, duration, is_free_preview, video_url) VALUES
('l1', 'c10-math-mastery', 'chap-1', 1, 'Graphical Method & Simultaneous Equations', '45 mins', true, 'https://www.w3schools.com/html/mov_bbb.mp4'),
('l2', 'c10-math-mastery', 'chap-1', 2, 'Determinant Method (Cramer''s Rule)', '40 mins', false, NULL),
('l3', 'c10-math-mastery', 'chap-1', 3, 'Equations Reducible to Pair of Linear Equations', '50 mins', false, NULL),
('l4', 'c10-math-mastery', 'chap-1', 4, 'Word Problems on Age, Speed & Numbers', '55 mins', false, NULL),
('l5', 'c10-math-mastery', 'chap-2', 1, 'Factorisation & Formula Method', '48 mins', true, NULL),
('l6', 'c10-math-mastery', 'chap-2', 2, 'Nature of Roots & Discriminant Analysis', '42 mins', false, NULL),
('sl1', 'c10-science-booster', 'sci-chap-1', 1, 'Kepler''s Laws & Universal Gravitation', '50 mins', true, 'https://www.w3schools.com/html/mov_bbb.mp4'),
('sl2', 'c10-science-booster', 'sci-chap-1', 2, 'Acceleration Due to Gravity & Free Fall', '45 mins', false, NULL),
('sl4', 'c10-science-booster', 'sci-chap-2', 1, 'Transcription, Translation & Translocation', '44 mins', false, NULL)
ON CONFLICT (id) DO NOTHING;

-- 3. Insert Live Classes
INSERT INTO public.live_classes (
  id, title, subject, standard, teacher_name, teacher_avatar, teacher_title,
  status, scheduled_date, scheduled_time, duration, thumbnail, attendees_count,
  has_recording, recording_duration, recording_url, meeting_link
) VALUES
(
  'live-1', 'Class 10 Live: Quadratic Equations Masterclass & Super-Tricks',
  'Mathematics', 10, 'Prof. Rahul Deshmukh',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'Senior Mathematics Educator', 'live', 'Today, Live Now', '06:00 PM - 07:15 PM', '75 mins',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
  482, false, NULL, NULL, 'https://meet.google.com'
),
(
  'live-2', 'Class 9 Live: Gravitation & Numerical Solving Marathon',
  'Science', 9, 'Dr. Snehal Patil',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'M.Sc., Ph.D. in Physics', 'live', 'Today, Live Now', '06:15 PM - 07:30 PM', '75 mins',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
  318, false, NULL, NULL, 'https://meet.google.com'
),
(
  'up-1', 'Class 10: Chemical Reactions & Balancing Equations in 30 Seconds',
  'Science', 10, 'Dr. Snehal Patil',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  'M.Sc., Ph.D. in Physics', 'upcoming', 'Tomorrow, 5:00 PM', '05:00 PM - 06:00 PM', '60 mins',
  'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
  650, false, NULL, NULL, 'https://meet.google.com'
),
(
  'rec-1', 'Class 10: Linear Equations - Cramer''s Rule & Graphical Mastery',
  'Mathematics', 10, 'Prof. Rahul Deshmukh',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  'Senior Mathematics Educator', 'completed', 'Yesterday, Recorded', '06:00 PM', '68 mins',
  'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=800&q=80',
  890, true, '68 mins', 'https://www.w3schools.com/html/mov_bbb.mp4', 'https://meet.google.com'
)
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  attendees_count = EXCLUDED.attendees_count;

-- 4. Insert Books
INSERT INTO public.books (
  id, title, subtitle, standard, subject, author, publisher, cover_image,
  price, original_price, publication_status, release_date, pages, edition,
  isbn, is_bestseller, description, table_of_contents, highlights
) VALUES
(
  'bk-std10-ganit-prakash',
  'गणित प्रकाश: Standard 10 Mathematics Comprehensive Guide',
  'Complete Theory, Exemplar Problems, 10-Year Solved Board Papers & Formula Handbook',
  10, 'Mathematics', 'Prof. Rahul Deshmukh & Expert Faculty', 'e-MaziShaala Publications',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
  349.00, 499.00, 'published', 'October 2026', 420, '1st Edition (2026-27)', '978-93-89123-01-4', true,
  'An authoritative, student-friendly textbook designed by senior examiners to help Standard 10 students achieve 95%+ in Mathematics.',
  '["Linear Equations in Two Variables", "Quadratic Equations", "Arithmetic Progression", "Financial Planning", "Probability & Statistics"]'::jsonb,
  '["100% aligned with latest Maharashtra State Board syllabus", "Step-by-step solutions for all Textbook Practice Sets", "QR codes for free video solution explanations on mobile"]'::jsonb
),
(
  'bk-std10-vigyan-setu',
  'विज्ञान सेतू: Standard 10 Science & Technology Hand-Guide',
  'Part 1 & Part 2 with 3D Color Diagrams, Experiment Notes & Answer Blueprints',
  10, 'Science', 'Dr. Snehal Patil & Team', 'e-MaziShaala Publications',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80',
  379.00, 520.00, 'published', 'September 2026', 460, '1st Edition (2026-27)', '978-93-89123-02-1', true,
  'Simplifying complex Physics laws, Chemical equations, and Biological cycles with crisp memory maps and practical exam blueprints.',
  '["Gravitation & Periodic Classification", "Chemical Reactions & Equations", "Effects of Electric Current", "Life Processes & Heredity"]'::jsonb,
  '["Over 300+ labeled diagrams and illustrations", "Model answer keys according to Maharashtra Board pattern"]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price;

-- 5. Insert Study Materials
INSERT INTO public.study_materials (
  id, file_name, subject, standard, category, file_type, file_size, chapter, pages_count, summary, downloads_count, download_url
) VALUES
(
  'dl-1', 'Std 10 - Mathematics Formula Sheet & Quick Revision Notes',
  'Mathematics', 10, 'pdf_notes', 'PDF', '2.4 MB', 'All Chapters', 28,
  'Handwritten cheat-sheets covering every theorem, algebraic formula, trigonometry value table, and coordinate geometry shortcuts.',
  1420, 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
),
(
  'dl-2', 'Std 10 - Science 1 Chemical Equations & Balancing Guide',
  'Science', 10, 'pdf_notes', 'PDF', '3.1 MB', 'Chemical Reactions', 34,
  'Complete list of all chemical reactions from Standard 10 textbook categorized by reaction type with step-by-step balancing guides.',
  980, 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
),
(
  'dl-3', 'Std 10 - English Grammar & Letter Writing Templates',
  'English', 10, 'study_material', 'PDF', '1.8 MB', 'Writing Skills', 22,
  'High-scoring formal and informal letter formats, report writing samples, dialogue writing examples, and common grammatical rules.',
  840, 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
),
(
  'dl-4', 'Std 10 - Board 2024 Solved Mathematics Question Paper',
  'Mathematics', 10, 'question_paper', 'PDF', '4.2 MB', 'Board PYQ', 16,
  'Official Maharashtra State Board March 2024 Question Paper with model answer key and step-by-step marking scheme breakdown.',
  2150, 'https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Practice Tests & Questions
INSERT INTO public.tests (
  id, title, subject, standard, chapter, duration_minutes, total_questions, max_marks, difficulty, attempts_count
) VALUES
(
  'test-std10-math-ch1',
  'Linear Equations in Two Variables - Diagnostic Test',
  'Mathematics', 10, 'Chapter 1', 20, 5, 20, 'Medium', 412
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.test_questions (test_id, question_number, question, options, correct_option_index, explanation) VALUES
(
  'test-std10-math-ch1', 1,
  'What is the degree of a linear equation in two variables?',
  '["1", "2", "0", "Undefined"]'::jsonb,
  0,
  'In a linear equation with two variables, the maximum power (degree) of each variable is always 1.'
),
(
  'test-std10-math-ch1', 2,
  'To solve 4x + 5y = 19 and Dx = 40, D = 8 using Cramer''s Rule, what is the value of x?',
  '["4", "5", "8", "10"]'::jsonb,
  1,
  'According to Cramer''s Rule, x = Dx / D = 40 / 8 = 5.'
);

-- 7. Insert Initial Broadcast Notifications
INSERT INTO public.notifications (user_id, title, message, type, action_url) VALUES
(
  NULL,
  'Welcome to e-MaziShaala (ई-माझीशाळा)!',
  'Explore comprehensive syllabus, video lectures, live classes, and practice tests tailored for Standard 1 to 10.',
  'general',
  '/home'
),
(
  NULL,
  'Class 10 Live Masterclass Today at 6:00 PM',
  'Join Prof. Rahul Deshmukh for Quadratic Equations Super-Tricks and live problem solving.',
  'live',
  '/live'
);

