import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerRequestCard } from './organizer-request-card';

describe('OrganizerRequestCard', () => {
  let component: OrganizerRequestCard;
  let fixture: ComponentFixture<OrganizerRequestCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerRequestCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerRequestCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
