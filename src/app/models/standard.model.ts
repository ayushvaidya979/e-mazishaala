export interface ChapterItem {
  id: string;
  number: number;
  title: string;
  marathiTitle?: string;
  description: string;
  lessonsCount: number;
  duration: string;
  topics: string[];
  weightage?: string;
}

export interface SubjectSyllabus {
  id: string;
  name: string;
  marathiName: string;
  icon: string;
  color: string;
  totalChapters: number;
  totalHours: string;
  chapters: ChapterItem[];
}

export interface StandardRecordedLecture {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  duration: string;
  teacherName: string;
  teacherTitle: string;
  teacherAvatar: string;
  thumbnail: string;
  videoUrl: string;
  viewsCount: number;
  isPopular?: boolean;
}

export interface StandardLiveLecture {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  teacherTitle: string;
  teacherAvatar: string;
  scheduledTime: string;
  scheduledDate: string;
  status: 'live' | 'upcoming';
  attendeesCount: number;
  duration: string;
}

export interface StandardNote {
  id: string;
  title: string;
  subject: string;
  chapter: string;
  fileType: 'PDF' | 'DOCX';
  fileSize: string;
  pagesCount: number;
  downloadCount: number;
  summary: string;
  downloadUrl?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface StandardTest {
  id: string;
  title: string;
  subject: string;
  chapter?: string;
  durationMinutes: number;
  totalQuestions: number;
  maxMarks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attemptsCount: number;
  questions: QuizQuestion[];
}

export interface StandardDetail {
  standard: number;
  label: string;
  marathiLabel: string;
  category: 'Primary' | 'Middle' | 'High School';
  themeColor: string;
  iconName: string;
  tagline: string;
  description: string;
  quote: string;
  subjects: SubjectSyllabus[];
  recordedLectures: StandardRecordedLecture[];
  liveLectures: StandardLiveLecture[];
  notes: StandardNote[];
  tests: StandardTest[];
}

