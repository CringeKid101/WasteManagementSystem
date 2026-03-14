import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { WasteReport } from '../../../features/waste-report/waste-report/waste-report';
@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  constructor(private dialog: MatDialog) { }

  openReportModal() {
    this.dialog.open(WasteReport, {
      width: '1000px',        // Fixed width
      height: '500px',       // Fixed height
      maxWidth: '90vw',      // Prevents it from going off-screen
      maxHeight: '90vh',     // Prevents it from going off-screen
      panelClass: 'no-scroll-dialog'
    });
  }
}
