import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { DocumentType } from '../models/document-type.model';
import { ApiResponse } from '../models/api-response.model';
import { StorageKeys } from '../enums/storage-keys.enum';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar tipos de documentos.
 * Proporciona signals reactivos y métodos para consultar tipos de documentos desde el backend.
 */
@Injectable({
  providedIn: 'root'
})
export class DocumentTypeService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly documentTypesState = signal<DocumentType[]>([]);
  private readonly loadingState = signal(false);
  
  /** Signal reactivo con la lista de tipos de documentos */
  readonly documentTypes = this.documentTypesState.asReadonly();
  
  /** Signal reactivo que indica si los tipos de documentos están cargando */
  readonly loading = this.loadingState.asReadonly();

  constructor() {
    this.loadDocumentTypes();
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
   * Carga todos los tipos de documentos desde el backend.
   * Actualiza el estado del signal con los tipos de documentos obtenidos.
   */
  private loadDocumentTypes(): void {
    this.loadingState.set(true);
    
    this.listAllDocumentTypes().subscribe({
      next: (response) => {
        this.documentTypesState.set(response.body);
        this.loadingState.set(false);
      },
      error: (error) => {
        console.error('Error al cargar tipos de documentos:', error);
        this.documentTypesState.set([]);
        this.loadingState.set(false);
      }
    });
  }

  /**
   * Lista todos los tipos de documentos del backend.
   * @returns Observable con la respuesta del backend
   */
  listAllDocumentTypes(): Observable<ApiResponse<DocumentType[]>> {
    return this.http.get<ApiResponse<DocumentType[]>>(
      `${environment.apiUrl}${ApiEndpoints.DOCUMENT_TYPES_ALL}`,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error en listAllDocumentTypes:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Busca un tipo de documento por su ID.
   * @param id - ID del tipo de documento a buscar
   * @returns Tipo de documento encontrado o undefined
   */
  getDocumentTypeById(id: number): DocumentType | undefined {
    return this.documentTypesState().find(dt => dt.documentoId === id);
  }

  /**
   * Busca un tipo de documento por su código.
   * @param codigo - Código del tipo de documento a buscar (ej: "CC", "TI", "CE")
   * @returns Tipo de documento encontrado o undefined
   */
  getDocumentTypeByCode(codigo: string): DocumentType | undefined {
    return this.documentTypesState().find(dt => dt.codigo === codigo);
  }

  /**
   * Refresca la lista de tipos de documentos desde el backend.
   */
  refresh(): void {
    this.loadDocumentTypes();
  }
}

