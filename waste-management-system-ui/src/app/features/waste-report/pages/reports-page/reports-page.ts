import { Component } from '@angular/core';
import { ReportsTable } from '../../components/reports-table/reports-table';
import { ReportStats } from '../../components/report-stats/report-stats';
import { ReportFilters } from '../../components/report-filters/report-filters';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateEventDialog } from '../../../events/components/create-event-dialog/create-event-dialog';

@Component({
  selector: 'app-reports-page',
  imports: [ReportsTable, ReportStats, ReportFilters, MatIconModule, MatButtonModule],
  templateUrl: './reports-page.html',
  styleUrl: './reports-page.css',
})
export class ReportsPage {
  constructor(private dialog: MatDialog) { }

  openCreateEventModal() {
    this.dialog.open(CreateEventDialog, {
      width: '1000px',        // Fixed width
      height: '800px',       // Fixed height
      maxWidth: '90vw',      // Prevents it from going off-screen
      maxHeight: '90vh',     // Prevents it from going off-screen
      panelClass: 'no-scroll-dialog'
    });
  }
}
