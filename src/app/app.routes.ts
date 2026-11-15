import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { authGuard } from './core/guards/auth.guard';

const rootRedirectGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.checkAndRestoreSession() ? router.createUrlTree(['/home']) : router.createUrlTree(['/welcome']);
};

export const routes: Routes = [
  {
    path: '',
    canActivate: [rootRedirectGuard],
    children: []
  },
  {
    path: 'welcome',
    loadComponent: () => import('./features/welcome/welcome.component').then(m => m.WelcomeComponent),
    title: 'Welcome | e-MaziShaala (ई-माझीशाळा)'
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'e-MaziShaala (ई-माझीशाळा) | Home'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login | e-MaziShaala'
  },
  {
    path: 'signup',
    loadComponent: () => import('./features/auth/signup/signup.component').then(m => m.SignupComponent),
    title: 'Sign Up | e-MaziShaala'
  },
  {
    path: 'my-courses',
    canActivate: [authGuard],
    loadComponent: () => import('./features/my-courses/my-courses.component').then(m => m.MyCoursesComponent),
    title: 'My Courses | e-MaziShaala'
  },
  {
    path: 'live-classes',
    canActivate: [authGuard],
    loadComponent: () => import('./features/live-classes/live-classes.component').then(m => m.LiveClassesComponent),
    title: 'Live Classes | e-MaziShaala'
  },
  {
    path: 'downloads',
    canActivate: [authGuard],
    loadComponent: () => import('./features/downloads/downloads.component').then(m => m.DownloadsComponent),
    title: 'Downloads & Study Notes | e-MaziShaala'
  },
  {
    path: 'standard/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/standards/standard-detail/standard-detail.component').then(m => m.StandardDetailComponent),
    title: 'Standard Hub | e-MaziShaala'
  },
  {
    path: 'standards/:id',
    redirectTo: 'standard/:id'
  },
  {
    path: 'courses/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/courses/course-detail/course-detail.component').then(m => m.CourseDetailComponent),
    title: 'Course Details | e-MaziShaala'
  },
  {
    path: 'books/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./features/books/book-detail/book-detail.component').then(m => m.BookDetailComponent),
    title: 'Book Details | e-MaziShaala'
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent),
    title: 'Student Profile | e-MaziShaala'
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent),
    title: 'Notifications | e-MaziShaala'
  },
  {
    path: '**',
    redirectTo: ''
  }
];
