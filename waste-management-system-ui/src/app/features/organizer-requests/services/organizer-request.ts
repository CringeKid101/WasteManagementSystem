import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { RequestOrganizerRole } from '../../../core/models/request-organizer-role.model';
import { RequestSearchFilter } from '../../../core/models/request-search-filter.model';
import { OrganizerRequestDetails } from '../../../core/models/organizer-request-details.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizerRequest {
  http: HttpClient;
  baseUrl = 'https://localhost:7019/api/organizerrequest';

  constructor(http: HttpClient) {
    this.http = http;
  }

  public getAll(filters: RequestSearchFilter = { searchText: '', requestStatus: '' }): Observable<OrganizerRequestDetails[]> {
    return this.http.get<OrganizerRequestDetails[]>(`${this.baseUrl}/organizer-requests`, {
      params: filters as any,
      withCredentials: true,
    });
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

  public getEligibility(): Observable<{ isEligible: boolean }> {
    return this.http
      .get<{
        isEligible: boolean;
      }>(`${this.baseUrl}/organizer-requests/eligibility`, { withCredentials: true })
      .pipe(
        catchError((error) => {
          return throwError(() => new Error('Failed to fetch organizer request eligibility.'));
        }),
      );
  }
}
