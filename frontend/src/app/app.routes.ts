import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: '',
    loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'matches',
        loadComponent: () => import('./components/matches/matches.component').then(m => m.MatchesComponent),
        canActivate: [roleGuard],
        data: { role: 'BETTER' }
      },
      {
        path: 'users',
        loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
        canActivate: [roleGuard],
        data: { role: 'ADMIN' }
      },
      {
        path: 'add-match',
        loadComponent: () => import('./components/add-match/add-match.component').then(m => m.AddMatchComponent),
        canActivate: [roleGuard],
        data: { role: 'ADMIN' }
      }
    ]
  }
];
