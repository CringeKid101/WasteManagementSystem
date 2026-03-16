import { Component } from '@angular/core';
import { EventCard } from '../../components/event-card/event-card';
import { EventDetailsDialog } from '../../components/event-details-dialog/event-details-dialog';
import { MatFormFieldModule, MatLabel, } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatButtonToggleModule, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { CreateEventDialog } from '../../components/create-event-dialog/create-event-dialog';

@Component({
  selector: 'app-events-page',
  imports: [EventCard, MatFormFieldModule, MatLabel, MatInputModule, MatButtonModule, MatInput, MatButtonToggleModule, MatButtonToggleGroup, MatIconModule],
  templateUrl: './events-page.html',
  styleUrl: './events-page.css',
})
export class EventsPage {
  constructor(private dialog: MatDialog) { }
}
