/**
 * Respuesta de usuario del backend.
 * Representa un usuario del sistema con sus datos completos.
 */
export interface UserResponse {
  usuarioId: number;
  nombre: string;
  apellido: string;
  documentType: string;
  documentNumber: string;
  email: string;
  status: string;
  roles: string[];
  usuarioRolId?: number;
}

