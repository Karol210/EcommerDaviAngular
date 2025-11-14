import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { signal } from '@angular/core';
import { adminAuthGuard } from './admin-auth.guard';
import { AuthService } from '../services/auth.service';
import { AppRoutes } from '../enums/app-routes.enum';

describe('adminAuthGuard', () => {
  let authServiceMock: Partial<AuthService>;
  let routerMock: Partial<Router>;
  let isAdminAuthenticatedSpy: jest.Mock;

  beforeEach(() => {
    isAdminAuthenticatedSpy = jest.fn().mockReturnValue(false);
    
    authServiceMock = {
      isAdminAuthenticated: isAdminAuthenticatedSpy as any
    };
    
    routerMock = {
      navigate: jest.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    });
  });

  it('should allow activation if admin is authenticated', () => {
    isAdminAuthenticatedSpy.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => adminAuthGuard({} as any, {} as any));

    expect(result).toBe(true);
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to login if admin is not authenticated', () => {
    isAdminAuthenticatedSpy.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => adminAuthGuard({} as any, {} as any));

    expect(result).toBe(false);
    expect(routerMock.navigate).toHaveBeenCalledWith([AppRoutes.ADMIN_LOGIN]);
  });
});

