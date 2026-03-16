import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EventsPage } from './events-page';

describe('EventsPage', () => {
  let component: EventsPage;
  let fixture: ComponentFixture<EventsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
