import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { WasteReportDetail } from '../../../../core/models/waste-report-detail.model';
import { WasteReport as WasteReportService } from '../../services/waste-report';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgClass } from '@angular/common';
import { WasteReportStatus } from '../../../../core/models/waste-report-status.enum';
import { Notification } from '../../../../core/services/notification';

@Component({
  selector: 'app-report-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, NgClass],
  templateUrl: './report-dialog.html',
  styleUrl: './report-dialog.css',
})
export class ReportDialog {
  report: WasteReportDetail | null = null;
 wasteReportStatus = WasteReportStatus;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ReportDialog>,
    private http: HttpClient,
    private wasteReportService: WasteReportService,
    private notificationService: Notification,
  ) {
    console.log('Passed data:', this.data);
  }
  ngOnInit(): void {
    this.wasteReportService.getReportById(this.data.id).subscribe({
      next: (res) => {
        this.report = res;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
  handleReport(status: WasteReportStatus) {
    if (!this.report) return;
    this.wasteReportService.updateReportStatus(this.report.id, status).subscribe({
      next: (res) => {
        console.log(`Report ${status.toLowerCase()}:`, res);
        this.dialogRef.close(true); // pass true to indicate update
        this.notificationService.success(`Report ${status.toLowerCase()}ed successfully.`);
      },
      error: (err) => {
        console.error(err);
        this.notificationService.error(`Failed to ${status.toLowerCase()} report.`);
      },
    });
  }
}
