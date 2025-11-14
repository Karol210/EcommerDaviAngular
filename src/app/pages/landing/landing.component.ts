import { Component, inject, viewChild } from '@angular/core';
import { delay, switchMap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { Messages, MessageTitles } from '../../shared/constants/messages.constants';

/**
 * Página principal con catálogo de productos.
 */
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    SkeletonModule,
    HeaderComponent
  ],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly authService = inject(AuthService);
  private readonly messageService = inject(MessageService);

  // Referencia al header
  headerComponent = viewChild.required(HeaderComponent);
  
  // Estado de productos
  readonly products = this.productService.products;
  readonly loading = this.productService.loading;

  // Agrega un producto al carrito
  addToCart(product: Product): void {
    if (!this.authService.isUserAuthenticated()) {
      this.headerComponent().navigateToLogin();
      return;
    }

    this.cartService.addToCart(product, 1).pipe(
      delay(1000),
      switchMap(() => this.cartService.getCartSummary())
    ).subscribe({
      next: (summaryResponse) => {
        this.cartService.updateCartState(summaryResponse.body);
        
        this.messageService.add({
          severity: 'success',
          summary: MessageTitles.SUCCESS,
          detail: `${product.name} ${Messages.SUCCESS.PRODUCT_ADDED}`,
          life: 3000
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: MessageTitles.ERROR,
          detail: Messages.ERROR.ADD_TO_CART_FAILED,
          life: 3000
        });
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
      minimumFractionDigits: 0
    }).format(price);
  }
}

