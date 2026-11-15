export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  standard: number; // 1 to 10
  schoolName: string;
  avatar: string;
  joinedDate: string;
  enrolledCourseIds: string[];
  completedCourseIds: string[];
  reminderClassIds: string[];
  downloadedItemIds: string[];
  progress: Record<string, { percent: number; completedLessons: number; lastLessonTitle: string }>;
}

export interface AuthResponse {
  user: UserProfile;
  token?: string;
}

