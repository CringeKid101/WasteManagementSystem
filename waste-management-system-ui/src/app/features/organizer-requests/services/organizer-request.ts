import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrganizerRequest {
  http: HttpClient;
  baseUrl = 'https://localhost:7019/api'; 

  constructor(http: HttpClient) {
    this.http = http;
  }

  public getAll() {
    return this.http.get(`${this.baseUrl}/organizer-requests`,{withCredentials: true}).pipe(
      catchError((error) => {
        return throwError(() => new Error('Failed to fetch organizer requests.'));
      }),
    );
  }
}
