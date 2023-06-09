import { TestBed } from '@angular/core/testing';

import { CosteoService } from './costeo.service';

describe('CosteoService', () => {
  let service: CosteoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CosteoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
