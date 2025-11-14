import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutModalComponent } from './checkout-modal.component';
import { CartService } from '../../../core/services/cart.service';
import { PaymentService } from '../../../core/services/payment.service';
import { MessageService } from 'primeng/api';
import { signal } from '@angular/core';

describe('CheckoutModalComponent', () => {
  let component: CheckoutModalComponent;
  let fixture: ComponentFixture<CheckoutModalComponent>;
  let cartServiceSpy: jasmine.SpyObj<CartService>;
  let paymentServiceSpy: jasmine.SpyObj<PaymentService>;
  let messageServiceSpy: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    cartServiceSpy = jasmine.createSpyObj('CartService', ['clearCart'], {
      cartItems: signal([]),
      totalPrice: signal(0),
      totalItems: signal(0)
    });
    paymentServiceSpy = jasmine.createSpyObj('PaymentService', ['initiatePayment']);
    messageServiceSpy = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      imports: [CheckoutModalComponent],
      providers: [
        { provide: CartService, useValue: cartServiceSpy },
        { provide: PaymentService, useValue: paymentServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show modal when show is called', () => {
    component.show();

    expect(component.visible()).toBe(true);
  });

  it('should hide modal when hide is called', () => {
    component['visible'].set(true);

    component.hide();

    expect(component.visible()).toBe(false);
  });

  it('should have cart items from service', () => {
    expect(component.cartItems).toBeDefined();
  });

  it('should have total price from service', () => {
    expect(component.totalPrice).toBeDefined();
  });
});

