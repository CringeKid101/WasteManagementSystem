import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDetailsDialog } from './event-details-dialog';

describe('EventDetailsDialog', () => {
  let component: EventDetailsDialog;
  let fixture: ComponentFixture<EventDetailsDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDetailsDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDetailsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
