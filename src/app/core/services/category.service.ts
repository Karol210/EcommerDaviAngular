import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Category } from '../models/category.model';
import { ApiResponse } from '../models/api-response.model';
import { StorageKeys } from '../enums/storage-keys.enum';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar categorías de productos.
 * Proporciona signals reactivos y métodos para consultar categorías desde el backend.
 */
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly categoriesState = signal<Category[]>([]);
  private readonly loadingState = signal(false);
  
  /** Signal reactivo con la lista de categorías */
  readonly categories = this.categoriesState.asReadonly();
  
  /** Signal reactivo que indica si las categorías están cargando */
  readonly loading = this.loadingState.asReadonly();

  constructor() {
    this.loadCategories();
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
   * Carga todas las categorías desde el backend.
   * Actualiza el estado del signal con las categorías obtenidas.
   */
  private loadCategories(): void {
    this.loadingState.set(true);
    
    this.listAllCategories().subscribe({
      next: (response) => {
        this.categoriesState.set(response.body);
        this.loadingState.set(false);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.categoriesState.set([]);
        this.loadingState.set(false);
      }
    });
  }

  /**
   * Lista todas las categorías del backend.
   * @returns Observable con la respuesta del backend
   */
  listAllCategories(): Observable<ApiResponse<Category[]>> {
    return this.http.get<ApiResponse<Category[]>>(
      `${environment.apiUrl}${ApiEndpoints.CATEGORIES_LIST_ALL}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error en listAllCategories:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Busca una categoría por su ID.
   * @param id - ID de la categoría a buscar
   * @returns Categoría encontrada o undefined
   */
  getCategoryById(id: number): Category | undefined {
    return this.categoriesState().find(cat => cat.id === id);
  }

  /**
   * Busca una categoría por su nombre.
   * @param name - Nombre de la categoría a buscar
   * @returns Categoría encontrada o undefined
   */
  getCategoryByName(name: string): Category | undefined {
    return this.categoriesState().find(cat => cat.name === name);
  }

  /**
   * Refresca la lista de categorías desde el backend.
   */
  refresh(): void {
    this.loadCategories();
  }
}

