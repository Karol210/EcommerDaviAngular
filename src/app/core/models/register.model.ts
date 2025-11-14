/**
 * Modelo de solicitud de registro de usuario.
 */
export interface RegisterRequest {
  nombre: string;
  apellido: string;
  documentTypeId: number;
  documentNumber: string;
  email: string;
  password: string;
  roleId: number;
}

/**
 * Respuesta del servicio de registro de usuario.
 */
export interface RegisterResponse {
  failure: boolean;
  code: number;
  message: string;
  body: string;
  timestamp: string;
}

