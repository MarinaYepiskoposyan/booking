import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, NgIf, AsyncPipe],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="brand">
        <span class="brand-icon">B</span>
        Bookify
      </a>
      <div class="nav-links">
        <ng-container *ngIf="authService.currentUser$ | async as user; else guestLinks">
          <a routerLink="/profile" class="nav-link">
            <span class="avatar">{{ user.firstName.charAt(0) }}</span>
            {{ user.firstName }}
          </a>
          <a *ngIf="user.role === 'PROVIDER'" routerLink="/provider/setup" class="nav-link">My Business</a>
          <a *ngIf="user.role === 'PROVIDER'" routerLink="/provider/services" class="nav-link">Services</a>
          <button (click)="logout()" class="btn-logout">Logout</button>
        </ng-container>
        <ng-template #guestLinks>
          <a routerLink="/login" class="nav-link">Login</a>
          <a routerLink="/register" class="btn-register">Get Started</a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 60px;
      padding: 0 32px;
      background: #ffffff;
      border-bottom: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 20px;
      font-weight: 700;
      color: #4F46E5;
      text-decoration: none;
      letter-spacing: -0.3px;
    }

    .brand:hover {
      text-decoration: none;
      color: #4338CA;
    }

    .brand-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: #4F46E5;
      color: white;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 700;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      color: #6B7280;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      border-radius: 6px;
      transition: color 0.2s, background 0.2s;
      min-height: 44px;
    }

    .nav-link:hover {
      color: #4F46E5;
      background: #EEF2FF;
      text-decoration: none;
    }

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: #EEF2FF;
      color: #4F46E5;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 600;
    }

    .btn-logout {
      padding: 8px 16px;
      background: none;
      border: 1px solid #E5E7EB;
      border-radius: 6px;
      color: #6B7280;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: border-color 0.2s, color 0.2s, background 0.2s;
      min-height: 44px;
      margin-left: 8px;
    }

    .btn-logout:hover {
      border-color: #EF4444;
      color: #EF4444;
      background: #FEF2F2;
    }

    .btn-register {
      display: flex;
      align-items: center;
      padding: 8px 18px;
      background: #4F46E5;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;
      min-height: 44px;
      margin-left: 8px;
    }

    .btn-register:hover {
      background: #4338CA;
      text-decoration: none;
      color: white;
    }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}
  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
}
