import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';
import { SignUp } from './features/auth/sign-up/sign-up';
import { DashboardLayout } from './layouts/dashboard-layout/dashboard-layout';
import { authGuard } from './core/guards/auth-guard';
import { Dashboard } from './features/dashboard/dashboard';

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
      { path: 'dashboard', component: Dashboard},
    ]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
