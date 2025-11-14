import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';
import { ProductResponse } from '../models/product-response';
import { ApiResponse } from '../models/api-response.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<StorageService>;

  const mockProductResponse: ProductResponse = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    categoryName: 'Test Category',
    categoryDescription: 'Cat Desc',
    categoryId: 1,
    unitValue: 100000,
    iva: 19,
    ivaAmount: 19000,
    totalPrice: 119000,
    imageUrl: 'http://example.com/image.jpg',
    active: true,
    estadoProductoId: 1,
    stock: 10
  };

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    storageSpy.getItem.and.returnValue(null);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductService,
        { provide: StorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);

    // Cancelar la petición inicial del constructor (loadActiveProducts)
    const req = httpMock.match(`${environment.apiUrl}/api/v1/products/list-active`);
    req.forEach(r => r.flush({ failure: false, code: 200, message: 'Success', body: [], timestamp: '2024-01-01' }));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listAllProducts', () => {
    it('should retrieve all active products', (done) => {
      const mockResponse: ApiResponse<ProductResponse[]> = {
        failure: false,
        code: 200,
        message: 'Success',
        body: [mockProductResponse],
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.listAllProducts().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.body.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/products/list-active`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('listAll', () => {
    it('should retrieve all products including inactive', (done) => {
      const mockResponse: ApiResponse<ProductResponse[]> = {
        failure: false,
        code: 200,
        message: 'Success',
        body: [mockProductResponse],
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.listAll().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.body.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/api/v1/products/list-all`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getProductById', () => {
    it('should find product by id from products state', () => {
      // Configurar el estado de productos
      const mockProducts = [
        {
          id: 1,
          name: 'Test Product',
          description: 'Test',
          categoryName: 'Cat',
          categoryDescription: 'Desc',
          unitPrice: 100000,
          taxRate: 19,
          taxAmount: 19000,
          totalPrice: 119000,
          imageUrl: '',
          active: true
        }
      ];
      service['productsState'].set(mockProducts);

      const result = service.getProductById(1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
    });

    it('should return undefined if product not found', () => {
      service['productsState'].set([]);

      const result = service.getProductById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('signals', () => {
    it('should have readonly products signal', () => {
      expect(service.products()).toEqual([]);
    });

    it('should have readonly loading signal', () => {
      expect(service.loading()).toBe(false);
    });
  });
});

