import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { AuthService } from '../../../core/services/auth.service';
import { AppRoutes } from '../../../core/enums/app-routes.enum';
import { LoginCredentials } from '../../../core/models/user.model';
import { Messages, MessageTitles } from '../../../shared/constants/messages.constants';

/**
 * Login de administrador.
 */
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    CardModule,
    ToastModule
  ],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.scss'
})
export class AdminLoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly messageService = inject(MessageService);

  // Estado del formulario
  readonly loading = signal(false);
  readonly loginForm = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Procesa el login del administrador
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading.set(true);

    const credentials = this.loginForm.value as LoginCredentials;
    
    this.authService.adminLogin(credentials).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: MessageTitles.SUCCESS,
          detail: Messages.SUCCESS.LOGIN_SUCCESS
        });
        
        setTimeout(() => {
          this.router.navigate([AppRoutes.ADMIN_DASHBOARD]);
        }, 500);
      },
      error: (error) => {
        this.loading.set(false);
        const errorMessage = error.error?.message || Messages.ERROR.INVALID_CREDENTIALS;
        this.messageService.add({
          severity: 'error',
          summary: MessageTitles.ERROR,
          detail: errorMessage
        });
      }
    });
  }

  // Marca todos los campos como tocados
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}

