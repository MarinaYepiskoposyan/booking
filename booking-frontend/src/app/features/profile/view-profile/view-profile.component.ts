import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-view-profile',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './view-profile.component.html',
  styles: [`
    .page-wrapper {
      max-width: 680px;
      margin: 0 auto;
    }

    /* Loading / skeleton */
    .loading-state {
      display: flex;
      align-items: center;
      gap: 24px;
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      padding: 32px;
      animation: pulse 1.5s ease-in-out infinite;
    }

    .skeleton-avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #E5E7EB;
      flex-shrink: 0;
    }

    .skeleton-lines {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;
    }

    .skeleton-line {
      height: 14px;
      background: #E5E7EB;
      border-radius: 6px;
    }

    .skeleton-line.wide   { width: 60%; }
    .skeleton-line.medium { width: 40%; }
    .skeleton-line.narrow { width: 25%; }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.5; }
    }

    /* Profile card */
    .profile-card {
      background: #ffffff;
      border-radius: 12px;
      border: 1px solid #E5E7EB;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 20px;
      padding: 32px;
    }

    .avatar-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4F46E5, #7C3AED);
      color: white;
      font-size: 22px;
      font-weight: 700;
      flex-shrink: 0;
      letter-spacing: 1px;
    }

    .header-info {
      flex: 1;
    }

    .user-name {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 8px;
    }

    .role-badge {
      display: inline-block;
      padding: 3px 10px;
      background: #EEF2FF;
      color: #4F46E5;
      border-radius: 100px;
      font-size: 12px;
      font-weight: 500;
    }

    .role-badge.role-provider {
      background: #F3E8FF;
      color: #7C3AED;
    }

    .btn-edit {
      padding: 9px 18px;
      background: #4F46E5;
      color: white;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.2s;
      min-height: 44px;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }

    .btn-edit:hover {
      background: #4338CA;
      text-decoration: none;
      color: white;
    }

    .divider {
      height: 1px;
      background: #E5E7EB;
    }

    .fields-grid {
      padding: 24px 32px;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .field-row {
      display: grid;
      grid-template-columns: 160px 1fr;
      align-items: center;
      padding: 14px 0;
      border-bottom: 1px solid #F3F4F6;
    }

    .field-row:last-child {
      border-bottom: none;
    }

    .field-label {
      font-size: 13px;
      font-weight: 500;
      color: #6B7280;
    }

    .field-value {
      font-size: 15px;
      color: #111827;
      font-weight: 400;
    }

    .field-value.muted {
      color: #9CA3AF;
      font-style: italic;
    }

    .provider-actions {
      /* wrapper for provider-only section */
    }

    .quick-links {
      display: flex;
      gap: 12px;
      padding: 20px 32px;
      flex-wrap: wrap;
    }

    .quick-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 18px;
      background: #EEF2FF;
      color: #4F46E5;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 500;
      text-decoration: none;
      transition: background 0.2s, color 0.2s;
      min-height: 44px;
    }

    .quick-link:hover {
      background: #4F46E5;
      color: white;
      text-decoration: none;
    }

    .ql-icon {
      font-size: 16px;
    }

    @media (max-width: 600px) {
      .card-header {
        flex-wrap: wrap;
        padding: 24px;
      }
      .btn-edit {
        width: 100%;
        justify-content: center;
      }
      .fields-grid {
        padding: 16px 24px;
      }
      .field-row {
        grid-template-columns: 1fr;
        gap: 4px;
      }
      .quick-links {
        padding: 16px 24px;
      }
    }
  `]
})
export class ViewProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.userService.getProfile().subscribe(user => this.user = user);
  }
}
