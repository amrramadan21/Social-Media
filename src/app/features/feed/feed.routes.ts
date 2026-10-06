import { Routes } from '@angular/router';

export const FEED_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/feed-page/feed-page.component').then(
        (m) => m.FeedPageComponent
      ),
  },
  {
    path: 'community',
    loadComponent: () =>
      import('./pages/feed-page/feed-page.component').then(
        (m) => m.FeedPageComponent
      ),
  },
  {
    path: 'suggested-friends',
    loadComponent: () =>
      import('./pages/all-suggested-friends/all-suggested-friends.component').then(
        (m) => m.AllSuggestedFriendsComponent
      ),
  }
];