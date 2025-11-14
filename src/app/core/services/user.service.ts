import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { RegisterRequest, RegisterResponse } from '../models/register.model';
import { UserResponse } from '../models/user-response';
import { ApiResponse } from '../models/api-response.model';
import { StorageKeys } from '../enums/storage-keys.enum';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar operaciones de usuarios.
 * Proporciona métodos para registro, consulta y gestión de usuarios.
 */
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  /**
   * Genera los headers necesarios para las peticiones HTTP.
   * Incluye token de autenticación si está disponible.
   * @returns HttpHeaders configurados
   */
  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const token = this.storage.getItem<string>(StorageKeys.ADMIN_TOKEN);
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  /**
   * Registra un nuevo usuario en el sistema.
   * @param request - Datos del usuario a registrar
   * @returns Observable con la respuesta del registro
   */
  register(request: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(
      `${environment.apiUrl}${ApiEndpoints.USERS_CREATE}`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error en registro de usuario:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Obtiene todos los usuarios del sistema.
   * Requiere autenticación de administrador.
   * @returns Observable con la lista completa de usuarios
   */
  getAllUsers(): Observable<ApiResponse<UserResponse[]>> {
    return this.http.get<ApiResponse<UserResponse[]>>(
      `${environment.apiUrl}${ApiEndpoints.USERS_ALL}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error al obtener usuarios:', error);
        return throwError(() => error);
      })
    );
  }
}

