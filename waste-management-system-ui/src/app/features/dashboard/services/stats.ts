import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class Stats {
  private readonly baseUrl = 'https://localhost:7019/api/stats';
  constructor(private http: HttpClient) {}



  getDashboardData() {
  return this.http.get<any>(`${this.baseUrl}/stats`, {
    withCredentials: true
  });
}
}
