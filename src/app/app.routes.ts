import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Authentication Routes (Lazy Loaded)
  {
    path: 'auth',
    loadComponent: () =>
      import('./core/layouts/auth-layout/auth-layout.component').then(
        (m) => m.AuthLayoutComponent
      ),
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/pages/login-page/login-page.component').then(
            (m) => m.LoginPageComponent
          ),
      },
      {
        path: 'register',
        loadComponent: () =>
          import(
            './features/auth/pages/register-page/register-page.component'
          ).then((m) => m.RegisterPageComponent),
      },
      {
        path: 'forget-password',
        loadComponent: () =>
          import(
            './features/auth/pages/forget-password-page/forget-password-page.component'
          ).then((m) => m.ForgetPasswordPageComponent),
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ],
  },

  // Main Application Routes (Lazy Loaded)
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/layouts/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent
      ),
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      {
        path: 'feed',
        loadChildren: () =>
          import('./features/feed/feed.routes').then((m) => m.FEED_ROUTES),
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./features/notifications/notifications.routes').then(
            (m) => m.Notifications_Routes
          ),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.routes').then((m) => m.Profile_Routes),
      }
    ],
  },

  // Not Found Page
  {
    path: 'not-found',
    loadComponent: () =>
      import(
        './features/static-pages/not-found/not-found.component'
      ).then((m) => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
