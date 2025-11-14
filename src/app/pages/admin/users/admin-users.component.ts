import { Component, inject, signal, computed, type OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { UserService } from '../../../core/services/user.service';
import { DocumentTypeService } from '../../../core/services/document-type.service';
import { UserResponse } from '../../../core/models/user-response';

/**
 * Componente de administración de usuarios.
 * Permite visualizar, editar y activar/desactivar usuarios del sistema.
 */
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    DropdownModule,
    TableModule,
    TooltipModule,
    ConfirmDialogModule
  ],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.scss'
})
export class AdminUsersComponent implements OnInit {
  private readonly userService = inject(UserService);
  private readonly documentTypeService = inject(DocumentTypeService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly fb = inject(FormBuilder);
  
  // Estado de usuarios
  readonly users = signal<UserResponse[]>([]);
  readonly loading = signal(false);
  
  // Modal de edición
  readonly showEditModal = signal(false);
  readonly submitting = signal(false);
  
  // Tipos de documentos
  readonly documentTypes = this.documentTypeService.documentTypes;
  readonly loadingDocumentTypes = this.documentTypeService.loading;
  
  // Usuario seleccionado para editar
  private selectedUser: UserResponse | null = null;
  
  // Formulario de edición
  readonly editForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    tipoDocumento: ['', [Validators.required]],
    numeroDocumento: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]]
  });

  ngOnInit(): void {
    this.loadUsers();
  }

  // Carga todos los usuarios desde el backend
  loadUsers(): void {
    this.loading.set(true);
    
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (!response.failure && response.body) {
          this.users.set(response.body);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.loading.set(false);
        
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios. Intenta nuevamente.',
          life: 5000
        });
      }
    });
  }

  // Refresca la lista de usuarios
  refreshUsers(): void {
    this.loadUsers();
  }

  // Obtiene la clase CSS del estado del usuario
  getStatusClass(user: UserResponse): string {
    return user.status === 'Activo' ? 'status-active' : 'status-inactive';
  }

  // Formatea los roles como string
  formatRoles(roles: string[]): string {
    return roles.join(', ');
  }

  // Abre el modal de edición con los datos del usuario
  editUser(user: UserResponse): void {
    this.selectedUser = user;
    
    this.editForm.patchValue({
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      tipoDocumento: user.documentType,
      numeroDocumento: user.documentNumber
    });
    
    this.showEditModal.set(true);
  }

  // Cierra el modal de edición
  closeEditModal(): void {
    this.showEditModal.set(false);
    this.editForm.reset();
    this.selectedUser = null;
  }

  // Guarda los cambios del usuario
  onEditSubmit(): void {
    if (this.editForm.invalid || !this.selectedUser) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);

    // TODO: Implementar actualización real con el backend
    setTimeout(() => {
      this.submitting.set(false);
      this.messageService.add({
        severity: 'success',
        summary: 'Usuario actualizado',
        detail: `Los datos de ${this.selectedUser?.nombre} ${this.selectedUser?.apellido} han sido actualizados`,
        life: 3000
      });
      this.closeEditModal();
      this.refreshUsers();
    }, 1000);
  }

  // Activa o desactiva un usuario
  toggleUserStatus(user: UserResponse): void {
    const action = user.status === 'Activo' ? 'desactivar' : 'activar';
    
    this.confirmationService.confirm({
      message: `¿Deseas ${action} al usuario "${user.nombre} ${user.apellido}"?`,
      header: `Confirmar ${action}ción`,
      icon: 'pi pi-question-circle',
      acceptLabel: `Sí, ${action}`,
      rejectLabel: 'Cancelar',
      accept: () => {
        // TODO: Implementar toggle real
        this.messageService.add({
          severity: 'success',
          summary: 'Estado actualizado',
          detail: `El usuario "${user.nombre} ${user.apellido}" ha sido ${action === 'activar' ? 'activado' : 'desactivado'}`,
          life: 3000
        });
        this.refreshUsers();
      }
    });
  }
}

