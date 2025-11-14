/**
 * Tipos de pago disponibles
 */
export type PaymentType = 'debito' | 'credito';

/**
 * Datos de la tarjeta de crédito/débito
 */
export interface CardData {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string; // Formato: MM/YY
  cvv: string;
  installments: number;
  paymentType: PaymentType;
}

/**
 * Petición para procesar un pago
 */
export interface ProcessPaymentRequest {
  encryptedCardData: string; // Datos de tarjeta encriptados en Base64
}

/**
 * Detalle de un pago procesado
 */
export interface PaymentDetail {
  paymentId: number;
  referenceNumber: string;
  status: string;
  paymentType: PaymentType;
}

/**
 * Respuesta del proceso de pago
 */
export interface ProcessPaymentResponse {
  failure: boolean;
  code: number;
  message: string;
  body: PaymentDetail;
  timestamp: string;
}

/**
 * Opciones para el selector de tipo de pago
 */
export interface PaymentTypeOption {
  id: PaymentType;
  label: string;
}

