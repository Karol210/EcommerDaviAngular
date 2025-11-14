import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileModalComponent } from './user-profile-modal.component';
import { AuthService } from '../../../core/services/auth.service';
import { signal } from '@angular/core';

describe('UserProfileModalComponent', () => {
  let component: UserProfileModalComponent;
  let fixture: ComponentFixture<UserProfileModalComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  const mockUserProfile = {
    nombre: 'John',
    apellido: 'Doe',
    correo: 'john@test.com',
    tipoDocumento: 'CC',
    codigoDocumento: '12345678',
    numeroDocumento: '12345678',
    estado: 'Activo',
    roles: ['Cliente']
  };

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      userProfile: signal(mockUserProfile)
    });

    await TestBed.configureTestingModule({
      imports: [UserProfileModalComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileModalComponent);
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

  it('should have userProfile from authService', () => {
    expect(component.userProfile()).toEqual(mockUserProfile);
  });
});

