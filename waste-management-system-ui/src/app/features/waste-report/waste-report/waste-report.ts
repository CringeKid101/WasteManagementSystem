import { AfterViewInit, Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { WasteType } from '../../../core/models/waste-type-enum';
import { MatError } from '@angular/material/form-field';
import * as L from 'leaflet';
import EXIF from 'exif-js';
import { HttpClient } from '@angular/common/http';
import { WasteReport as WasteReportService } from '../services/waste-report';
import { MatDialogRef } from '@angular/material/dialog';
import { Notification } from '../../../core/services/notification';

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
    MatError,
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

  locationSet: boolean = false;

  constructor(
    private fb: FormBuilder,
    private wasteReportService: WasteReportService,
    private http: HttpClient,
    private dialogRef: MatDialogRef<WasteReport>,
    private notificationService: Notification,
  ) {}

  ngOnInit(): void {
    this.reportForm = this.fb.group({
      description: ['', Validators.required],
      address: ['', Validators.required],
      landmark: [''],
      wastetype: ['', Validators.required],
      images: [[], Validators.required],
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

    this.useCurrentLocation();

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
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    );
  }

  useCurrentLocation() {
    navigator.geolocation.getCurrentPosition((pos) => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
      this.updateMapMarker();
      this.reverseGeocode(this.lat, this.lng).subscribe((res: any) => {
        this.reportForm.patchValue({
          address: res.display_name,
        });
      });
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) return;

    // 1. Convert FileList to Array and add to your collection
    const newFiles = Array.from(files);
    this.selectedFiles.push(...newFiles);

    // 2. Update the FormBuilder control
    this.reportForm.patchValue({ images: this.selectedFiles });
    this.reportForm.get('images')?.markAsTouched(); // Mark as touched for validation
    this.reportForm.get('images')?.updateValueAndValidity();

    // 3. Process each file for previews and metadata
    newFiles.forEach((file: File) => {
      const reader = new FileReader();

      reader.onload = () => {
        // Add to preview array
        this.previewUrls.push(reader.result as string);

        // 4. Extract Location (only if not already set by a previous image)
        if (!this.locationSet) {
          this.extractGpsData(file);
        }
      };

      reader.readAsDataURL(file);
    });
  }

  private extractGpsData(file: File) {
    EXIF.getData(file as any, () => {
      const lat = EXIF.getTag(file, 'GPSLatitude');
      const lng = EXIF.getTag(file, 'GPSLongitude');
      const latRef = EXIF.getTag(file, 'GPSLatitudeRef');
      const lngRef = EXIF.getTag(file, 'GPSLongitudeRef');

      if (lat && lng) {
        this.lat = this.convertToDecimal(lat, latRef);
        this.lng = this.convertToDecimal(lng, lngRef);

        this.updateMapMarker();
        this.reverseGeocode(this.lat, this.lng).subscribe((res: any) => {
          this.reportForm.patchValue({ address: res.display_name });
        });
        this.locationSet = true;
      }
    });
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewUrls.splice(index, 1);
    this.reportForm.patchValue({ images: this.selectedFiles });
    this.reportForm.get('images')?.markAsTouched();
    this.reportForm.get('images')?.updateValueAndValidity();
  }

  convertToDecimal(coord: any, ref: string): number {
    // coord[0] = degrees, coord[1] = minutes, coord[2] = seconds
    let decimal = coord[0] + coord[1] / 60 + coord[2] / 3600;

    // S (South) and W (West) must be negative
    if (ref === 'S' || ref === 'W') {
      decimal = decimal * -1;
    }

    return decimal;
  }
  updateMapMarker() {
    if (this.marker) {
      this.marker.setLatLng([this.lat, this.lng]);
      this.map.setView([this.lat, this.lng], 15);
    }
  }

  submitReport() {
    if (this.reportForm.invalid) return;
    const formData = new FormData();

    formData.append('description', this.reportForm.value.description);
    formData.append('latitude', this.lat.toString());
    formData.append('longitude', this.lng.toString());
    formData.append('address', this.reportForm.value.address);
    formData.append('landmark', this.reportForm.value.landmark);
    formData.append('wastetype', this.reportForm.value.wastetype);

    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach((file) => {
        // Use the SAME key name for every file in the list
        formData.append('Images', file, file.name);
      });
    }

    this.wasteReportService.submitReport(formData).subscribe({
      next: (res) => {
        console.log('Report submitted successfully', res);
        this.dialogRef.close(true);
        this.notificationService.success('Report submitted successfully.');
      },
      error: (err) => {
        console.error('Failed to submit report', err);
        this.notificationService.error('Failed to submit report.');
      },
    });
  }
}
