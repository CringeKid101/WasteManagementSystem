import { Component, OnInit } from '@angular/core';
import { ReportsTable } from '../../components/reports-table/reports-table';
import { ReportStats } from '../../components/report-stats/report-stats';
import { ReportFilters } from '../../components/report-filters/report-filters';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateEventDialog } from '../../../events/components/create-event-dialog/create-event-dialog';
import { WasteReportDetail } from '../../../../core/models/waste-report-detail.model';
import { ReportSearchFilters } from '../../../../core/models/report-search-filters.model';
import { WasteReport } from '../../../../core/models/waste-report.model';
import { WasteReport as WasteReportService } from '../../services/waste-report';
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-reports-page',
  imports: [ReportsTable, ReportStats, ReportFilters, MatIconModule, MatButtonModule, MatTooltip],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.css',
})
export class ReportsPage implements OnInit {
  selectedReports: WasteReportDetail[] = [];
  reports: WasteReport[] = [];  
  constructor(private dialog: MatDialog, private reportService: WasteReportService) {}


  ngOnInit(): void {
      this.loadReports();
    }
  
  openCreateEventModal() {
    this.dialog.open(CreateEventDialog, {
      width: '1000px', // Fixed width
      height: '800px', // Fixed height
      maxWidth: '90vw', // Prevents it from going off-screen
      maxHeight: '90vh', // Prevents it from going off-screen
      panelClass: 'no-scroll-dialog',
      data: this.selectedReports,
    });
  }

  onSelectionChange(reports: WasteReportDetail[]) {
    this.selectedReports = reports;
  }

  onFilterChange(filters: any) {
    const searchFilters: ReportSearchFilters = {
      wasteType: filters.wasteType,
      reportStatus: filters.reportStatus,
      searchText: filters.searchText,
    };
    this.reportService.getReports(searchFilters).subscribe({
      next: (res) => {
        this.reports = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  loadReports() {
    this.reportService.getReports().subscribe({
      next: (res) => {
        this.reports = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
