import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { BetConfirmationComponent } from './components/bet-confirmation/bet-confirmation.component';

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
      },
      {
        path: 'deposit',
        loadComponent: () => import('./components/deposit/deposit.component').then(m => m.DepositComponent),
        canActivate: [roleGuard],
        data: { role: 'BETTER' }
      },
      {
        path: 'retrieval',
        loadComponent: () => import('./components/retrieval/retrieval.component').then(m => m.RetrievalComponent),
        canActivate: [roleGuard],
        data: { role: 'BETTER' }
      },
      {
        path: 'bet-confirmation',
        loadComponent: () => import('./components/bet-confirmation/bet-confirmation.component').then(m => m.BetConfirmationComponent),
        canActivate: [roleGuard],
        data: { role: 'BETTER' }
      }
    ]
  },
];
