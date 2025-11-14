import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AdminLayoutComponent } from './admin-layout.component';
import { AuthService } from '../../../core/services/auth.service';
import { signal } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdminLayoutComponent', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['adminLogout'], {
      adminUser: signal({ username: 'admin', email: 'admin@test.com' })
    });

    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      providers: [
        provideRouter([
          { path: 'admin/dashboard', component: AdminLayoutComponent },
          { path: 'admin/products', component: AdminLayoutComponent },
          { path: 'admin/users', component: AdminLayoutComponent }
        ]),
        provideAnimations(),
        { provide: AuthService, useValue: authServiceSpy }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call adminLogout when logout is clicked', () => {
    component.logout();

    expect(authServiceSpy.adminLogout).toHaveBeenCalled();
  });
});

