import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { OrganizerRequestDetails } from '../../../../core/models/organizer-request-details.model';
import { NgClass } from '@angular/common';
import { DatePipe } from '@angular/common';
import { OrganizerRequest as OrganizerRequestService } from '../../services/organizer-request';
import { Notification } from '../../../../core/services/notification';

@Component({
  selector: 'app-organizer-request-card',
  imports: [MatIconModule, MatCardModule, MatButtonModule, NgClass, DatePipe],
  templateUrl: './organizer-request-card.html',
  styleUrl: './organizer-request-card.css',
})
export class OrganizerRequestCard implements OnInit {
  @Input() request: OrganizerRequestDetails | null = null;
  @Output() requestHandled = new EventEmitter<void>();
  constructor(
    private organiserRequest: OrganizerRequestService,
    private notificationService: Notification,
  ) {}

  ngOnInit(): void {
    console.log('Received request data:', this.request);
  }

  handleRequest(id: number | undefined, isApproved: boolean) {
    this.organiserRequest.handleOrganizerRequest(id!, isApproved).subscribe({
      next: (res) => {
        console.log(`Request ${isApproved ? 'approved' : 'rejected'}:`, res);
        this.requestHandled.emit();
        this.notificationService.success(
          `Request ${isApproved ? 'approved' : 'rejected'} successfully.`,
        );
      },
      error: (err) => {
        console.error(`Failed to ${isApproved ? 'approve' : 'reject'} request:`, err);
        this.notificationService.error(`Failed to ${isApproved ? 'approve' : 'reject'} request.`);
      },
    });
  }
}
