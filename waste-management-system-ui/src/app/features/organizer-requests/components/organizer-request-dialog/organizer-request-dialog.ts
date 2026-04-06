import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { OrganizerRequest as OrganizerRequestService } from '../../services/organizer-request';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/form-field';
import { MatError } from '@angular/material/form-field';
import { RequestOrganizerRole } from '../../../../core/models/request-organizer-role.model';
import { Notification } from '../../../../core/services/notification';

@Component({
  selector: 'app-organizer-request-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatLabel,
    MatError,
  ],
  templateUrl: './organizer-request-dialog.html',
  styleUrl: './organizer-request-dialog.css',
})
export class OrganizerRequestDialog implements OnInit {
  organizerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private organizerRequestService: OrganizerRequestService,
    private dialogRef: MatDialogRef<OrganizerRequestDialog>,
    private notificationService: Notification,
  ) {}

  ngOnInit(): void {
    this.organizerForm = this.fb.group({
      reason: ['', [Validators.required]],
    });
  }
  requestOrganizerRole() {
    var organizerRequestData: RequestOrganizerRole = {
      reason: this.organizerForm.value.reason,
    };
    this.organizerRequestService.requestOrganizerRole(organizerRequestData).subscribe({
      next: () => {
        this.dialogRef.close();
        this.notificationService.success('Your request to become an organizer has been submitted successfully.');
      },
      error: (err) => {
        this.notificationService.error('Failed to submit your request to become an organizer.');
      },
    });
  }
}
