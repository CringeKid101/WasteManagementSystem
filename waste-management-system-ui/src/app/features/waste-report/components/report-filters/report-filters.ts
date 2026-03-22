import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { WasteType } from '../../../../core/models/waste-type-enum';
import { RequestStatus } from '../../../../core/models/request-status-enum';

@Component({
  selector: 'app-report-filters',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatLabel
  ],
  templateUrl: './report-filters.html',
  styleUrl: './report-filters.css',
})
export class ReportFilters {
statusOptions = Object.values(RequestStatus);
    wasteTypeOptions = Object.values(WasteType);
  
}
