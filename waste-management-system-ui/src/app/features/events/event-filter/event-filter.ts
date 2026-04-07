import { Component, Output, EventEmitter } from '@angular/core';
import { OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { EventStatus } from '../../../core/models/event-status.enum';
import { EventSearchFilters } from '../../../core/models/event-search-filters.model';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-event-filter',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './event-filter.html',
  styleUrl: './event-filter.css',
})
export class EventFilter implements OnInit {
  statusOptions = Object.values(EventStatus);
  filterForm!: FormGroup;
  @Output() filtersChanged = new EventEmitter<EventSearchFilters>();
  searchSubject = new Subject<string>();
  searchText: string = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      searchText: [''],
      status: [''],
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
    this.filterForm.reset({ searchText: '', status:''});
    const filters: EventSearchFilters = this.filterForm.value;
    this.filtersChanged.emit(filters);
  }

  emitFilters() {
    const filters: EventSearchFilters = this.filterForm.value;
    filters.searchText = this.searchText;
    this.filtersChanged.emit(filters);
  }
}
