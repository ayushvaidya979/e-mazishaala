import { Injectable, signal, computed } from '@angular/core';
import { AppNotification } from '../../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly notificationsData: AppNotification[] = [
    {
      id: 'notif-1',
      title: '🔴 Live Class Started!',
      message: 'Prof. Rahul Deshmukh is now live on "Class 10: Quadratic Equations Masterclass". Join in to ask doubts live.',
      type: 'live',
      timestamp: '5 minutes ago',
      isRead: false,
      actionUrl: '/live-classes'
    },
    {
      id: 'notif-2',
      title: '📚 New Publication Released',
      message: 'गणित प्रकाश (Class 10 Mathematics Comprehensive Guide) is now available in print and digital format.',
      type: 'book',
      timestamp: '2 hours ago',
      isRead: false,
      actionUrl: '/books/bk-std10-ganit-prakash'
    },
    {
      id: 'notif-3',
      title: '📝 New Study Material Uploaded',
      message: 'Standard 10 Science Chapter 1 Handwritten Mind Maps and Board PYQs added to your downloads.',
      type: 'course',
      timestamp: '1 day ago',
      isRead: true,
      actionUrl: '/downloads'
    },
    {
      id: 'notif-4',
      title: '🎯 Weekly Mega Mock Exam',
      message: 'Class 10 Mathematics All-Maharashtra Mock Exam will be held on Sunday at 10:00 AM.',
      type: 'exam',
      timestamp: '2 days ago',
      isRead: true,
      actionUrl: '/live-classes'
    }
  ];

  private listSignal = signal<AppNotification[]>(this.notificationsData);

  readonly notifications = this.listSignal.asReadonly();

  readonly unreadCount = computed(() =>
    this.listSignal().filter(n => !n.isRead).length
  );

  markAsRead(id: string) {
    this.listSignal.update(list =>
      list.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  }

  markAllAsRead() {
    this.listSignal.update(list => list.map(n => ({ ...n, isRead: true })));
  }

  clearAll() {
    this.listSignal.set([]);
  }
}

