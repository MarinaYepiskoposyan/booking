import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './edit-profile.component.html'
})
export class EditProfileComponent implements OnInit {
  form!: FormGroup;
  success = false;
  error = '';

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['']
    });
    this.userService.getProfile().subscribe(user => this.form.patchValue(user));
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.userService.updateProfile(this.form.value).subscribe({
      next: () => { this.success = true; setTimeout(() => this.router.navigate(['/profile']), 1500); },
      error: () => { this.error = 'Update failed. Please try again.'; }
    });
  }
}
