import { Component, OnInit } from '@angular/core';
import { EventCard } from '../../components/event-card/event-card';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatButtonToggleModule, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Events } from '../../../../core/models/events.model';
import { Event as EventService } from '../../services/event';
import { EventFilter } from '../../event-filter/event-filter';
import { EventSearchFilters } from '../../../../core/models/event-search-filters.model';

@Component({
  selector: 'app-events-page',
  imports: [
    EventCard,
    MatFormFieldModule,
    MatLabel,
    MatInputModule,
    MatButtonModule,
    MatInput,
    MatButtonToggleModule,
    MatButtonToggleGroup,
    MatIconModule,
    EventFilter,
  ],
  templateUrl: './events-page.html',
  styleUrl: './events-page.css',
})
export class EventsPage implements OnInit {
  events: Events[] = [];
  constructor(
    private dialog: MatDialog,
    private eventService: EventService,
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe((data) => {
      data.forEach((event: Events) => {
        event.eventDate = event.eventDate + 'Z';
        event.eventDateObject = new Date(event.eventDate);
      });
      this.events = data;
    });
  }

  onFilterChange(filters: any) {
    const searchFilters: EventSearchFilters = {
      eventStatus: filters.status,
      searchText: filters.searchText,
    };

    this.eventService.getEvents(searchFilters).subscribe((data) => {
      data.forEach((event: Events) => {
        event.eventDate = event.eventDate + 'Z';
        event.eventDateObject = new Date(event.eventDate);
        this.events = data;
      });
    });
  }
}
