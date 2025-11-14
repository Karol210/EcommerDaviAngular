export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

/**
 * Credenciales de login de usuario (email y password).
 */
export interface UserLoginCredentials {
  email: string;
  password: string;
}

/**
 * Perfil completo del usuario autenticado.
 */
export interface UserProfile {
  nombre: string;
  apellido: string;
  correo: string;
  tipoDocumento: string;
  codigoDocumento: string;
  numeroDocumento: string;
  estado: string;
  roles: string[];
}

/**
 * Respuesta del servicio de login de usuario.
 */
export interface UserLoginResponse {
  token: string;
  username: string;
  message: string;
  expiresIn: number;
  userProfile: UserProfile;
}

