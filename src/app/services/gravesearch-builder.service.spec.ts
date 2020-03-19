import { TestBed } from '@angular/core/testing';

import { GravesearchBuilderService } from './gravesearch-builder.service';

describe('GravesearchBuilderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GravesearchBuilderService = TestBed.get(GravesearchBuilderService);
    expect(service).toBeTruthy();
  });
});
