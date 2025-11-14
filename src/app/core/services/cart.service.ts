import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product, CartItem } from '../models/product.model';
import { AddToCartRequest } from '../models/cart-request.model';
import { CartSummary, CartItemSummary } from '../models/cart-summary.model';
import { ApiResponse } from '../models/api-response.model';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar el carrito de compras del usuario.
 * Funciona completamente con el backend.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  
  private readonly cartSummaryState = signal<CartSummary | null>(null);
  
  /**
   * Items del carrito mapeados desde el resumen del backend.
   */
  readonly cartItems = computed(() => {
    const summary = this.cartSummaryState();
    if (!summary || summary.empty) {
      return [];
    }
    return this.mapSummaryToCartItems(summary.items);
  });
  
  /**
   * Total de items en el carrito.
   */
  readonly totalItems = computed(() => {
    const summary = this.cartSummaryState();
    return summary?.totalItems ?? 0;
  });
  
  /**
   * Precio total del carrito en pesos colombianos (COP).
   */
  readonly totalPrice = computed(() => {
    const summary = this.cartSummaryState();
    return summary?.totalPrice ?? 0;
  });

  constructor() {
    this.loadCartFromBackend();
  }

  /**
   * Mapea items del resumen del backend a CartItem[] para compatibilidad.
   */
  private mapSummaryToCartItems(items: CartItemSummary[]): CartItem[] {
    return items.map(item => ({
      id: item.id, // ID del item en el carrito
      product: {
        id: item.productId ?? 0, // ID del producto
        name: item.productName,
        description: item.productDescription,
        categoryName: '',
        categoryDescription: '',
        unitPrice: item.calculation.unitValue,
        taxRate: item.calculation.ivaPercentage,
        taxAmount: item.calculation.ivaAmount,
        totalPrice: item.calculation.totalPrice,
        imageUrl: item.imageUrl,
        active: true
      },
      quantity: item.calculation.quantity
    }));
  }

  /**
   * Genera los headers necesarios para las peticiones HTTP.
   * Incluye Content-Type y Authorization si existe token en sesión.
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const token = this.authService.getUserToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Carga el carrito desde el backend si el usuario está autenticado.
   */
  private loadCartFromBackend(): void {
    if (this.authService.isUserAuthenticated()) {
      this.getCartSummary().subscribe({
        next: (response) => {
          this.cartSummaryState.set(response.body);
        },
        error: (error) => {
          console.error('Error al cargar carrito:', error);
          this.cartSummaryState.set(null);
        }
      });
    }
  }

  /**
   * Obtiene el resumen completo del carrito desde el backend.
   * Incluye items, cálculos y totales.
   * @returns Observable con el resumen del carrito
   */
  getCartSummary(): Observable<ApiResponse<CartSummary>> {
    return this.http.get<ApiResponse<CartSummary>>(
      `${environment.apiUrl}${ApiEndpoints.CART_SUMMARY}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error al obtener resumen del carrito:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Agrega un producto al carrito en el backend.
   * NO recarga automáticamente el carrito.
   * 
   * @param product - Producto a agregar
   * @param quantity - Cantidad a agregar (default: 1)
   * @returns Observable con la respuesta del backend
   */
  addToCart(product: Product, quantity: number = 1): Observable<ApiResponse<string>> {
    const request: AddToCartRequest = {
      productId: product.id,
      quantity: quantity
    };

    return this.http.post<ApiResponse<string>>(
      `${environment.apiUrl}${ApiEndpoints.CART_ADD}`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error al agregar al carrito:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza la cantidad de un producto en el carrito del backend.
   * Nota: Usa el endpoint de agregar para actualizar la cantidad.
   * 
   * @param productId - ID del producto
   * @param quantity - Nueva cantidad
   * @returns Observable con la respuesta del backend
   */
  updateQuantity(productId: number, quantity: number): Observable<ApiResponse<string>> {
    if (quantity <= 0) {
      console.error('No se puede eliminar con updateQuantity, usar removeFromCart');
      return throwError(() => new Error('Cantidad inválida'));
    }

    const request: AddToCartRequest = {
      productId: productId,
      quantity: quantity
    };

    return this.http.post<ApiResponse<string>>(
      `${environment.apiUrl}${ApiEndpoints.CART_ADD}`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error al actualizar cantidad:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza el estado del carrito con un resumen del backend.
   * @param summary - Resumen del carrito
   */
  updateCartState(summary: CartSummary): void {
    this.cartSummaryState.set(summary);
  }

  /**
   * Elimina un producto del carrito en el backend.
   * NO recarga automáticamente el carrito.
   * 
   * @param productId - ID del producto a eliminar
   * @returns Observable con la respuesta del backend
   */
  removeFromCart(productId: number): Observable<ApiResponse<string>> {
    return this.http.delete<ApiResponse<string>>(
      `${environment.apiUrl}${ApiEndpoints.CART_REMOVE}/${productId}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error al eliminar del carrito:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Recarga el carrito desde el backend.
   * Útil para refrescar después de operaciones externas.
   */
  refreshCart(): void {
    this.loadCartFromBackend();
  }

  /**
   * Limpia el estado del carrito localmente.
   * Se llama al cerrar sesión.
   */
  clearCart(): void {
    this.cartSummaryState.set(null);
  }
}

