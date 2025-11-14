import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { RegisterRequest, RegisterResponse } from '../models/register.model';
import { UserResponse } from '../models/user-response';
import { ApiResponse } from '../models/api-response.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<StorageService>;

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    storageSpy.getItem.and.returnValue('admin-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        { provide: StorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('register', () => {
    it('should register a new user', (done) => {
      const request: RegisterRequest = {
        nombre: 'John',
        apellido: 'Doe',
        email: 'john@example.com',
        password: 'Password123!',
        documentTypeId: 1,
        documentNumber: '12345678',
        roleId: 1
      };

      const mockResponse: RegisterResponse = {
        failure: false,
        code: 200,
        message: 'User registered successfully',
        body: 'User created',
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.register(request).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.USERS_CREATE}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('getAllUsers', () => {
    it('should retrieve all users', (done) => {
      const mockUsers: UserResponse[] = [
        {
          usuarioId: 1,
          nombre: 'John',
          apellido: 'Doe',
          documentType: 'CC',
          documentNumber: '12345678',
          email: 'john@example.com',
          status: 'Activo',
          roles: ['Cliente']
        }
      ];

      const mockResponse: ApiResponse<UserResponse[]> = {
        failure: false,
        code: 200,
        message: 'Success',
        body: mockUsers,
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.getAllUsers().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.body.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.USERS_ALL}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer admin-token');
      req.flush(mockResponse);
    });
  });
});

