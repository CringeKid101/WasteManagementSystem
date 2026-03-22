import { TestBed } from '@angular/core/testing';

import { OrganizerRequest } from './organizer-request';

describe('OrganizerRequest', () => {
  let service: OrganizerRequest;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizerRequest);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
