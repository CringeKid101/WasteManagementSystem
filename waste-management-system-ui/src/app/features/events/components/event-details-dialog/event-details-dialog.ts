import { Component } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-details-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './event-details-dialog.html',
  styleUrl: './event-details-dialog.css',
})
export class EventDetailsDialog {

}
