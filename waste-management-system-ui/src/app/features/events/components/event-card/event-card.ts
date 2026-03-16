import { Component, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-event-card',
  imports: [MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
})
export class EventCard {
  joinedEvent = signal(false);
  joined() {
    this.joinedEvent.update((value) => !value);
  }
}
