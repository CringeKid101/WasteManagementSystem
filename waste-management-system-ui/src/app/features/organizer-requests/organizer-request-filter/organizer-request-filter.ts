import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { WasteType } from '../../../core/models/waste-type-enum';
import { RequestStatus } from '../../../core/models/request-status-enum';

@Component({
  selector: 'app-organizer-request-filter',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatLabel,
  ],
  templateUrl: './organizer-request-filter.html',
  styleUrl: './organizer-request-filter.css',
})
export class OrganizerRequestFilter implements OnInit {
  searchForm!: FormGroup;

  statusOptions = Object.values(RequestStatus);
  wasteTypeOptions = Object.values(WasteType);

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      search: new FormControl(''),
      status: new FormControl(''),
      wastetype: new FormControl(''),
    });
  }
  clearFilters() {
    this.searchForm.reset();
  }

  submitSearch() {
    const filters = this.searchForm.value;
  }

  clearSearch() {
    this.searchForm.get('search')?.setValue('');
  }
}
