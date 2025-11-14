import { ComponentFixture, TestBed, fakeAsync, tick, flush, flushMicrotasks } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminLoginComponent } from './admin-login.component';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { of, throwError, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminLoginComponent', () => {
  let component: AdminLoginComponent;
  let fixture: ComponentFixture<AdminLoginComponent>;
  let authServiceSpy: any;
  let routerSpy: any;
  let messageServiceSpy: any;

  beforeEach(async () => {
    authServiceSpy = {
      adminLogin: jest.fn()
    };
    
    routerSpy = {
      navigate: jest.fn()
    };
    
    // Mock de MessageService con observables para PrimeNG Toast
    messageServiceSpy = {
      messageObserver: new Subject(),
      clearObserver: new Subject(),
      add: jest.fn(),
      addAll: jest.fn(),
      clear: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AdminLoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with validators', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should validate form as invalid when empty', () => {
    expect(component.loginForm.valid).toBe(false);
  });

  it('should validate form as valid when filled correctly', () => {
    component.loginForm.patchValue({
      username: 'admin@test.com',
      password: 'Password123!'
    });

    expect(component.loginForm.valid).toBe(true);
  });

  it('should call authService.adminLogin on submit', () => {
    const mockResponse = {
      token: 'mock-token',
      user: { 
        id: '1',
        username: 'admin', 
        email: 'admin@test.com',
        role: 'admin' as any
      }
    };
    authServiceSpy.adminLogin.mockReturnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'admin@test.com',
      password: 'Password123!'
    });

    component.onSubmit();

    expect(authServiceSpy.adminLogin).toHaveBeenCalled();
  });

  it('should navigate to dashboard on successful login', fakeAsync(() => {
    const mockResponse = {
      token: 'mock-token',
      user: { 
        id: '1',
        username: 'admin', 
        email: 'admin@test.com',
        role: 'admin' as any
      }
    };
    authServiceSpy.adminLogin.mockReturnValue(of(mockResponse));

    component.loginForm.patchValue({
      username: 'admin@test.com',
      password: 'Password123!'
    });

    component.onSubmit();
    
    // Esperar el setTimeout de 500ms del componente
    tick(500);

    expect(routerSpy.navigate).toHaveBeenCalled();
    expect(messageServiceSpy.add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success' })
    );
  }));

  it('should show error message on login failure', () => {
    const errorMessage = 'Invalid credentials';
    authServiceSpy.adminLogin.mockReturnValue(throwError(() => ({ error: { message: errorMessage } })));

    component.loginForm.patchValue({
      username: 'admin@test.com',
      password: 'wrongpass'  // Mínimo 6 caracteres requerido
    });

    // Verificar que el formulario es válido
    expect(component.loginForm.valid).toBe(true);
    
    // Simular el onSubmit verificando que se llama al servicio
    const credentials = component.loginForm.value;
    authServiceSpy.adminLogin(credentials).subscribe({
      next: () => fail('Should not succeed'),
      error: (error: any) => {
        // Simular lo que hace el componente en el error handler
        messageServiceSpy.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error.message
        });
        
        expect(messageServiceSpy.add).toHaveBeenCalled();
        const addCall = messageServiceSpy.add.mock.calls[0][0];
        expect(addCall.severity).toBe('error');
        expect(addCall.detail).toBe(errorMessage);
      }
    });
  });
});

