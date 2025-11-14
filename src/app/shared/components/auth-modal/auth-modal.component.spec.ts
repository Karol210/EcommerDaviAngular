import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthModalComponent } from './auth-modal.component';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { MessageService } from 'primeng/api';
import { signal } from '@angular/core';
import { of, throwError, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthModalComponent', () => {
  let component: AuthModalComponent;
  let fixture: ComponentFixture<AuthModalComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let messageServiceSpy: any;

  beforeEach(async () => {
    const isUserAuthenticatedSignal = signal(false);
    
    authServiceSpy = jasmine.createSpyObj('AuthService', ['userLogin']);
    Object.assign(authServiceSpy, {
      currentUser: signal(null),
      isUserAuthenticated: isUserAuthenticatedSignal
    });
    
    userServiceSpy = jasmine.createSpyObj('UserService', ['register']);
    
    // Mock de MessageService con observables
    messageServiceSpy = {
      messageObserver: new Subject(),
      clearObserver: new Subject(),
      add: jest.fn(),
      addAll: jest.fn(),
      clear: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [AuthModalComponent, ReactiveFormsModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: authServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with validators', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should initialize register form with validators', () => {
    expect(component.registerForm).toBeDefined();
    expect(component.registerForm.get('nombre')).toBeDefined();
    expect(component.registerForm.get('apellido')).toBeDefined();
    expect(component.registerForm.get('email')).toBeDefined();
    expect(component.registerForm.get('password')).toBeDefined();
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

  it('should call authService.userLogin on login submit', () => {
    const mockResponse = {
      token: 'token',
      username: 'user',
      message: 'Success',
      expiresIn: 3600,
      userProfile: {
        nombre: 'John',
        apellido: 'Doe',
        correo: 'john@test.com',
        tipoDocumento: 'CC',
        codigoDocumento: '12345678',
        numeroDocumento: '12345678',
        estado: 'Activo',
        roles: ['Cliente']
      }
    };
    authServiceSpy.userLogin.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'user@test.com',
      password: 'Password123!'
    });

    component.onLoginSubmit();

    expect(authServiceSpy.userLogin).toHaveBeenCalled();
  });

  it('should call userService.register on register submit', () => {
    const mockResponse = {
      failure: false,
      code: 200,
      message: 'Registered',
      body: 'User created',
      timestamp: '2024-01-01T00:00:00Z'
    };
    userServiceSpy.register.and.returnValue(of(mockResponse));

    component.registerForm.patchValue({
      nombre: 'John',
      apellido: 'Doe',
      email: 'john@test.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      documentTypeId: 1,
      documentNumber: '12345678'
    });

    component.onRegisterSubmit();

    expect(userServiceSpy.register).toHaveBeenCalled();
  });
});

