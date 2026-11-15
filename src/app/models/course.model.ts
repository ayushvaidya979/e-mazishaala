export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  studentsCount: number;
  experienceYears: number;
  bio: string;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  isFreePreview: boolean;
  videoUrl?: string;
}

export interface CourseChapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  standard: number; // 1 to 10
  subject: 'Mathematics' | 'Science' | 'English' | 'Marathi' | 'Social Science' | string;
  thumbnail: string;
  instructor: Instructor;
  startDate: string;
  price: number;
  discountedPrice: number;
  rating: number;
  reviewCount: number;
  lessonsCount: number;
  duration: string;
  language: string;
  isPopular: boolean;
  isUpcoming: boolean;
  isEnrolled?: boolean;
  progressPercent?: number;
  curriculum: CourseChapter[];
  features: string[];
}

