import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerRequestFilter } from './organizer-request-filter';

describe('OrganizerRequestFilter', () => {
  let component: OrganizerRequestFilter;
  let fixture: ComponentFixture<OrganizerRequestFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerRequestFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerRequestFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
