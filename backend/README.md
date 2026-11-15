# e-MaziShaala (ई-माझीशाळा) — Supabase Backend Documentation

This directory contains the database migrations, TypeScript schema definitions, and integration guides for the **e-MaziShaala** learning portal.

---

## 1. Supabase Project Configuration

| Key | Value |
|---|---|
| **Project URL** | `https://ozwyifbaqmfuytgwzmjy.supabase.co` |
| **Publishable Key** | `sb_publishable_r3_ltdWqNfTFdiSio5mGmg_jmgiHcmU` |
| **Authentication Flow** | PKCE (Proof Key for Code Exchange) |
| **Android App ID** | `com.emaazishaala.app` |
| **OAuth Deep Link** | `com.emaazishaala.app://auth/callback` |
| **Web Callback** | `http://localhost:4200/auth/callback` (or your production domain) |

---

## 2. Migration Execution Order

Run these SQL scripts in the **Supabase Dashboard -> SQL Editor** in numerical order:

| File | Tables / Triggers | Description |
|---|---|---|
| [`01_profiles.sql`](./migrations/01_profiles.sql) | `profiles`, `handle_new_user()` trigger | Student profiles with auto-signup trigger, standard selection, and RLS. |
| [`02_courses_and_curriculum.sql`](./migrations/02_courses_and_curriculum.sql) | `courses`, `course_chapters`, `course_lessons`, `enrollments`, `lesson_progress` | Course catalog, chapter curriculum, video lessons, and student progress tracking. |
| [`03_live_classes.sql`](./migrations/03_live_classes.sql) | `live_classes`, `live_class_reminders` | Live and upcoming masterclasses, recordings, and user notification reminders. |
| [`04_books.sql`](./migrations/04_books.sql) | `books` | Publication catalog for e-MaziShaala proprietary books with TOC and highlights. |
| [`05_study_materials.sql`](./migrations/05_study_materials.sql) | `study_materials`, `user_downloads` | Downloadable revision notes, worksheets, PYQ papers, and student saved items. |
| [`06_quizzes_and_tests.sql`](./migrations/06_quizzes_and_tests.sql) | `tests`, `test_questions`, `test_attempts` | Standard 1-10 practice mock tests, chapter quiz questions, and score records. |
| [`07_notifications.sql`](./migrations/07_notifications.sql) | `notifications` | Broadcast announcements and user-specific live/exam alerts. |
| [`08_seed_data.sql`](./migrations/08_seed_data.sql) | Initial data | Seeds initial Std 1-10 courses, sample books, live classes, notes, and tests. |

---

## 3. Row Level Security (RLS) Summary

Every exposed table has Row Level Security enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`):

| Table | SELECT | INSERT | UPDATE | DELETE |
|---|---|---|---|---|
| `public.profiles` | Own profile only (`auth.uid() = id`) | Own profile only (`auth.uid() = id`) | Own profile only (`auth.uid() = id`) | Cascade on user delete |
| `public.courses` | Public (Anon & Auth) | Service Role / Admin | Service Role / Admin | Service Role / Admin |
| `public.course_chapters`| Public (Anon & Auth) | Service Role / Admin | Service Role / Admin | Service Role / Admin |
| `public.course_lessons` | Public (Anon & Auth) | Service Role / Admin | Service Role / Admin | Service Role / Admin |
| `public.enrollments` | Own enrollments (`auth.uid() = user_id`) | Own enrollments (`auth.uid() = user_id`) | Own progress (`auth.uid() = user_id`) | Own enrollments (`auth.uid() = user_id`) |
| `public.lesson_progress`| Own lessons (`auth.uid() = user_id`) | Own lessons (`auth.uid() = user_id`) | Own lessons (`auth.uid() = user_id`) | Own lessons (`auth.uid() = user_id`) |
| `public.live_classes` | Public (Anon & Auth) | Service Role / Admin | Service Role / Admin | Service Role / Admin |
| `public.live_class_reminders`| Own reminders (`auth.uid() = user_id`) | Own reminders (`auth.uid() = user_id`) | - | Own reminders (`auth.uid() = user_id`) |
| `public.books` | Public (Anon & Auth) | Service Role / Admin | Service Role / Admin | Service Role / Admin |
| `public.study_materials`| Public (Anon & Auth) | Service Role / Admin | Service Role / Admin | Service Role / Admin |
| `public.user_downloads` | Own downloads (`auth.uid() = user_id`) | Own downloads (`auth.uid() = user_id`) | - | Own downloads (`auth.uid() = user_id`) |
| `public.tests` | Public (Anon & Auth) | Service Role / Admin | Service Role / Admin | Service Role / Admin |
| `public.test_questions` | Public (Anon & Auth) | Service Role / Admin | Service Role / Admin | Service Role / Admin |
| `public.test_attempts` | Own attempts (`auth.uid() = user_id`) | Own attempts (`auth.uid() = user_id`) | - | - |
| `public.notifications` | Broadcasts & own notifications | Service Role / Admin | Own notification (`is_read`) | - |

---

## 4. Google OAuth Setup in Supabase Dashboard

1. Go to **Supabase Dashboard -> Authentication -> Providers -> Google**.
2. Toggle **Enable Google provider** to ON.
3. Paste the **Client ID** and **Client Secret** obtained from Google Cloud Console.
4. Under **Authentication -> URL Configuration**:
   - **Site URL**: `https://ozwyifbaqmfuytgwzmjy.supabase.co` (or your production web domain)
   - **Redirect URLs**: Add both:
     - `http://localhost:4200/auth/callback`
     - `com.emaazishaala.app://auth/callback`
5. Save changes.

---

## 5. Storage Buckets (Optional)

In **Supabase Dashboard -> Storage**:
1. Create a public bucket `avatars` for user profile photos.
2. Create a public bucket `study-files` for PDF worksheets and notes.
3. Add an RLS policy for `avatars`:
   - `SELECT`: `true` (public)
   - `INSERT / UPDATE`: `bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]`

