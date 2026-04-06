import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { WasteType } from '../../../../core/models/waste-type-enum';
import { RequestStatus } from '../../../../core/models/request-status-enum';
import { WasteReport as WasteReportService } from '../../services/waste-report';
import { ReportSearchFilters } from '../../../../core/models/report-search-filters.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-report-filters',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatLabel,
  ],
  templateUrl: './report-filters.html',
  styleUrl: './report-filters.css',
})
export class ReportFilters implements OnInit {
  statusOptions = Object.values(RequestStatus);
  wasteTypeOptions = Object.values(WasteType);
  reportFilterForm!: FormGroup;
  @Output() filtersChanged = new EventEmitter<ReportSearchFilters>();
  searchSubject = new Subject<string>();
  searchText: string = '';

  constructor(
    private fb: FormBuilder,
    private wasteReportService: WasteReportService,
  ) {}

  ngOnInit(): void {
    this.reportFilterForm = this.fb.group({
      wasteType: [''],
      reportStatus: [''],
      searchText: [''],
    });

    this.searchSubject
      .pipe(
        debounceTime(400), // wait 400ms after typing stops
        distinctUntilChanged(), // ignore same value
      )
      .subscribe((value) => {
        this.emitFilters();
      });
  }

  onSearchChange(value: string) {
    this.searchText = value;
    this.searchSubject.next(value);
  }

  clearFilter() {
    this.reportFilterForm.reset({ searchText: '', reportStatus: '', wasteType: '' });
    const filters: ReportSearchFilters = this.reportFilterForm.value;
    this.filtersChanged.emit(filters);
  }

  emitFilters() {
    const filters: ReportSearchFilters = this.reportFilterForm.value;
    filters.searchText = this.searchText;
    this.filtersChanged.emit(filters);
  }
}
