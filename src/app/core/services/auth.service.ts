import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { StorageKeys } from '../enums/storage-keys.enum';
import { AppRoutes } from '../enums/app-routes.enum';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { User, LoginCredentials, AuthResponse, UserLoginCredentials, UserLoginResponse, UserProfile } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

/**
 * Servicio para gestionar la autenticación de administradores y usuarios.
 * Maneja login, logout y persistencia de sesión en sessionStorage.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly adminUserState = signal<User | null>(null);
  private readonly userState = signal<string | null>(null);
  private readonly userProfileState = signal<UserProfile | null>(null);
  
  /**
   * Signal reactivo con el usuario administrador actual.
   * Null si no hay sesión activa.
   */
  readonly adminUser = this.adminUserState.asReadonly();
  
  /**
   * Signal reactivo con el nombre del usuario regular autenticado.
   * Null si no hay sesión activa.
   */
  readonly currentUser = this.userState.asReadonly();

  /**
   * Signal reactivo con el perfil completo del usuario autenticado.
   * Null si no hay sesión activa.
   */
  readonly userProfile = this.userProfileState.asReadonly();
  
  /**
   * Signal reactivo que indica si hay un administrador autenticado.
   */
  readonly isAdminAuthenticated = computed(() => this.adminUserState() !== null);
  
  /**
   * Signal reactivo que indica si hay un usuario regular autenticado.
   */
  readonly isUserAuthenticated = computed(() => this.userState() !== null);

  constructor() {
    this.loadAdminFromStorage();
    this.loadUserFromStorage();
  }

  private loadAdminFromStorage(): void {
    const token = this.storage.getItem<string>(StorageKeys.ADMIN_TOKEN);
    const user = this.storage.getItem<User>(StorageKeys.ADMIN_USER);
    
    if (token && user) {
      this.adminUserState.set(user);
    }
  }

  private loadUserFromStorage(): void {
    const token = this.storage.getItem<string>(StorageKeys.USER_TOKEN);
    const username = this.storage.getItem<string>(StorageKeys.USER_NAME);
    const profile = this.storage.getItem<UserProfile>(StorageKeys.USER_PROFILE);
    
    if (token && username) {
      this.userState.set(username);
    }

    if (profile) {
      this.userProfileState.set(profile);
    }
  }

  /**
   * Inicia sesión de administrador y persiste la sesión en sessionStorage.
   * 
   * @param credentials - Usuario y contraseña del administrador
   * @returns Observable con la respuesta del login
   */
  adminLogin(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}${ApiEndpoints.AUTH_LOGIN}`,
      {
        email: credentials.username,
        password: credentials.password
      }
    ).pipe(
      tap(response => {
        this.storage.setItem(StorageKeys.ADMIN_TOKEN, response.token);
        this.storage.setItem(StorageKeys.ADMIN_USER, response.user);
        this.adminUserState.set(response.user);
      })
    );
  }

  /**
   * Cierra la sesión del administrador y redirige al login.
   * Limpia token y datos de usuario de sessionStorage.
   */
  adminLogout(): void {
    this.clearAdminSession();
    this.router.navigate([AppRoutes.ADMIN_LOGIN]);
  }

  private clearAdminSession(): void {
    this.storage.removeItem(StorageKeys.ADMIN_TOKEN);
    this.storage.removeItem(StorageKeys.ADMIN_USER);
    this.adminUserState.set(null);
  }

  /**
   * Inicia sesión de usuario regular y persiste la sesión en sessionStorage.
   * 
   * @param credentials - Email y contraseña del usuario
   * @returns Observable con la respuesta del login
   */
  userLogin(credentials: UserLoginCredentials): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>(
      `${environment.apiUrl}${ApiEndpoints.AUTH_LOGIN}`,
      credentials
    ).pipe(
      tap(response => {
        this.storage.setItem(StorageKeys.USER_TOKEN, response.token);
        this.storage.setItem(StorageKeys.USER_NAME, response.username);
        this.storage.setItem(StorageKeys.USER_PROFILE, response.userProfile);
        this.userState.set(response.username);
        this.userProfileState.set(response.userProfile);
      })
    );
  }

  /**
   * Cierra la sesión del usuario regular.
   * Limpia token y datos de usuario.
   */
  userLogout(): void {
    this.storage.removeItem(StorageKeys.USER_TOKEN);
    this.storage.removeItem(StorageKeys.USER_NAME);
    this.storage.removeItem(StorageKeys.USER_PROFILE);
    this.userState.set(null);
    this.userProfileState.set(null);
  }

  /**
   * Obtiene el token del usuario regular autenticado.
   * @returns Token JWT del usuario o null si no está autenticado
   */
  getUserToken(): string | null {
    return this.storage.getItem<string>(StorageKeys.USER_TOKEN);
  }

  /**
   * Obtiene el token del administrador autenticado.
   * @returns Token JWT del administrador o null si no está autenticado
   */
  getAdminToken(): string | null {
    return this.storage.getItem<string>(StorageKeys.ADMIN_TOKEN);
  }
}

