import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { WasteReport } from '../../../features/waste-report/waste-report/waste-report';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
import { OrganizerRequestDialog } from '../../../features/organizer-requests/components/organizer-request-dialog/organizer-request-dialog';
import { OrganizerRequest as OrganizerRequestService } from '../../../features/organizer-requests/services/organizer-request';

@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  user: any = null;
  @Output() refreshDashboard = new EventEmitter<void>();

  constructor(
    private dialog: MatDialog,
    private auth: Auth,
    private organiserRequestService: OrganizerRequestService,
  ) {}
  isEligible: boolean = false;
  openReportModal() {
    const dialogRef = this.dialog.open(WasteReport, {
      width: '1200px', // Fixed width
      height: '600px', // Fixed height
      maxWidth: '90vw', // Prevents it from going off-screen
      maxHeight: '90vh', // Prevents it from going off-screen
      panelClass: 'no-scroll-dialog',
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.refreshDashboard.emit();
      }
    });
  }

  openRequestModal() {
    this.dialog.open(OrganizerRequestDialog, {
      width: '400px', // Fixed width
      height: '280px', // Fixed height
      maxWidth: '90vw', // Prevents it from going off-screen
      maxHeight: '90vh', // Prevents it from going off-screen
      panelClass: 'no-scroll-dialog',
    });
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.user = user;
    });

    this.organiserRequestService.getEligibility().subscribe((response) => {
      this.isEligible = response.isEligible;
      console.log('Eligibility:', this.isEligible);
    });
  }
}
