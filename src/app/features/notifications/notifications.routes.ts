import { Routes } from "@angular/router";

export const Notifications_Routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/notifications-page/notifications-page.component').then(
                (m) => m.NotificationsPageComponent
            ),
    },
];