import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AdminUsersComponent } from './admin-users.component';
import { UserService } from '../../../core/services/user.service';
import { DocumentTypeService } from '../../../core/services/document-type.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { signal } from '@angular/core';
import { of, Subject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminUsersComponent', () => {
  let component: AdminUsersComponent;
  let fixture: ComponentFixture<AdminUsersComponent>;
  let userServiceSpy: jasmine.SpyObj<UserService>;
  let documentTypeServiceSpy: any;
  let messageServiceSpy: any;
  let confirmationServiceSpy: any;

  beforeEach(async () => {
    userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsers']);
    userServiceSpy.getAllUsers.and.returnValue(of({
      failure: false,
      code: 200,
      message: 'Success',
      body: [],
      timestamp: '2024-01-01'
    }));

    documentTypeServiceSpy = {
      documentTypes: signal([]),
      loading: signal(false)
    };
    
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
      imports: [AdminUsersComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: DocumentTypeService, useValue: documentTypeServiceSpy },
        { provide: MessageService, useValue: messageServiceSpy },
        { provide: ConfirmationService, useValue: confirmationServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize edit form with validators', () => {
    expect(component.editForm).toBeDefined();
    expect(component.editForm.get('nombre')).toBeDefined();
    expect(component.editForm.get('apellido')).toBeDefined();
    expect(component.editForm.get('email')).toBeDefined();
    expect(component.editForm.get('tipoDocumento')).toBeDefined();
    expect(component.editForm.get('numeroDocumento')).toBeDefined();
  });

  it('should load users on init', () => {
    expect(userServiceSpy.getAllUsers).toHaveBeenCalled();
  });

  it('should open edit modal when editUser is called', () => {
    const mockUser = {
      usuarioId: 1,
      nombre: 'John',
      apellido: 'Doe',
      documentType: 'CC',
      documentNumber: '12345678',
      email: 'john@test.com',
      status: 'Activo',
      roles: ['Cliente']
    };

    component.editUser(mockUser);

    expect(component.showEditModal()).toBe(true);
    expect(component.editForm.get('nombre')?.value).toBe('John');
  });

  it('should close edit modal when closeEditModal is called', () => {
    component['showEditModal'].set(true);

    component.closeEditModal();

    expect(component.showEditModal()).toBe(false);
  });

  it('should show confirmation dialog when toggling user status', () => {
    const mockUser = {
      usuarioId: 1,
      nombre: 'John',
      apellido: 'Doe',
      documentType: 'CC',
      documentNumber: '12345678',
      email: 'john@test.com',
      status: 'Activo',
      roles: ['Cliente']
    };

    component.toggleUserStatus(mockUser);

    expect(confirmationServiceSpy.confirm).toHaveBeenCalled();
  });

  it('should format roles correctly', () => {
    const roles = ['Cliente', 'Administrador'];
    
    const result = component.formatRoles(roles);

    expect(result).toBe('Cliente, Administrador');
  });

  it('should return correct status class', () => {
    const activeUser = {
      usuarioId: 1,
      nombre: 'John',
      apellido: 'Doe',
      documentType: 'CC',
      documentNumber: '12345678',
      email: 'john@test.com',
      status: 'Activo',
      roles: ['Cliente']
    };

    const result = component.getStatusClass(activeUser);

    expect(result).toBe('status-active');
  });
});

