import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Event as EventService } from '../../services/event';
import * as L from 'leaflet';
import { DatePipe } from '@angular/common';
import { EventDetails } from '../../../../core/models/event-details.model';
@Component({
  selector: 'app-event-details-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './event-details-dialog.html',
  styleUrl: './event-details-dialog.css',
})
export class EventDetailsDialog {
  event!: EventDetails;

constructor(
  @Inject(MAT_DIALOG_DATA) public data: any,
  private eventService: EventService
) {}

ngOnInit() {
  this.loadEvent();
}

loadEvent() {
  this.eventService.getEventDetails(this.data.id)
    .subscribe(res => {
      this.event = res;

      setTimeout(() => {
        this.initMap(); // wait for DOM
      }, 100);
    });
}
initMap() {
  const map = L.map('eventMap').setView(
    [this.event.latitude, this.event.longitude],
    13
  );

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap'
  }).addTo(map);

  // Waste report markers (readonly)
  this.event.wasteLocations.forEach(loc => {
    L.marker([loc.lat, loc.lng], {
      icon: this.getWasteIcon(),
      draggable: false
    }).addTo(map);
  });

  // Event location marker (different color)
  // const eventIcon = this.getEventIcon();

  L.marker([this.event.latitude, this.event.longitude], {
    icon: this.getEventIcon()
  }).addTo(map);
}

getWasteIcon() {
    return L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
      iconSize: [32, 32],
    });
  }

  getEventIcon() {
    return L.icon({
      iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
      iconSize: [32, 32],
    });
  }
}
