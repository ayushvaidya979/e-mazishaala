import { Injectable, signal, computed, inject } from '@angular/core';
import { AppNotification } from '../../models/notification.model';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private supabaseService = inject(SupabaseService);
  private readonly supabase = this.supabaseService.supabase;
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

  constructor() {
    this.loadNotificationsFromSupabase();
  }

  private async loadNotificationsFromSupabase() {
    try {
      const { data: { session } } = await this.supabase.auth.getSession();
      const userId = session?.user?.id;

      let query = this.supabase.from('notifications').select('*');
      if (userId) {
        query = query.or(`user_id.is.null,user_id.eq.${userId}`);
      } else {
        query = query.is('user_id', null);
      }

      const { data: dbNotifs, error } = await query.order('created_at', { ascending: false });

      if (!error && dbNotifs && dbNotifs.length > 0) {
        const mapped: AppNotification[] = dbNotifs.map(db => ({
          id: db.id,
          title: db.title,
          message: db.message,
          type: db.type as any,
          timestamp: new Date(db.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          isRead: db.is_read,
          actionUrl: db.action_url || '/home'
        }));

        const merged = [...mapped];
        for (const local of this.notificationsData) {
          if (!merged.find(m => m.id === local.id)) {
            merged.push(local);
          }
        }
        this.listSignal.set(merged);
      }
    } catch {
      // Offline fallback
    }
  }

  async markAsRead(id: string) {
    this.listSignal.update(list =>
      list.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );

    try {
      await this.supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id);
    } catch (e) {
      // Ignore offline errors
    }
  }

  markAllAsRead() {
    this.listSignal.update(list => list.map(n => ({ ...n, isRead: true })));
  }

  clearAll() {
    this.listSignal.set([]);
  }
}

