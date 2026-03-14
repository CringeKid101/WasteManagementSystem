import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WasteReport } from './waste-report';

describe('WasteReport', () => {
  let component: WasteReport;
  let fixture: ComponentFixture<WasteReport>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WasteReport]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WasteReport);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
