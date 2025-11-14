import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminProductsComponent } from './admin-products.component';
import { ProductService } from '../../../../core/services/product.service';
import { CategoryService } from '../../../../core/services/category.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { signal } from '@angular/core';
import { Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminProductsComponent', () => {
  let component: AdminProductsComponent;
  let fixture: ComponentFixture<AdminProductsComponent>;
  let productServiceSpy: jasmine.SpyObj<ProductService>;
  let categoryServiceSpy: jasmine.SpyObj<CategoryService>;
  let messageServiceSpy: any;
  let confirmationServiceSpy: any;

  beforeEach(async () => {
    const productsSignal = signal([]);
    const productLoadingSignal = signal(false);
    const categoriesSignal = signal([]);
    const categoryLoadingSignal = signal(false);
    
    productServiceSpy = jasmine.createSpyObj('ProductService', ['refresh', 'loadAllProductsForAdmin', 'getAvailableProducts', 'getProblemsProducts']);
    Object.assign(productServiceSpy, {
      products: productsSignal,
      loading: productLoadingSignal
    });
    productServiceSpy.getAvailableProducts.and.returnValue([]);
    productServiceSpy.getProblemsProducts.and.returnValue([]);
    
    categoryServiceSpy = jasmine.createSpyObj('CategoryService', []);
    Object.assign(categoryServiceSpy, {
      categories: categoriesSignal,
      loading: categoryLoadingSignal
    });
    
    // Mock de MessageService con observables
    messageServiceSpy = {
      messageObserver: new Subject(),
      clearObserver: new Subject(),
      add: jest.fn(),
      addAll: jest.fn(),
      clear: jest.fn()
    };
    
    // Mock de ConfirmationService con observable
    confirmationServiceSpy = {
      requireConfirmation$: new Subject(),
      confirm: jest.fn(),
      close: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AdminProductsComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ConfirmationService, useValue: confirmationServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirmation dialog when toggling product status', () => {
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      description: 'Test',
      categoryName: 'Category',
      categoryDescription: 'Desc',
      unitPrice: 100000,
      taxRate: 19,
      taxAmount: 19000,
      totalPrice: 119000,
      imageUrl: '',
      active: true
    };

    component.toggleProductStatus(mockProduct);

    expect(confirmationServiceSpy.confirm).toHaveBeenCalled();
  });
});

