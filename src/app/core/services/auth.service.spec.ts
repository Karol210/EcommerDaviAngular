import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import { StorageKeys } from '../enums/storage-keys.enum';
import { AppRoutes } from '../enums/app-routes.enum';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { environment } from '../../../environments/environment';
import { LoginCredentials, AuthResponse, UserLoginCredentials, UserLoginResponse } from '../models/user.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    storageSpy = jasmine.createSpyObj('StorageService', [
      'getItem',
      'setItem',
      'removeItem'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy },
        { provide: StorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('adminLogin', () => {
    it('should login admin and store credentials', (done) => {
      const credentials: LoginCredentials = {
        username: 'admin',
        password: 'password'
      };

      const mockResponse: AuthResponse = {
        token: 'mock-token',
        user: { 
          id: '1',
          username: 'admin', 
          email: 'admin@test.com',
          role: 'admin' as any
        }
      };

      service.adminLogin(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(storageSpy.setItem).toHaveBeenCalledWith(StorageKeys.ADMIN_TOKEN, mockResponse.token);
        expect(storageSpy.setItem).toHaveBeenCalledWith(StorageKeys.ADMIN_USER, mockResponse.user);
        expect(service.adminUser()).toEqual(mockResponse.user);
        expect(service.isAdminAuthenticated()).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.AUTH_LOGIN}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('adminLogout', () => {
    it('should clear admin session and navigate to login', () => {
      service.adminLogout();

      expect(storageSpy.removeItem).toHaveBeenCalledWith(StorageKeys.ADMIN_TOKEN);
      expect(storageSpy.removeItem).toHaveBeenCalledWith(StorageKeys.ADMIN_USER);
      expect(service.adminUser()).toBeNull();
      expect(routerSpy.navigate).toHaveBeenCalledWith([AppRoutes.ADMIN_LOGIN]);
    });
  });

  describe('userLogin', () => {
    it('should login user and store credentials', (done) => {
      const credentials: UserLoginCredentials = {
        email: 'user@test.com',
        password: 'password'
      };

      const mockResponse: UserLoginResponse = {
        token: 'user-token',
        username: 'testuser',
        message: 'Login successful',
        expiresIn: 3600,
        userProfile: {
          nombre: 'John',
          apellido: 'Doe',
          correo: 'user@test.com',
          tipoDocumento: 'CC',
          codigoDocumento: '12345678',
          numeroDocumento: '12345678',
          estado: 'Activo',
          roles: ['Cliente']
        }
      };

      service.userLogin(credentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(storageSpy.setItem).toHaveBeenCalledWith(StorageKeys.USER_TOKEN, mockResponse.token);
        expect(storageSpy.setItem).toHaveBeenCalledWith(StorageKeys.USER_NAME, mockResponse.username);
        expect(storageSpy.setItem).toHaveBeenCalledWith(StorageKeys.USER_PROFILE, mockResponse.userProfile);
        expect(service.currentUser()).toBe(mockResponse.username);
        expect(service.userProfile()).toEqual(mockResponse.userProfile);
        expect(service.isUserAuthenticated()).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.AUTH_LOGIN}`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });
  });

  describe('userLogout', () => {
    it('should clear user session', () => {
      service.userLogout();

      expect(storageSpy.removeItem).toHaveBeenCalledWith(StorageKeys.USER_TOKEN);
      expect(storageSpy.removeItem).toHaveBeenCalledWith(StorageKeys.USER_NAME);
      expect(storageSpy.removeItem).toHaveBeenCalledWith(StorageKeys.USER_PROFILE);
      expect(service.currentUser()).toBeNull();
      expect(service.userProfile()).toBeNull();
    });
  });

  describe('getUserToken', () => {
    it('should return user token from storage', () => {
      storageSpy.getItem.and.returnValue('user-token');

      const token = service.getUserToken();

      expect(token).toBe('user-token');
      expect(storageSpy.getItem).toHaveBeenCalledWith(StorageKeys.USER_TOKEN);
    });
  });

  describe('getAdminToken', () => {
    it('should return admin token from storage', () => {
      storageSpy.getItem.and.returnValue('admin-token');

      const token = service.getAdminToken();

      expect(token).toBe('admin-token');
      expect(storageSpy.getItem).toHaveBeenCalledWith(StorageKeys.ADMIN_TOKEN);
    });
  });
});

