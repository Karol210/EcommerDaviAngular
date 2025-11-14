import { Component, inject, viewChild, OnDestroy } from '@angular/core';
import { delay, switchMap, Subject, debounceTime } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../../core/services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { AuthModalComponent } from '../auth-modal/auth-modal.component';
import { CheckoutModalComponent } from '../checkout-modal/checkout-modal.component';
import { UserProfileModalComponent } from '../user-profile-modal/user-profile-modal.component';

/**
 * Header principal con navegación, carrito y autenticación.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    ButtonModule, 
    BadgeModule, 
    OverlayPanelModule,
    InputNumberModule,
    FormsModule,
    AuthModalComponent,
    CheckoutModalComponent,
    UserProfileModalComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnDestroy {
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);

  // Referencias a modales y componentes
  authModal = viewChild.required(AuthModalComponent);
  checkoutModal = viewChild.required(CheckoutModalComponent);
  profileModal = viewChild.required(UserProfileModalComponent);
  cartPanel = viewChild.required<OverlayPanel>('cartPanel');

  // Estado del carrito
  readonly cartItemsCount = this.cartService.totalItems;
  readonly cartItems = this.cartService.cartItems;
  readonly totalPrice = this.cartService.totalPrice;
  
  // Estado de autenticación
  readonly currentUser = this.authService.currentUser;
  readonly userProfile = this.authService.userProfile;
  readonly isAuthenticated = this.authService.isUserAuthenticated;

  // Subject para debounce de cambios de cantidad
  private quantityChange$ = new Subject<{ productId: number; quantity: number }>();

  constructor() {
    this.quantityChange$.pipe(
      debounceTime(800)
    ).subscribe(({ productId, quantity }) => {
      this.executeUpdateQuantity(productId, quantity);
    });
  }

  ngOnDestroy(): void {
    this.quantityChange$.complete();
  }

  // Abre el modal de login
  navigateToLogin(): void {
    this.authModal().show();
  }

  // Muestra el perfil del usuario
  openProfileModal(): void {
    this.profileModal().show();
  }

  // Cierra sesión y limpia el carrito
  logout(): void {
    this.authService.userLogout();
    this.cartService.clearCart();
  }

  // Abre/cierra el panel del carrito
  toggleCartPanel(event: Event): void {
    if (!this.isAuthenticated()) {
      this.authModal().show();
      return;
    }
    this.cartPanel().toggle(event);
  }

  // Elimina un producto del carrito
  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId).pipe(
      delay(1000),
      switchMap(() => this.cartService.getCartSummary())
    ).subscribe({
      next: (summaryResponse) => {
        this.cartService.updateCartState(summaryResponse.body);
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
      }
    });
  }

  // Actualiza la cantidad de un producto
  updateQuantity(productId: number, quantity: number): void {
    this.quantityChange$.next({ productId, quantity });
  }

  // Ejecuta la actualización de cantidad con debounce
  private executeUpdateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity).pipe(
      delay(1000),
      switchMap(() => this.cartService.getCartSummary())
    ).subscribe({
      next: (summaryResponse) => {
        this.cartService.updateCartState(summaryResponse.body);
      },
      error: (error) => {
        console.error('Error al actualizar cantidad:', error);
      }
    });
  }

  // Formatea precios en pesos colombianos
  formatPrice(price: number | undefined | null): string {
    if (price === undefined || price === null || isNaN(price)) {
      return '$0';
    }
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Procede al checkout
  proceedToCheckout(): void {
    this.cartPanel().hide();
    this.checkoutModal().show();
  }
}

