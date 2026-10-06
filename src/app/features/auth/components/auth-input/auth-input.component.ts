import { Component, input, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-input',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-input.component.html',
  styleUrl: './auth-input.component.css',
})
export class AuthInputComponent {
  /** The reactive form control to bind */
  control = input.required<FormControl>();

  /** Input type: text, email, password, date */
  type = input<string>('text');

  /** Placeholder text */
  placeholder = input<string>('');

  /** Font Awesome icon classes (e.g. 'fa-regular fa-user') */
  icon = input<string>('');

  /** Unique HTML id for the input */
  inputId = input<string>('');

  /** Whether to show the password visibility toggle */
  showToggle = input<boolean>(false);

  /** Internal state for toggling password visibility */
  passwordVisible = signal(false);

  /** Get the effective input type (handles password toggle) */
  get effectiveType(): string {
    if (this.showToggle() && this.passwordVisible()) {
      return 'text';
    }
    return this.type();
  }

  /** Toggle password visibility */
  togglePassword(): void {
    this.passwordVisible.update((v) => !v);
  }

  /** Check if the control is touched and invalid */
  get isInvalid(): boolean {
    const ctrl = this.control();
    return ctrl.touched && ctrl.invalid;
  }

  /** Check if the control is touched and valid */
  get isValid(): boolean {
    const ctrl = this.control();
    return ctrl.touched && ctrl.valid;
  }

  /** Get the first error message for the control */
  get errorMessage(): string {
    const ctrl = this.control();
    if (!ctrl.errors) return '';

    if (ctrl.errors['required']) {
      return `${this.placeholder() || 'This field'} is required`;
    }
    if (ctrl.errors['email']) {
      return 'Please enter a valid email address';
    }
    if (ctrl.errors['minlength']) {
      const min = ctrl.errors['minlength'].requiredLength;
      return `Must be at least ${min} characters`;
    }
    if (ctrl.errors['pattern']) {
      return 'Must include uppercase, lowercase, digit & special character';
    }
    if (ctrl.errors['passwordMismatch']) {
      return 'Passwords do not match';
    }

    return 'Invalid value';
  }
}
