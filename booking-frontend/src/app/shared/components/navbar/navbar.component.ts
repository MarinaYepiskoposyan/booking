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
      <a routerLink="/" class="brand">BookEase</a>
      <div class="nav-links">
        <ng-container *ngIf="authService.currentUser$ | async as user; else guestLinks">
          <a routerLink="/profile">{{ user.firstName }}</a>
          <a *ngIf="user.role === 'PROVIDER'" routerLink="/provider/setup">My Business</a>
          <a *ngIf="user.role === 'PROVIDER'" routerLink="/provider/services">Services</a>
          <button (click)="logout()">Logout</button>
        </ng-container>
        <ng-template #guestLinks>
          <a routerLink="/login">Login</a>
          <a routerLink="/register">Register</a>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    .navbar { display:flex; justify-content:space-between; align-items:center;
              padding:12px 24px; background:#1976d2; color:#fff; }
    .brand { color:#fff; text-decoration:none; font-size:1.4rem; font-weight:700; }
    .nav-links a, .nav-links button { color:#fff; text-decoration:none; margin-left:16px;
                                       background:none; border:none; cursor:pointer; font-size:1rem; }
    .nav-links a:hover, .nav-links button:hover { text-decoration:underline; }
  `]
})
export class NavbarComponent {
  constructor(public authService: AuthService, private router: Router) {}
  logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
}
