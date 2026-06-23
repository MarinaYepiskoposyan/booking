import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { providerGuard } from './core/guards/provider.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/profile/view-profile/view-profile.component').then(m => m.ViewProfileComponent)
      },
      {
        path: 'edit',
        loadComponent: () => import('./features/profile/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
      }
    ]
  },
  {
    path: 'provider',
    canActivate: [authGuard, providerGuard],
    children: [
      {
        path: 'setup',
        loadComponent: () => import('./features/provider/business-profile/business-profile.component').then(m => m.BusinessProfileComponent)
      },
      {
        path: 'services',
        loadComponent: () => import('./features/provider/services/service-list/service-list.component').then(m => m.ServiceListComponent)
      },
      {
        path: 'services/add',
        loadComponent: () => import('./features/provider/services/add-service/add-service.component').then(m => m.AddServiceComponent)
      },
      {
        path: 'services/:id/edit',
        loadComponent: () => import('./features/provider/services/edit-service/edit-service.component').then(m => m.EditServiceComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/login' }
];
