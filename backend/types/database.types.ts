/**
 * Database type definitions generated from Supabase PostgreSQL schema.
 * Matches all tables created across migrations 01 to 08.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          phone_number: string | null;
          standard: number;
          school_name: string;
          avatar_url: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          phone_number?: string | null;
          standard?: number;
          school_name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          phone_number?: string | null;
          standard?: number;
          school_name?: string;
          avatar_url?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      courses: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          description: string | null;
          standard: number;
          subject: string;
          thumbnail: string | null;
          instructor_name: string;
          instructor_title: string | null;
          instructor_avatar: string | null;
          instructor_bio: string | null;
          instructor_rating: number;
          instructor_students_count: number;
          instructor_experience_years: number;
          price: number;
          discounted_price: number;
          rating: number;
          review_count: number;
          lessons_count: number;
          duration: string;
          language: string;
          is_popular: boolean;
          is_upcoming: boolean;
          start_date: string | null;
          features: Json;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          subtitle?: string | null;
          description?: string | null;
          standard: number;
          subject: string;
          thumbnail?: string | null;
          instructor_name: string;
          instructor_title?: string | null;
          instructor_avatar?: string | null;
          instructor_bio?: string | null;
          instructor_rating?: number;
          instructor_students_count?: number;
          instructor_experience_years?: number;
          price?: number;
          discounted_price?: number;
          rating?: number;
          review_count?: number;
          lessons_count?: number;
          duration?: string;
          language?: string;
          is_popular?: boolean;
          is_upcoming?: boolean;
          start_date?: string | null;
          features?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          subtitle?: string | null;
          description?: string | null;
          standard?: number;
          subject?: string;
          thumbnail?: string | null;
          instructor_name?: string;
          instructor_title?: string | null;
          instructor_avatar?: string | null;
          instructor_bio?: string | null;
          instructor_rating?: number;
          instructor_students_count?: number;
          instructor_experience_years?: number;
          price?: number;
          discounted_price?: number;
          rating?: number;
          review_count?: number;
          lessons_count?: number;
          duration?: string;
          language?: string;
          is_popular?: boolean;
          is_upcoming?: boolean;
          start_date?: string | null;
          features?: Json;
          created_at?: string;
        };
      };
      course_chapters: {
        Row: {
          id: string;
          course_id: string;
          chapter_number: number;
          title: string;
          created_at: string;
        };
        Insert: {
          id: string;
          course_id: string;
          chapter_number?: number;
          title: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          chapter_number?: number;
          title?: string;
          created_at?: string;
        };
      };
      course_lessons: {
        Row: {
          id: string;
          course_id: string;
          chapter_id: string;
          lesson_number: number;
          title: string;
          duration: string;
          is_free_preview: boolean;
          video_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          course_id: string;
          chapter_id: string;
          lesson_number?: number;
          title: string;
          duration?: string;
          is_free_preview?: boolean;
          video_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          course_id?: string;
          chapter_id?: string;
          lesson_number?: number;
          title?: string;
          duration?: string;
          is_free_preview?: boolean;
          video_url?: string | null;
          created_at?: string;
        };
      };
      enrollments: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          enrolled_at: string;
          progress_percent: number;
          completed_lessons: number;
          last_lesson_title: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          enrolled_at?: string;
          progress_percent?: number;
          completed_lessons?: number;
          last_lesson_title?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          enrolled_at?: string;
          progress_percent?: number;
          completed_lessons?: number;
          last_lesson_title?: string | null;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          user_id: string;
          course_id: string;
          lesson_id: string;
          is_completed: boolean;
          completed_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          course_id: string;
          lesson_id: string;
          is_completed?: boolean;
          completed_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          course_id?: string;
          lesson_id?: string;
          is_completed?: boolean;
          completed_at?: string;
        };
      };
      live_classes: {
        Row: {
          id: string;
          title: string;
          subject: string;
          standard: number;
          teacher_name: string;
          teacher_avatar: string | null;
          teacher_title: string | null;
          status: 'live' | 'upcoming' | 'completed';
          scheduled_date: string;
          scheduled_time: string;
          duration: string;
          thumbnail: string | null;
          attendees_count: number;
          has_recording: boolean;
          recording_duration: string | null;
          recording_url: string | null;
          meeting_link: string;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          subject: string;
          standard: number;
          teacher_name: string;
          teacher_avatar?: string | null;
          teacher_title?: string | null;
          status: 'live' | 'upcoming' | 'completed';
          scheduled_date: string;
          scheduled_time: string;
          duration?: string;
          thumbnail?: string | null;
          attendees_count?: number;
          has_recording?: boolean;
          recording_duration?: string | null;
          recording_url?: string | null;
          meeting_link?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          subject?: string;
          standard?: number;
          teacher_name?: string;
          teacher_avatar?: string | null;
          teacher_title?: string | null;
          status?: 'live' | 'upcoming' | 'completed';
          scheduled_date?: string;
          scheduled_time?: string;
          duration?: string;
          thumbnail?: string | null;
          attendees_count?: number;
          has_recording?: boolean;
          recording_duration?: string | null;
          recording_url?: string | null;
          meeting_link?: string;
          created_at?: string;
        };
      };
      live_class_reminders: {
        Row: {
          id: string;
          user_id: string;
          live_class_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          live_class_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          live_class_id?: string;
          created_at?: string;
        };
      };
      books: {
        Row: {
          id: string;
          title: string;
          subtitle: string | null;
          standard: number;
          subject: string;
          author: string;
          publisher: string;
          cover_image: string | null;
          price: number;
          original_price: number;
          publication_status: 'published' | 'coming_soon';
          release_date: string | null;
          pages: number;
          edition: string;
          isbn: string | null;
          description: string | null;
          table_of_contents: Json;
          highlights: Json;
          is_bestseller: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          subtitle?: string | null;
          standard: number;
          subject: string;
          author: string;
          publisher?: string;
          cover_image?: string | null;
          price?: number;
          original_price?: number;
          publication_status?: 'published' | 'coming_soon';
          release_date?: string | null;
          pages?: number;
          edition?: string;
          isbn?: string | null;
          description?: string | null;
          table_of_contents?: Json;
          highlights?: Json;
          is_bestseller?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          subtitle?: string | null;
          standard?: number;
          subject?: string;
          author?: string;
          publisher?: string;
          cover_image?: string | null;
          price?: number;
          original_price?: number;
          publication_status?: 'published' | 'coming_soon';
          release_date?: string | null;
          pages?: number;
          edition?: string;
          isbn?: string | null;
          description?: string | null;
          table_of_contents?: Json;
          highlights?: Json;
          is_bestseller?: boolean;
          created_at?: string;
        };
      };
      study_materials: {
        Row: {
          id: string;
          file_name: string;
          subject: string;
          standard: number;
          category: 'pdf_notes' | 'study_material' | 'worksheet' | 'question_paper' | 'book';
          file_type: 'PDF' | 'DOCX' | 'ZIP';
          file_size: string;
          chapter: string | null;
          pages_count: number;
          summary: string | null;
          downloads_count: number;
          download_url: string;
          created_at: string;
        };
        Insert: {
          id: string;
          file_name: string;
          subject: string;
          standard: number;
          category: 'pdf_notes' | 'study_material' | 'worksheet' | 'question_paper' | 'book';
          file_type?: 'PDF' | 'DOCX' | 'ZIP';
          file_size?: string;
          chapter?: string | null;
          pages_count?: number;
          summary?: string | null;
          downloads_count?: number;
          download_url: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          file_name?: string;
          subject?: string;
          standard?: number;
          category?: 'pdf_notes' | 'study_material' | 'worksheet' | 'question_paper' | 'book';
          file_type?: 'PDF' | 'DOCX' | 'ZIP';
          file_size?: string;
          chapter?: string | null;
          pages_count?: number;
          summary?: string | null;
          downloads_count?: number;
          download_url?: string;
          created_at?: string;
        };
      };
      user_downloads: {
        Row: {
          id: string;
          user_id: string;
          material_id: string;
          downloaded_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          material_id: string;
          downloaded_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          material_id?: string;
          downloaded_at?: string;
        };
      };
      tests: {
        Row: {
          id: string;
          title: string;
          subject: string;
          standard: number;
          chapter: string | null;
          duration_minutes: number;
          total_questions: number;
          max_marks: number;
          difficulty: 'Easy' | 'Medium' | 'Hard';
          attempts_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          subject: string;
          standard: number;
          chapter?: string | null;
          duration_minutes?: number;
          total_questions?: number;
          max_marks?: number;
          difficulty?: 'Easy' | 'Medium' | 'Hard';
          attempts_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          subject?: string;
          standard?: number;
          chapter?: string | null;
          duration_minutes?: number;
          total_questions?: number;
          max_marks?: number;
          difficulty?: 'Easy' | 'Medium' | 'Hard';
          attempts_count?: number;
          created_at?: string;
        };
      };
      test_questions: {
        Row: {
          id: number;
          test_id: string;
          question_number: number;
          question: string;
          options: Json;
          correct_option_index: number;
          explanation: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          test_id: string;
          question_number?: number;
          question: string;
          options: Json;
          correct_option_index?: number;
          explanation?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          test_id?: string;
          question_number?: number;
          question?: string;
          options?: Json;
          correct_option_index?: number;
          explanation?: string | null;
          created_at?: string;
        };
      };
      test_attempts: {
        Row: {
          id: string;
          user_id: string;
          test_id: string;
          score: number;
          total_marks: number;
          correct_answers: number;
          wrong_answers: number;
          time_spent_seconds: number;
          user_answers: Json;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          test_id: string;
          score?: number;
          total_marks?: number;
          correct_answers?: number;
          wrong_answers?: number;
          time_spent_seconds?: number;
          user_answers?: Json;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          test_id?: string;
          score?: number;
          total_marks?: number;
          correct_answers?: number;
          wrong_answers?: number;
          time_spent_seconds?: number;
          user_answers?: Json;
          submitted_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          message: string;
          type: 'live' | 'course' | 'book' | 'general' | 'exam';
          is_read: boolean;
          action_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          message: string;
          type?: 'live' | 'course' | 'book' | 'general' | 'exam';
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          message?: string;
          type?: 'live' | 'course' | 'book' | 'general' | 'exam';
          is_read?: boolean;
          action_url?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

