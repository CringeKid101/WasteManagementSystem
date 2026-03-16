import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportStats } from './report-stats';

describe('ReportStats', () => {
  let component: ReportStats;
  let fixture: ComponentFixture<ReportStats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportStats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportStats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
