import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CreateEvent } from '../../../core/models/create-event.model';
import { Observable } from 'rxjs';
import { Events } from '../../../core/models/events.model';

@Injectable({
  providedIn: 'root',
})
export class Event {
  private readonly baseUrl = 'https://localhost:7019/api/event';
  constructor(private http: HttpClient) {}

  public createEvent(eventData: CreateEvent): Observable<{success: boolean, eventId: string}> {
    return this.http.post<{success: boolean, eventId: string}>(`${this.baseUrl}/create-event`, eventData, {
      withCredentials: true,
    });
  }

  public getEvents(): Observable<Events[]> {
    return this.http.get<Events[]>(`${this.baseUrl}/get-events`, {
      withCredentials: true,
    });
  }

  public getEventDetails(eventId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/event-details/${eventId}`, {
      withCredentials: true,
    });
  }

  public handleEvent(eventId: string): Observable<{message: string, isJoined: boolean}> {
    return this.http.post<{message: string, isJoined: boolean}>(`${this.baseUrl}/handle-event/${eventId}`, {}, {
      withCredentials: true,
    });
  }
}

