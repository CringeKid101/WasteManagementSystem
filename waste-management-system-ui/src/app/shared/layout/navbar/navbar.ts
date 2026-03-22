import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { WasteReport } from '../../../features/waste-report/waste-report/waste-report';
import { RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';
@Component({
  selector: 'app-navbar',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  user: any = null;
  constructor(private dialog: MatDialog, private auth: Auth) { }

  openReportModal() {
    this.dialog.open(WasteReport, {
      width: '1000px',        // Fixed width
      height: '600px',       // Fixed height
      maxWidth: '90vw',      // Prevents it from going off-screen
      maxHeight: '90vh',     // Prevents it from going off-screen
      panelClass: 'no-scroll-dialog'
    });
  }

  ngOnInit(): void {
    this.auth.user$.subscribe(user => {
      this.user = user;
    });
  }

}
