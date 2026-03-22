import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { SignUp } from './features/auth/sign-up/sign-up';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth-guard';
import { Dashboard } from './features/dashboard/dashboard';
import { EventsPage } from './features/events/pages/events-page/events-page';
import { OrganizerRequestsPage } from './features/organizer-requests/pages/organizer-requests-page/organizer-requests-page';
import { ReportsPage } from './features/waste-report/pages/reports-page/reports-page';
import { roleGuard } from './core/guards/role-guard';
export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'forgot-password',
    component: ForgotPassword,
  },
  {
    path: 'sign-up',
    component: SignUp,
  },
  {
    path: '',
    component: DashboardLayout,
    // canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'find-events', component: EventsPage },
      {
        path: 'organizer-requests',
        component: OrganizerRequestsPage,
        // canActivate: [roleGuard],
        data: { roles: ['Admin'] },
      },

      {
        path: 'waste-reports',
        component: ReportsPage,
        canActivate: [roleGuard],
        data: { roles: ['Admin', 'Organizer'] },
      },
    ],
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
