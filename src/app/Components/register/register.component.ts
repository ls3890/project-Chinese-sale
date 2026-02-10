import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/AuthService';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      address: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        alert('נרשמת בהצלחה!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.errorMessage = error.error?.message || error.error || 'Registration failed';
        this.isLoading = false;
      }
    });
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control?.hasError('required')) return 'שדה חובה';
    if (control?.hasError('minlength')) return 'קצר מדי';
    if (control?.hasError('email')) return 'אימייל לא תקין';
    if (control?.hasError('pattern')) return 'מספרים בלבד';
    return '';
  }
  onlogout(){
    this.authService.logout();
  }
}