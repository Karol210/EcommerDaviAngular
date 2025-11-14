import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { CardData, ProcessPaymentRequest, ProcessPaymentResponse } from '../models/payment.model';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

/**
 * Servicio para gestionar los pagos.
 */
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  /**
   * Genera los headers necesarios para las peticiones HTTP.
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
   * Encripta los datos de la tarjeta en Base64.
   * @param cardData - Datos de la tarjeta
   * @returns String encriptado en Base64
   */
  encryptCardData(cardData: CardData): string {
    const jsonString = JSON.stringify(cardData);
    return btoa(jsonString); // Convierte a Base64
  }

  /**
   * Procesa un pago con los datos de la tarjeta.
   * @param cardData - Datos de la tarjeta
   * @returns Observable con la respuesta del pago
   */
  processPayment(cardData: CardData): Observable<ProcessPaymentResponse> {
    const encryptedData = this.encryptCardData(cardData);
    const request: ProcessPaymentRequest = {
      encryptedCardData: encryptedData
    };

    return this.http.post<ProcessPaymentResponse>(
      `${environment.apiUrl}${ApiEndpoints.PAYMENTS_PROCESS}`,
      request,
      { headers: this.getHeaders() }
    ).pipe(
      catchError(error => {
        console.error('Error al procesar el pago:', error);
        return throwError(() => error);
      })
    );
  }
}

