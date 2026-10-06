import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Stored_Keys } from '../../../../core/constants/stored-keys';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthInputComponent } from '../auth-input/auth-input.component';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, AuthInputComponent],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl('', [Validators.required]),
    dateOfBirth: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  /** Custom cross-field validator used by template to show error messages */
  get passwordMismatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return !!confirmPassword && password !== confirmPassword;
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.getRawValue();
      const password = formValue.password ?? '';
      const confirmPassword = formValue.confirmPassword ?? '';

      if (password !== confirmPassword) {
        console.error('Passwords do not match');
        return;
      }

      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      // Map the form controls to the actual API interface requirements
      const payload = {
        name: formValue.name ?? '',
        username: formValue.username ?? '', // Map to exactly 'username' for API
        email: formValue.email ?? '',
        password: password,
        rePassword: confirmPassword, // Map confirmPassword -> rePassword
        dateOfBirth: formValue.dateOfBirth ?? '',
        gender: formValue.gender ?? '',
      };

      this.authService.register(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Account created successfully!';
          this.errorMessage = '';
          console.log('Register submitted:', payload);

          // Storing the original form value locally as you requested
          localStorage.setItem(Stored_Keys.userData, JSON.stringify(this.registerForm.value));
          setTimeout(() => this.router.navigate(['/auth/login']), 1000);
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          this.errorMessage = error.error?.error || error.error?.message || 'Registration failed.';
          console.error('Register failed:', error);
        }
      });
    }
  }
}
