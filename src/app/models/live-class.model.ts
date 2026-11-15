export interface LiveClass {
  id: string;
  title: string;
  subject: string;
  standard: number; // 1 to 10
  teacherName: string;
  teacherAvatar: string;
  teacherTitle: string;
  status: 'live' | 'upcoming' | 'completed';
  scheduledDate: string; // ISO date or formatted
  scheduledTime: string; // e.g. "05:00 PM - 06:00 PM"
  duration: string;
  thumbnail: string;
  attendeesCount: number;
  hasRecording: boolean;
  recordingDuration?: string;
  recordingUrl?: string;
  isReminderSet?: boolean;
  meetingLink?: string;
}

