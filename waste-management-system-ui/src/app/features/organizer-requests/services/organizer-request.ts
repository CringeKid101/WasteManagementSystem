import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RequestOrganizerRole } from '../../../core/models/request-organizer-role.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizerRequest {
  http: HttpClient;
  baseUrl = 'https://localhost:7019/api/organizerrequest';

  constructor(http: HttpClient) {
    this.http = http;
  }

  public getAll() {
    return this.http.get(`${this.baseUrl}/organizer-requests`, { withCredentials: true }).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to fetch organizer requests.'));
      }),
    );
  }

  public requestOrganizerRole(data: RequestOrganizerRole) {
    return this.http
      .post(`${this.baseUrl}/organizer-requests/request`, data, { withCredentials: true })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Failed to submit organizer role request.'));
        }),
      );
  }

  public handleOrganizerRequest(requestId: number, isApproved: boolean) {
    return this.http.post(
      `${this.baseUrl}/organizer-requests/handle`,
      {
        requestId,
        isApproved,
      },
      {
        withCredentials: true,
      },
    );
  }

  public getEligibility(): Observable<{ eligible: boolean }> {
    return this.http.get<{ eligible: boolean }>(`${this.baseUrl}/organizer-requests/eligibility`, { withCredentials: true }).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to fetch organizer request eligibility.'));
      }),
    );
  }
}
