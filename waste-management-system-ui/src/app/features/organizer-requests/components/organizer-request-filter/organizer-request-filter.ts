import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatLabel } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RequestStatus } from '../../../../core/models/request-status-enum';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { RequestSearchFilter } from '../../../../core/models/request-search-filter.model';
import { Subject } from 'rxjs';

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
  filterForm!: FormGroup;
  statusOptions = Object.values(RequestStatus);
  @Output() filtersChanged = new EventEmitter<RequestSearchFilter>();
  searchSubject = new Subject<string>();
  searchText: string = '';

  ngOnInit(): void {
    this.filterForm = new FormGroup({
      searchText: new FormControl(''),
      status: new FormControl(''),
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
    this.filterForm.reset({ searchText: '', status: '' });
    const filters: RequestSearchFilter = this.filterForm.value;
    this.filtersChanged.emit(filters);
  }

  emitFilters() {
    const filters: RequestSearchFilter = this.filterForm.value;
    filters.searchText = this.searchText;
    this.filtersChanged.emit(filters);
  }
}
