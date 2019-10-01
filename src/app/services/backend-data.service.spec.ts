import { TestBed } from '@angular/core/testing';

import { BackendDataService } from './backend-data.service';

describe('BackendDataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BackendDataService = TestBed.get(BackendDataService);
    expect(service).toBeTruthy();
  });
});
