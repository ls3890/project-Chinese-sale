import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

 onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.isLoading = true;
  this.errorMessage = '';

  this.authService.login(this.loginForm.value).subscribe({
    next: (response: any) => {
      // הדפסה לדיבאג - תראי ב-Console מה השרת מחזיר בדיוק
      console.log('Login Response:', response);

      // 1. שמירת הנתונים ב-LocalStorage
      // ודאי שהשמות (token, role) תואמים למה שמופיע ב-Log שמעל
      if (response.token) {
        localStorage.setItem('token', response.token);
      }
      
      // כאן הקסם קורה - אנחנו שומרים את ה-role
      const userRole = response.role || response.userRole || 'Customer';
      localStorage.setItem('role', userRole);

      // 2. רק עכשיו עוברים לדף המתנות
      this.router.navigate(['/gifts']);
    },
    error: (error) => {
      this.errorMessage = error.error?.message || 'Login failed. Please try again.';
      this.isLoading = false;
    },
    complete: () => {
      this.isLoading = false;
    }
  });


    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.router.navigate(['/gifts']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${minLength} characters`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    return '';
  }
}
