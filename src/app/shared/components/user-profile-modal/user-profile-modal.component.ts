import { Component, signal, inject } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Modal con información completa del perfil de usuario.
 */
@Component({
  selector: 'app-user-profile-modal',
  standalone: true,
  imports: [DialogModule, ButtonModule],
  templateUrl: './user-profile-modal.component.html',
  styleUrl: './user-profile-modal.component.scss'
})
export class UserProfileModalComponent {
  private readonly authService = inject(AuthService);

  // Estado del modal
  visible = signal(false);
  readonly userProfile = this.authService.userProfile;

  // Abre el modal
  show(): void {
    this.visible.set(true);
  }

  // Cierra el modal
  hide(): void {
    this.visible.set(false);
  }
}

