import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { LandingComponent } from './landing.component';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { AuthService } from '../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { signal } from '@angular/core';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;
  let productServiceSpy: any;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let authServiceSpy: any;
  let messageServiceSpy: any;

  const mockProduct = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    categoryName: 'Category',
    categoryDescription: 'Cat Desc',
    unitPrice: 100000,
    taxRate: 19,
    taxAmount: 19000,
    totalPrice: 119000,
    imageUrl: 'http://example.com/image.jpg',
    active: true
  };

  beforeEach(async () => {
    const productsSignal = signal([mockProduct]);
    const loadingSignal = signal(false);
    const isUserAuthenticatedSignal = signal(true);
    const currentUserSignal = signal('testuser');
    const userProfileSignal = signal({ 
      nombre: 'Test', 
      apellido: 'User',
      correo: 'test@test.com',
      tipoDocumento: 'CC',
      codigoDocumento: '123',
      numeroDocumento: '123456',
      estado: 'Activo',
      roles: ['Cliente']
    });
    const totalItemsSignal = signal(0);
    const cartItemsSignal = signal([]);
    const totalPriceSignal = signal(0);
    
    productServiceSpy = {
      products: productsSignal,
      loading: loadingSignal
    } as any;
    
    cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart', 'getCartSummary', 'updateCartState']);
    Object.assign(cartServiceSpy, {
      totalItems: totalItemsSignal,
      cartItems: cartItemsSignal,
      totalPrice: totalPriceSignal
    });
    (cartServiceSpy.addToCart as jest.Mock).mockReturnValue(of({
      failure: false,
      code: 200,
      message: 'Added',
      body: 'Success',
      timestamp: '2024-01-01'
    }));
    (cartServiceSpy.getCartSummary as jest.Mock).mockReturnValue(of({
      failure: false,
      code: 200,
      message: 'Success',
      body: {
        empty: false,
        itemCount: 1,
        totalItems: 1,
        totalSubtotal: 100000,
        totalIva: 19000,
        totalPrice: 119000,
        items: []
      },
      timestamp: '2024-01-01'
    }));
    
    authServiceSpy = {
      isUserAuthenticated: isUserAuthenticatedSignal,
      currentUser: currentUserSignal,
      userProfile: userProfileSignal
    } as any;
    
    // Mock de MessageService con observables
    messageServiceSpy = {
      messageObserver: new Subject(),
      clearObserver: new Subject(),
      add: jest.fn(),
      addAll: jest.fn(),
      clear: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [LandingComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have products from service', () => {
    expect(component.products()).toEqual([mockProduct]);
  });

  it('should have loading state from service', () => {
    expect(component.loading()).toBe(false);
  });

  it('should format price correctly', () => {
    const formatted = component.formatPrice(100000);

    expect(formatted).toContain('100');
  });

  it('should add product to cart when user is authenticated', (done) => {
    component.addToCart(mockProduct);

    setTimeout(() => {
      expect(cartServiceSpy.addToCart).toHaveBeenCalledWith(mockProduct, 1);
      expect(messageServiceSpy.add).toHaveBeenCalled();
      done();
    }, 1100);
  });
});

