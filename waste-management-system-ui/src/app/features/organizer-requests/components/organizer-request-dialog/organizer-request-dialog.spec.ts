import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizerRequestDialog } from './organizer-request-dialog';

describe('OrganizerRequestDialog', () => {
  let component: OrganizerRequestDialog;
  let fixture: ComponentFixture<OrganizerRequestDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizerRequestDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizerRequestDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
