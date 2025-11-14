import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { environment } from '../../../environments/environment';
import { Product } from '../models/product.model';
import { CartSummary } from '../models/cart-summary.model';
import { ApiResponse } from '../models/api-response.model';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockCartSummary: CartSummary = {
    empty: false,
    itemCount: 1,
    totalItems: 2,
    totalSubtotal: 100000,
    totalIva: 19000,
    totalPrice: 200000,
    items: [
      {
        id: 1,
        productId: 101,
        productName: 'Product 1',
        productDescription: 'Description 1',
        imageUrl: 'http://example.com/product1.jpg',
        calculation: {
          quantity: 1,
          unitValue: 100000,
          ivaPercentage: 19,
          subtotal: 100000,
          ivaAmount: 19000,
          totalPrice: 119000
        }
      }
    ]
  };

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getUserToken',
      'isUserAuthenticated'
    ]);
    authServiceSpy.getUserToken.and.returnValue('mock-token');
    authServiceSpy.isUserAuthenticated.and.returnValue(false);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CartService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCartSummary', () => {
    it('should retrieve cart summary from backend', (done) => {
      const mockResponse: ApiResponse<CartSummary> = {
        failure: false,
        code: 200,
        message: 'Success',
        body: mockCartSummary,
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.getCartSummary().subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.CART_SUMMARY}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.headers.get('Authorization')).toBe('Bearer mock-token');
      req.flush(mockResponse);
    });
  });

  describe('addToCart', () => {
    it('should add product to cart', (done) => {
      const product: Product = {
        id: 101,
        name: 'Product 1',
        description: 'Description 1',
        categoryName: 'Category',
        categoryDescription: 'Cat Desc',
        unitPrice: 100000,
        taxRate: 19,
        taxAmount: 19000,
        totalPrice: 119000,
        imageUrl: 'http://example.com/product1.jpg',
        active: true
      };

      const mockResponse: ApiResponse<string> = {
        failure: false,
        code: 200,
        message: 'Product added',
        body: 'Success',
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.addToCart(product, 2).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.CART_ADD}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ productId: 101, quantity: 2 });
      req.flush(mockResponse);
    });
  });

  describe('updateQuantity', () => {
    it('should update product quantity', (done) => {
      const mockResponse: ApiResponse<string> = {
        failure: false,
        code: 200,
        message: 'Quantity updated',
        body: 'Success',
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.updateQuantity(101, 3).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.CART_ADD}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ productId: 101, quantity: 3 });
      req.flush(mockResponse);
    });

    it('should throw error if quantity is 0 or negative', (done) => {
      spyOn(console, 'error');

      service.updateQuantity(101, 0).subscribe({
        error: (error) => {
          expect(error.message).toBe('Cantidad inválida');
          done();
        }
      });
    });
  });

  describe('removeFromCart', () => {
    it('should remove product from cart', (done) => {
      const mockResponse: ApiResponse<string> = {
        failure: false,
        code: 200,
        message: 'Product removed',
        body: 'Success',
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.removeFromCart(101).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.CART_REMOVE}/101`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('updateCartState', () => {
    it('should update cart state with summary', () => {
      service.updateCartState(mockCartSummary);

      expect(service.totalItems()).toBe(2);
      expect(service.totalPrice()).toBe(200000);
    });
  });

  describe('clearCart', () => {
    it('should clear cart state', () => {
      service.updateCartState(mockCartSummary);
      expect(service.totalItems()).toBe(2);

      service.clearCart();

      expect(service.totalItems()).toBe(0);
      expect(service.totalPrice()).toBe(0);
    });
  });

  describe('computed values', () => {
    it('should calculate totalItems correctly', () => {
      expect(service.totalItems()).toBe(0);

      service.updateCartState(mockCartSummary);

      expect(service.totalItems()).toBe(2);
    });

    it('should calculate totalPrice correctly', () => {
      expect(service.totalPrice()).toBe(0);

      service.updateCartState(mockCartSummary);

      expect(service.totalPrice()).toBe(200000);
    });

    it('should map cart items correctly', () => {
      service.updateCartState(mockCartSummary);

      const items = service.cartItems();

      expect(items.length).toBe(1);
      expect(items[0].product.name).toBe('Product 1');
      expect(items[0].quantity).toBe(1);
    });
  });
});

