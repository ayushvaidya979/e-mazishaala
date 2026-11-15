import { Injectable, signal, computed } from '@angular/core';
import { LiveClass } from '../../models/live-class.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class LiveClassService {
  constructor(private toastService: ToastService) {}

  private readonly classesData: LiveClass[] = [
    {
      id: 'live-1',
      title: 'Class 10 Live: Quadratic Equations Masterclass & Super-Tricks',
      subject: 'Mathematics',
      standard: 10,
      teacherName: 'Prof. Rahul Deshmukh',
      teacherTitle: 'Senior Mathematics Educator',
      teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: 'live',
      scheduledDate: 'Today, Live Now',
      scheduledTime: '06:00 PM - 07:15 PM',
      duration: '75 mins',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
      attendeesCount: 482,
      hasRecording: false,
      meetingLink: 'https://meet.google.com'
    },
    {
      id: 'live-2',
      title: 'Class 9 Live: Gravitation & Numerical Solving Marathon',
      subject: 'Science',
      standard: 9,
      teacherName: 'Dr. Snehal Patil',
      teacherTitle: 'M.Sc., Ph.D. in Physics',
      teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      status: 'live',
      scheduledDate: 'Today, Live Now',
      scheduledTime: '06:15 PM - 07:30 PM',
      duration: '75 mins',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      attendeesCount: 318,
      hasRecording: false,
      meetingLink: 'https://meet.google.com'
    },
    {
      id: 'up-1',
      title: 'Class 10: Chemical Reactions & Balancing Equations in 30 Seconds',
      subject: 'Science',
      standard: 10,
      teacherName: 'Dr. Snehal Patil',
      teacherTitle: 'M.Sc., Ph.D. in Physics',
      teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      status: 'upcoming',
      scheduledDate: 'Tomorrow, Nov 13',
      scheduledTime: '05:00 PM - 06:00 PM',
      duration: '60 mins',
      thumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
      attendeesCount: 650,
      hasRecording: false,
      isReminderSet: false
    },
    {
      id: 'up-2',
      title: 'इयत्ता ८ वी: समास व त्यांचे प्रकार - सोपी क्लुप्ती',
      subject: 'Marathi',
      standard: 8,
      teacherName: 'Mrs. Anjali Kulkarni',
      teacherTitle: 'State Awardee Marathi Littérateur',
      teacherAvatar: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=200&q=80',
      status: 'upcoming',
      scheduledDate: 'Friday, Nov 14',
      scheduledTime: '06:00 PM - 07:00 PM',
      duration: '60 mins',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80',
      attendeesCount: 420,
      hasRecording: false,
      isReminderSet: false
    },
    {
      id: 'up-3',
      title: 'Standard 7: Active & Passive Voice Made Fun with Games',
      subject: 'English',
      standard: 7,
      teacherName: 'Mr. Sachin Shinde',
      teacherTitle: 'Cambridge Certified ELT Trainer',
      teacherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      status: 'upcoming',
      scheduledDate: 'Saturday, Nov 15',
      scheduledTime: '11:00 AM - 12:00 PM',
      duration: '60 mins',
      thumbnail: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
      attendeesCount: 290,
      hasRecording: false,
      isReminderSet: true
    },
    {
      id: 'prev-1',
      title: 'Class 10: Linear Equations in Two Variables - Complete Practice Set 1.1 to 1.5',
      subject: 'Mathematics',
      standard: 10,
      teacherName: 'Prof. Rahul Deshmukh',
      teacherTitle: 'Senior Mathematics Educator',
      teacherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      status: 'completed',
      scheduledDate: 'Nov 10, 2026',
      scheduledTime: '06:00 PM - 07:30 PM',
      duration: '90 mins',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      attendeesCount: 1420,
      hasRecording: true,
      recordingDuration: '1h 32m'
    },
    {
      id: 'prev-2',
      title: 'Class 9: Laws of Motion & Momentum Conservation Law Explained with Experiments',
      subject: 'Science',
      standard: 9,
      teacherName: 'Dr. Snehal Patil',
      teacherTitle: 'M.Sc., Ph.D. in Physics',
      teacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      status: 'completed',
      scheduledDate: 'Nov 08, 2026',
      scheduledTime: '05:30 PM - 06:45 PM',
      duration: '75 mins',
      thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
      attendeesCount: 1105,
      hasRecording: true,
      recordingDuration: '1h 14m'
    }
  ];

  private classesSignal = signal<LiveClass[]>(this.classesData);

  readonly classes = this.classesSignal.asReadonly();

  readonly liveNowClasses = computed(() =>
    this.classesSignal().filter(c => c.status === 'live')
  );

  readonly upcomingClasses = computed(() =>
    this.classesSignal().filter(c => c.status === 'upcoming')
  );

  readonly previousClasses = computed(() =>
    this.classesSignal().filter(c => c.status === 'completed')
  );

  toggleReminder(classId: string) {
    this.classesSignal.update(classes =>
      classes.map(c => {
        if (c.id === classId) {
          const nextState = !c.isReminderSet;
          if (nextState) {
            this.toastService.success(`Reminder set for: ${c.title}`, 'bell');
          } else {
            this.toastService.info('Reminder removed');
          }
          return { ...c, isReminderSet: nextState };
        }
        return c;
      })
    );
  }
}

