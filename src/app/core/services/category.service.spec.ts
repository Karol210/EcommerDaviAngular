import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryService } from './category.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { Category } from '../models/category.model';
import { ApiResponse } from '../models/api-response.model';

describe('CategoryService', () => {
  let service: CategoryService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<StorageService>;

  const mockCategory: Category = {
    id: 1,
    name: 'Electronics',
    description: 'Electronic devices'
  };

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    storageSpy.getItem.and.returnValue(null);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CategoryService,
        { provide: StorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);

    // Cancelar la petición inicial del constructor
    const req = httpMock.match(`${environment.apiUrl}${ApiEndpoints.CATEGORIES_LIST_ALL}`);
    req.forEach(r => r.flush({ failure: false, code: 200, message: 'Success', body: [], timestamp: '2024-01-01' }));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listAllCategories', () => {
    it('should retrieve all categories', (done) => {
      const mockResponse: ApiResponse<Category[]> = {
        failure: false,
        code: 200,
        message: 'Success',
        body: [mockCategory],
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.listAllCategories().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.body.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.CATEGORIES_LIST_ALL}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getCategoryById', () => {
    it('should find category by id', () => {
      // Primero actualizamos el estado con categorías
      service['categoriesState'].set([mockCategory]);

      const result = service.getCategoryById(1);

      expect(result).toEqual(mockCategory);
    });

    it('should return undefined if category not found', () => {
      service['categoriesState'].set([mockCategory]);

      const result = service.getCategoryById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('signals', () => {
    it('should have readonly categories signal', () => {
      expect(service.categories()).toEqual([]);
    });

    it('should have readonly loading signal', () => {
      expect(service.loading()).toBe(false);
    });
  });
});

