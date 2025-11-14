import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { HeaderComponent } from './header.component';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { MessageService } from 'primeng/api';
import { signal } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const isUserAuthenticatedSignal = signal(false);
    const currentUserSignal = signal(null);
    const userProfileSignal = signal(null);
    const totalItemsSignal = signal(0);
    const cartItemsSignal = signal([]);
    const totalPriceComputed = signal(0);
    
    authServiceSpy = jasmine.createSpyObj('AuthService', ['userLogout']);
    Object.assign(authServiceSpy, {
      isUserAuthenticated: isUserAuthenticatedSignal,
      currentUser: currentUserSignal,
      userProfile: userProfileSignal
    });
    
    cartServiceSpy = jasmine.createSpyObj('CartService', ['clearCart']);
    Object.assign(cartServiceSpy, {
      totalItems: totalItemsSignal,
      cartItems: cartItemsSignal,
      totalPrice: totalPriceComputed
    });
    
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MessageService,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: Router, useValue: routerSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call userLogout when logout is called', () => {
    component.logout();

    expect(authServiceSpy.userLogout).toHaveBeenCalled();
    expect(cartServiceSpy.clearCart).toHaveBeenCalled();
  });

  it('should have isAuthenticated signal', () => {
    expect(component.isAuthenticated).toBeDefined();
  });

  it('should have cartItemsCount signal', () => {
    expect(component.cartItemsCount).toBeDefined();
  });
});

