import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthInputComponent } from '../auth-input/auth-input.component';
import { AuthService } from '../../services/auth.service';
import { Stored_Keys } from '../../../../core/constants/stored-keys';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, RouterLink, AuthInputComponent],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onLogin(): void {
    // Mark all controls as touched to trigger validation display
    this.loginForm.markAllAsTouched();

    if (this.loginForm.invalid) {
      return;
    }

    // Clear messages and set loading
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    const payload = {
      email: this.loginForm.value.email!,
      password: this.loginForm.value.password!,
    };

    this.authService.login(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.errorMessage = '';
        this.successMessage = res?.message || 'Login successful!';

        // Store token
        if (res?.data?.token) {
          localStorage.setItem(Stored_Keys.TOKEN, res.data.token);
        }

        // Store user data for navbar, post ownership, etc.
        if (res?.data?.user) {
          localStorage.setItem(Stored_Keys.userData, JSON.stringify(res.data.user));
        }

        // Navigate to feed after short delay for UX
        setTimeout(() => {
          this.router.navigate(['/feed']);
        }, 500);
      },
      error: (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.successMessage = '';
        this.errorMessage =
          err.error?.error || err.error?.message || 'Login failed. Please check your credentials.';
      },
    });
  }
}
