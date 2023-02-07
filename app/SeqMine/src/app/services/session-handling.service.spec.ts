import { TestBed } from '@angular/core/testing';

import { SessionHandlingService } from './session-handling.service';

describe('SessionHandlingService', () => {
  let service: SessionHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
