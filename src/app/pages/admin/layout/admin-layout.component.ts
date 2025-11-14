import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuModule } from 'primeng/menu';
import { AvatarModule } from 'primeng/avatar';
import { MenuItem } from 'primeng/api';
import { AuthService } from '../../../core/services/auth.service';

/**
 * Layout con sidebar y navegación para el área de administración.
 */
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    MenuModule,
    AvatarModule
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
  private readonly authService = inject(AuthService);

  // Usuario y menú de navegación
  readonly adminUser = this.authService.adminUser;
  readonly menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      routerLink: ['/admin/dashboard']
    },
    {
      label: 'Productos',
      icon: 'pi pi-box',
      routerLink: ['/admin/products']
    },
    {
      label: 'Usuarios',
      icon: 'pi pi-users',
      routerLink: ['/admin/users']
    },
    {
      label: 'Pedidos',
      icon: 'pi pi-shopping-bag',
      routerLink: ['/admin/orders']
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  // Cierra sesión del administrador
  logout(): void {
    this.authService.adminLogout();
  }
}

