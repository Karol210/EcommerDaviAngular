import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaymentService } from './payment.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { CardData, ProcessPaymentResponse } from '../models/payment.model';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserToken']);
    authServiceSpy.getUserToken.and.returnValue('user-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PaymentService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(PaymentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('processPayment', () => {
    it('should process payment', (done) => {
      const cardData: CardData = {
        cardNumber: '4111111111111111',
        cardHolderName: 'John Doe',
        expirationDate: '12/25',
        cvv: '123',
        installments: 1,
        paymentType: 'credito'
      };

      const mockResponse: ProcessPaymentResponse = {
        failure: false,
        code: 200,
        message: 'Payment processed',
        body: {
          paymentId: 1,
          referenceNumber: 'REF123',
          status: 'approved',
          paymentType: 'credito'
        },
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.processPayment(cardData).subscribe(response => {
        expect(response).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.PAYMENTS_PROCESS}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Authorization')).toBe('Bearer user-token');
      req.flush(mockResponse);
    });
  });

  describe('encryptCardData', () => {
    it('should encrypt card data to Base64', () => {
      const cardData: CardData = {
        cardNumber: '4111111111111111',
        cardHolderName: 'John Doe',
        expirationDate: '12/25',
        cvv: '123',
        installments: 1,
        paymentType: 'credito'
      };

      const encrypted = service.encryptCardData(cardData);

      expect(encrypted).toBeTruthy();
      expect(typeof encrypted).toBe('string');
    });
  });
});

