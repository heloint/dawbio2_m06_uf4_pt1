import { TestBed } from '@angular/core/testing';

import { CredentialValidationService } from './credential-validation.service';

describe('CredentialValidationService', () => {
  let service: CredentialValidationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CredentialValidationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
