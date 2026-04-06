import { TestBed } from '@angular/core/testing';

import { WasteReport } from './waste-report';

describe('WasteReport', () => {
  let service: WasteReport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WasteReport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
