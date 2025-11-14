import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DocumentTypeService } from './document-type.service';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';
import { ApiEndpoints } from '../enums/api-endpoints.enum';
import { DocumentType } from '../models/document-type.model';
import { ApiResponse } from '../models/api-response.model';

describe('DocumentTypeService', () => {
  let service: DocumentTypeService;
  let httpMock: HttpTestingController;
  let storageSpy: jasmine.SpyObj<StorageService>;

  const mockDocumentType: DocumentType = {
    documentoId: 1,
    nombre: 'Cédula de Ciudadanía',
    codigo: 'CC'
  };

  beforeEach(() => {
    storageSpy = jasmine.createSpyObj('StorageService', ['getItem']);
    storageSpy.getItem.and.returnValue(null);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        DocumentTypeService,
        { provide: StorageService, useValue: storageSpy }
      ]
    });

    service = TestBed.inject(DocumentTypeService);
    httpMock = TestBed.inject(HttpTestingController);

    // Cancelar la petición inicial del constructor
    const req = httpMock.match(`${environment.apiUrl}${ApiEndpoints.DOCUMENT_TYPES_ALL}`);
    req.forEach(r => r.flush({ failure: false, code: 200, message: 'Success', body: [], timestamp: '2024-01-01' }));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listAllDocumentTypes', () => {
    it('should retrieve all document types', (done) => {
      const mockResponse: ApiResponse<DocumentType[]> = {
        failure: false,
        code: 200,
        message: 'Success',
        body: [mockDocumentType],
        timestamp: '2024-01-01T00:00:00Z'
      };

      service.listAllDocumentTypes().subscribe(response => {
        expect(response).toEqual(mockResponse);
        expect(response.body.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}${ApiEndpoints.DOCUMENT_TYPES_ALL}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getDocumentTypeById', () => {
    it('should find document type by id', () => {
      service['documentTypesState'].set([mockDocumentType]);

      const result = service.getDocumentTypeById(1);

      expect(result).toEqual(mockDocumentType);
    });

    it('should return undefined if document type not found', () => {
      service['documentTypesState'].set([mockDocumentType]);

      const result = service.getDocumentTypeById(999);

      expect(result).toBeUndefined();
    });
  });

  describe('getDocumentTypeByCode', () => {
    it('should find document type by code', () => {
      service['documentTypesState'].set([mockDocumentType]);

      const result = service.getDocumentTypeByCode('CC');

      expect(result).toEqual(mockDocumentType);
    });

    it('should return undefined if code not found', () => {
      service['documentTypesState'].set([mockDocumentType]);

      const result = service.getDocumentTypeByCode('XXX');

      expect(result).toBeUndefined();
    });
  });

  describe('signals', () => {
    it('should have readonly documentTypes signal', () => {
      expect(service.documentTypes()).toEqual([]);
    });

    it('should have readonly loading signal', () => {
      expect(service.loading()).toBe(false);
    });
  });
});

