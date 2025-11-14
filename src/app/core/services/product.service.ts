import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { Product } from '../models/product.model';
import { ProductResponse } from '../models/product-response';
import { ProductRequest } from '../models/product-request';
import { ProductUpdateRequest } from '../models/product-update-request';
import { ApiResponse } from '../models/api-response.model';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { StorageKeys } from '../enums/storage-keys.enum';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar productos de la tienda.
 * Proporciona signals reactivos y métodos para consultar productos desde el backend.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly productsState = signal<Product[]>([]);
  private readonly loadingState = signal(false);
  private readonly baseUrl = `${environment.apiUrl}/api/v1/products`;
  
  /** Signal reactivo con la lista de productos */
  readonly products = this.productsState.asReadonly();
  
  /** Signal reactivo que indica si los productos están cargando */
  readonly loading = this.loadingState.asReadonly();

  constructor() {
    this.loadProducts();
  }

  /**
   * Genera los headers necesarios para las peticiones HTTP.
   * Incluye Content-Type y Authorization si existe token en sesión.
   * @returns HttpHeaders configurados
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    // Obtener el token del storage service
    const token = this.storage.getItem<string>(StorageKeys.ADMIN_TOKEN);
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Mapea un ProductResponse del backend a un Product para uso interno.
   * @param response - Respuesta del backend
   * @returns Producto mapeado para la aplicación
   */
  private mapProductResponseToProduct(response: ProductResponse): Product {
    return {
      id: response.id ?? 0,
      name: response.name ?? '',
      description: response.description ?? '',
      categoryName: response.categoryName ?? '',
      categoryDescription: response.categoryDescription,
      categoryId: response.categoryId,
      unitPrice: response.unitValue ?? 0,
      unitValue: response.unitValue ?? 0,
      taxRate: response.iva ?? 0,
      iva: response.iva ?? 0,
      taxAmount: response.ivaAmount ?? 0,
      ivaAmount: response.ivaAmount ?? 0,
      totalPrice: response.totalPrice ?? 0,
      imageUrl: response.imageUrl,
      active: response.active ?? false,
      estadoProductoId: response.estadoProductoId,
      stock: response.stock,
      createdAt: response.createdAt
    };
  }

  /**
   * Carga todos los productos desde el backend.
   * Actualiza el estado del signal con los productos obtenidos.
   */
  private loadProducts(): void {
    this.loadingState.set(true);
    
    this.listAllProducts().subscribe({
      next: (response) => {
        const products = response.body.map(pr => this.mapProductResponseToProduct(pr));
        this.productsState.set(products);
        this.loadingState.set(false);
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.productsState.set([]);
        this.loadingState.set(false);
      }
    });
  }

  /**
   * Lista todos los productos activos del backend (para clientes en landing).
   * @returns Observable con la respuesta del backend
   */
  listAllProducts(): Observable<ApiResponse<ProductResponse[]>> {
    return this.http.get<ApiResponse<ProductResponse[]>>(
      `${environment.apiUrl}${ApiEndpoints.PRODUCTS_LIST_ACTIVE}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error en listAllProducts:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Lista TODOS los productos del backend (activos e inactivos) para administración.
   * @returns Observable con la respuesta del backend
   */
  listAll(): Observable<ApiResponse<ProductResponse[]>> {
    return this.http.get<ApiResponse<ProductResponse[]>>(
      `${environment.apiUrl}${ApiEndpoints.PRODUCTS_LIST_ALL}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error en listAll:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Busca un producto por su ID.
   * @param id - ID del producto a buscar
   * @returns Producto encontrado o undefined
   */
  getProductById(id: number): Product | undefined {
    return this.productsState().find(p => p.id === id);
  }

  /**
   * Busca un producto por su nombre.
   * @param name - Nombre del producto a buscar
   * @returns Producto encontrado o undefined
   */
  getProductByName(name: string): Product | undefined {
    return this.productsState().find(p => p.name === name);
  }

  /**
   * Obtiene solo los productos activos.
   * @returns Array de productos con active = true
   */
  getActiveProducts(): Product[] {
    return this.productsState().filter(p => p.active);
  }

  /**
   * Filtra productos por categoría.
   * @param categoryName - Nombre de la categoría
   * @returns Array de productos de la categoría especificada
   */
  getProductsByCategory(categoryName: string): Product[] {
    return this.productsState().filter(p => p.categoryName === categoryName);
  }

  /**
   * Obtiene productos inactivos.
   * @returns Array de productos con active = false
   */
  getInactiveProducts(): Product[] {
    return this.productsState().filter(p => !p.active);
  }

  /**
   * Obtiene productos con stock bajo (menor a 10 unidades).
   * @param threshold - Umbral de stock bajo (por defecto 10)
   * @returns Array de productos con stock bajo o sin stock
   */
  getLowStockProducts(threshold: number = 10): Product[] {
    return this.productsState().filter(p => 
      p.stock !== undefined && p.stock < threshold
    );
  }

  /**
   * Obtiene productos próximos a acabarse o inactivos.
   * Incluye productos con stock bajo (< 10) y productos inactivos.
   * @returns Array de productos con problemas de disponibilidad
   */
  getProblemsProducts(): Product[] {
    return this.productsState().filter(p => 
      !p.active || (p.stock !== undefined && p.stock < 10)
    );
  }

  /**
   * Obtiene productos disponibles y con stock adecuado.
   * @returns Array de productos activos con stock >= 10 o sin gestión de stock
   */
  getAvailableProducts(): Product[] {
    return this.productsState().filter(p => 
      p.active && (p.stock === undefined || p.stock >= 10)
    );
  }

  /**
   * Refresca la lista de productos forzando una nueva carga desde el backend.
   */
  refreshProducts(): void {
    this.loadProducts();
  }

  /**
   * Carga TODOS los productos (activos e inactivos) para el panel de administración.
   * Actualiza el estado del signal con todos los productos obtenidos.
   */
  loadAllProductsForAdmin(): void {
    this.loadingState.set(true);
    
    this.listAll().subscribe({
      next: (response) => {
        const products = response.body.map(pr => this.mapProductResponseToProduct(pr));
        this.productsState.set(products);
        this.loadingState.set(false);
      },
      error: (error) => {
        console.error('Error al cargar todos los productos:', error);
        this.productsState.set([]);
        this.loadingState.set(false);
      }
    });
  }

  /**
   * Refresca todos los productos (para admin) forzando una nueva carga desde el backend.
   */
  refreshAllProducts(): void {
    this.loadAllProductsForAdmin();
  }

  /**
   * Crea un nuevo producto en el sistema.
   * @param request - Datos del producto a crear
   * @returns Observable con la respuesta del backend
   */
  create(request: ProductRequest): Observable<ApiResponse<null>> {
    return this.http.post<ApiResponse<null>>(
      `${environment.apiUrl}${ApiEndpoints.PRODUCTS_CREATE}`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        // Recargar productos después de crear uno nuevo
        this.refreshProducts();
      }),
      catchError(error => {
        console.error('Error en create:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Actualiza el estado de un producto existente.
   * @param id - ID del producto a actualizar
   * @param request - Datos de actualización (estado del producto)
   * @returns Observable con la respuesta del backend
   */
  update(id: number, request: ProductUpdateRequest): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${this.baseUrl}/update/${id}`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        // Recargar productos después de actualizar
        this.refreshProducts();
      }),
      catchError(error => {
        console.error('Error en update:', error);
        return throwError(() => error);
      })
    );
  }
}

