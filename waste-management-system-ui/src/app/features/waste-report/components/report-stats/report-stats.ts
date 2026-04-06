import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { WasteReportsStats } from '../../../../core/models/waste-reports-stats.model';
import { WasteReport as wasteReportService } from '../../services/waste-report';
@Component({
  selector: 'app-report-stats',
  imports: [],
  templateUrl: './report-stats.html',
  styleUrl: './report-stats.css',
})
export class ReportStats implements OnInit {
  wasteReportsStats: WasteReportsStats | null = null;
  constructor(private wasteReportService: wasteReportService) {}

  ngOnInit(): void {
    this.wasteReportService.getWasteReportStats().subscribe((stats) => {
      this.wasteReportsStats = stats;
    });
  }
}
