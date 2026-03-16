import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerRequestsPage } from './organizer-requests-page';

describe('OrganizerRequestsPage', () => {
  let component: OrganizerRequestsPage;
  let fixture: ComponentFixture<OrganizerRequestsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerRequestsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerRequestsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
