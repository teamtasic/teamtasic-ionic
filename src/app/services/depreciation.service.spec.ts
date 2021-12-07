import { TestBed } from '@angular/core/testing';

import { DepreciationService } from './depreciation.service';

describe('DepreciationService', () => {
  let service: DepreciationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepreciationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
