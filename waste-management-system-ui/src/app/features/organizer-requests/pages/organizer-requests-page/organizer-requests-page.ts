import { Component } from '@angular/core';
import { OrganizerRequestCard } from '../../components/organizer-request-card/organizer-request-card';
import { OrganizerRequestFilter } from '../../components/organizer-request-filter/organizer-request-filter';
import { OrganizerRequest as OrganizerRequestService } from '../../services/organizer-request';
import { RequestSearchFilter } from '../../../../core/models/request-search-filter.model';
import { OrganizerRequestDetails } from '../../../../core/models/organizer-request-details.model';

@Component({
  selector: 'app-organizer-requests-page',
  imports: [OrganizerRequestCard, OrganizerRequestFilter],
  templateUrl: './organizer-requests-page.html',
  styleUrl: './organizer-requests-page.css',
})
export class OrganizerRequestsPage {
  organizerRequests: OrganizerRequestDetails[] = [];
  constructor(private organizerRequest: OrganizerRequestService) {}

  ngOnInit() {
    this.refreshOrganizerRequests();
  }

  refreshOrganizerRequests() {
    this.organizerRequest.getAll().subscribe({
      next: (requests) => {
        this.organizerRequests = requests;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  onFilterChange(filters: any) {
    const searchFilters: RequestSearchFilter = {
      requestStatus: filters.status,
      searchText: filters.searchText,
    };

    this.organizerRequest.getAll(searchFilters).subscribe({
      next: (requests) => {
        this.organizerRequests = requests;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
