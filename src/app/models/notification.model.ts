export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'live' | 'course' | 'book' | 'general' | 'exam';
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
}

