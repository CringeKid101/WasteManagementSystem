import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { WasteType } from '../../../core/models/waste-type-enum';
import * as L from 'leaflet';
import EXIF from 'exif-js';
import { HttpClient } from '@angular/common/http';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: '/leaflet/marker-icon.png',
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

@Component({
  selector: 'app-waste-report',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatLabel,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './waste-report.html',
  styleUrl: './waste-report.css',
})
export class WasteReport implements OnInit, AfterViewInit {
  reportForm!: FormGroup;
  previewUrls: string[] = [];
  selectedFiles: File[] = [];
  wasteTypeOptions = Object.values(WasteType);

  lat: number = 0;
  lng: number = 0;
  map: any;
  marker: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      description: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      address: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  initMap() {
    this.map = L.map('map').setView([12.39395, 76.775368], 13); // default (Coimbatore or user city)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.map);

    this.marker = L.marker([12.39395, 76.775368], {
      draggable: true,
    }).addTo(this.map);

    this.marker.on('dragend', (event: any) => {
      const position = event.target.getLatLng();
      this.lat = position.lat;
      this.lng = position.lng;
      this.reverseGeocode(this.lat, this.lng).subscribe((res: any) => {
        this.reportForm.patchValue({
          address: res.display_name,
        });
      });
    });

    this.map.on('click', (e: any) => {
      this.lat = e.latlng.lat;
      this.lng = e.latlng.lng;
      this.marker.setLatLng(e.latlng);
      this.reverseGeocode(this.lat, this.lng).subscribe((res: any) => {
        this.reportForm.patchValue({
          address: res.display_name,
        });
      });
    });
  }

  reverseGeocode(lat: number, lng: number) {
  return this.http.get(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
  );
}

  useCurrentLocation() {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
      this.updateMapMarker();
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedFiles.push(file);
      this.reportForm.patchValue({ image: file });
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls.push(reader.result as string);

        // EXIF extraction
        EXIF.getData(file, () => {
          const lat = EXIF.getTag(file, 'GPSLatitude');
          const lng = EXIF.getTag(file, 'GPSLongitude');

          if (lat && lng) {
            this.lat = this.convertToDecimal(lat);
            this.lng = this.convertToDecimal(lng);

            this.updateMapMarker();
          }
        });
      };
      reader.readAsDataURL(file);
    }
  }

  convertToDecimal(coord: any): number {
    return coord[0] + coord[1] / 60 + coord[2] / 3600;
  }

  updateMapMarker() {
    if (this.marker) {
      this.marker.setLatLng([this.lat, this.lng]);
      this.map.setView([this.lat, this.lng], 15);
    }
  }

  submitReport() {
    const formData = new FormData();

    formData.append('description', this.reportForm.value.description);
    formData.append('location', this.reportForm.value.location);

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file, index) => {
        formData.append(`image${index}`, file);
      });
    }

    // this.http.post('/api/waste-report', formData, {
    //   withCredentials: true
    // }).subscribe(res => {
    //   console.log('Report submitted');
    // });
  }
}
