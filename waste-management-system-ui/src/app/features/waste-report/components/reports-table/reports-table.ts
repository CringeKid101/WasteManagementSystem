import { Component, OnInit, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ReportDialog } from '../report-dialog/report-dialog';
import { WasteReport as WasteReportService } from '../../services/waste-report';
import { WasteReport } from '../../../../core/models/waste-report.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Output, EventEmitter } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-reports-table',
  imports: [
    MatPaginator,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    NgClass,
    MatCheckboxModule,
    MatTooltipModule,
    DatePipe,
  ],
  templateUrl: './reports-table.html',
  styleUrl: './reports-table.css',
})
export class ReportsTable {
  @Input() wasteReports: WasteReport[] = [];
  selectedReports: WasteReport[] = [];
  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() refreshReportData = new EventEmitter<void>();


  columns: string[] = ['select', 'description', 'address','created', 'status', 'actions'];

  constructor(
    private dialog: MatDialog,
    private reportService: WasteReportService,
  ) {}

  openReportDialog(id: number) {
    const dialogRef = this.dialog.open(ReportDialog, {
      width: '600px',
      data: { id },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.refreshReportData.emit();
      }
    });
  }

  toggleRow(row: any) {
    const index = this.selectedReports.findIndex((r) => r.id === row.id);

    if (index > -1) {
      this.selectedReports.splice(index, 1);
    } else {
      this.selectedReports.push(row);
    }

    this.selectionChange.emit(this.selectedReports);
  }

  isSelected(row: any): boolean {
    return this.selectedReports.some((r) => r.id === row.id);
  }

  toggleAll(event: any) {
    if (event.checked) {
      this.selectedReports = [...this.wasteReports.map((r) => r.eventId === null ? r : null)].filter(r => r !== null) as WasteReport[];
    } else {
      this.selectedReports = [];
    }

      this.selectionChange.emit(this.selectedReports);
  }

  isAllSelected(): boolean {
    return this.selectedReports.length === this.wasteReports.filter((r) => r.eventId === null).length;
  }
}
