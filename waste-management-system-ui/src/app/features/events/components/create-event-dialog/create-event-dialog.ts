import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { WasteReport } from '../../../waste-report/services/waste-report';
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as L from 'leaflet';
import { WasteReportDetail } from '../../../../core/models/waste-report-detail.model';
import { FormBuilder, Validators } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { Event as EventService } from '../../services/event';
import { CreateEvent } from '../../../../core/models/create-event.model';
import { Notification } from '../../../../core/services/notification';

@Component({
  selector: 'app-create-event-dialog',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatLabel,
    MatDatepickerModule,
    MatError,
  ],
  templateUrl: './create-event-dialog.html',
  styleUrl: './create-event-dialog.css',
})
export class CreateEventDialog implements OnInit {
  reports: WasteReportDetail[] = [];
  eventForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private eventService: EventService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreateEventDialog>,
    private notificationService: Notification,
  ) {
    console.log('Received data in CreateEventDialog:', this.data);
  }
  ngOnInit() {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      date: [null, [Validators.required]],
      time: [null, [Validators.required]],
      address: ['', [Validators.required]],
      maxVolunteers: [null, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required]],
    });
    this.reports = this.data; // all selected reports
    this.initMap();
  }

  map: any;
  eventMarker: any;
  selectedLat: number = 0;
  selectedLng: number = 0;

  initMap() {
    this.map = L.map('map').setView([this.reports[0].latitude, this.reports[0].longitude], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // 🔥 Add waste report markers (STATIC)
    this.reports.forEach((r) => {
      L.marker([r.latitude, r.longitude], {
        icon: this.getWasteIcon(),
      }).addTo(this.map);
    });

    // 🔥 Allow selecting event location
    this.map.on('click', (e: any) => {
      if (this.eventMarker) {
        this.map.removeLayer(this.eventMarker);
      }

      this.eventMarker = L.marker(e.latlng, {
        icon: this.getEventIcon(),
      }).addTo(this.map);

      this.selectedLat = e.latlng.lat;
      this.selectedLng = e.latlng.lng;
      this.reverseGeocode(this.selectedLat, this.selectedLng).subscribe((res: any) => {
        this.eventForm.patchValue({
          address: res.display_name,
        });
      });
    });

    this.map.on('dragend', () => {
      if (this.eventMarker) {
        const pos = this.eventMarker.getLatLng();
        this.selectedLat = pos.lat;
        this.selectedLng = pos.lng;
        this.reverseGeocode(this.selectedLat, this.selectedLng).subscribe((res: any) => {
          this.eventForm.patchValue({
            address: res.display_name,
          });
        });
      }
    });
  }

  reverseGeocode(lat: number, lng: number) {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
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

  createEvent() {
    if (this.eventForm.invalid || !this.selectedLat || !this.selectedLng) {
      return;
    }

    const dateTime = `${this.eventForm.value.date}T${this.eventForm.value.time}`;

    const eventData: CreateEvent = {
      title: this.eventForm.value.title,
      description: this.eventForm.value.description,
      date: new Date(dateTime),
      address: this.eventForm.value.address,
      maxVolunteers: this.eventForm.value.maxVolunteers,
      latitude: this.selectedLat,
      longitude: this.selectedLng,
      wasteReportIds: this.reports.map((r) => r.id.toString()),
    };

    this.eventService.createEvent(eventData).subscribe({
      next: (res) => {
        console.log('Event created:', res);
        this.notificationService.success('Event created successfully.');
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Failed to create event:', err);
        this.notificationService.error('Failed to create event.');
      },
    });
  }
}
