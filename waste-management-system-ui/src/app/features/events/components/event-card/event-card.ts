import { Component, signal, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Events } from '../../../../core/models/events.model';
import { DatePipe } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { EventDetailsDialog } from '../event-details-dialog/event-details-dialog';
import { Event as EventService } from '../../services/event';
import { NgClass } from '@angular/common';
import { Notification } from '../../../../core/services/notification';

@Component({
  selector: 'app-event-card',
  imports: [MatIconModule, MatCardModule, MatButtonModule, DatePipe, MatTooltipModule, NgClass],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard implements OnInit {
  @Input() event!: Events;
  // joinedEvent = signal(false);

  constructor(
    private dialog: MatDialog,
    private eventService: EventService,
    private notificationService: Notification,
  ) {}

  ngOnInit(): void {
    console.log('Event data:', this.event);
    this.event.loading = false; // Initialize loading state
  }

  handleEvent() {
    if (this.event.loading) return;

    this.event.loading = true;

    // optimistic update
    this.event.isJoined = !this.event.isJoined;

    this.eventService.handleEvent(this.event.eventId).subscribe({
      next: (res) => {
        this.event.isJoined = res.isJoined;
        this.event.loading = false;
        this.notificationService.success('Event updated successfully.');
      },
      error: () => {
        // rollback
        this.event.isJoined = !this.event.isJoined;
        this.event.loading = false;
        this.notificationService.error('Failed to update event.');
      },
    });
    // if (this.event) {
    //   this.eventService.joinEvent(this.event.eventId).subscribe(() => {
    //     this.joinedEvent.update((value) => !value);
    //   });
    // }
  }

  openEventDetails() {
    if (this.event) {
      const dialogRef = this.dialog.open(EventDetailsDialog, {
        width: '600px',
        data: { id: this.event.eventId },
      });
    }
  }
}
