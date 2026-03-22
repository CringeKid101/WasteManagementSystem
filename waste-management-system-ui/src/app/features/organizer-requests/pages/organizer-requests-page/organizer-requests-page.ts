import { Component } from '@angular/core';
import { OrganizerRequestCard } from '../../components/organizer-request-card/organizer-request-card';
import { OrganizerRequestFilter } from '../../organizer-request-filter/organizer-request-filter';
import { OrganizerRequest } from '../../services/organizer-request';

@Component({
  selector: 'app-organizer-requests-page',
  imports: [OrganizerRequestCard, OrganizerRequestFilter],
  templateUrl: './organizer-requests-page.html',
  styleUrl: './organizer-requests-page.css',
})
export class OrganizerRequestsPage {
  organizerRequests: any;
  constructor(private organizerRequest: OrganizerRequest) {}

  ngOnInit() {
    this.organizerRequest.getAll().subscribe({
      next: (requests) => {
        this.organizerRequests = requests;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
