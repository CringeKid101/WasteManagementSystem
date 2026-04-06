import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError, catchError, Observable } from 'rxjs';
import { WasteReport as WasteReportModel } from '../../../core/models/waste-report.model';
import { WasteReportDetail } from '../../../core/models/waste-report-detail.model';
import { WasteReportsStats } from '../../../core/models/waste-reports-stats.model';
import { ReportSearchFilters } from '../../../core/models/report-search-filters.model';

@Injectable({
  providedIn: 'root',
})
export class WasteReport {
  private baseUrl = 'https://localhost:7019/api/wastereport';

  constructor(private http: HttpClient) {}

  public submitReport(reportData: FormData): Observable<{ success: boolean; Id: string }> {
    return this.http.post<{ success: boolean; Id: string }>(
      `${this.baseUrl}/waste-report`,
      reportData,
      {
        withCredentials: true,
      },
    );
  }

  public getReports(
    filters: ReportSearchFilters = { searchText: '', reportStatus: '', wasteType: '' },
  ): Observable<WasteReportModel[]> {
    // let params: any = {};

    // if (filters.searchText && filters.searchText.trim() !== '') {
    //   params.search = filters.searchText;
    // }

    // if (
    //   filters.reportstatus !== undefined &&
    //   filters.reportstatus !== null &&
    //   filters.reportstatus !== ''
    // ) {
    //   params.status = filters.reportstatus;
    // }

    // if (filters.wasteType !== undefined && filters.wasteType !== null && filters.wasteType !== '') {
    //   params.wasteType = filters.wasteType;
    // }
    return this.http.get<WasteReportModel[]>(`${this.baseUrl}/waste-reports`, {
      params: filters as any,
      withCredentials: true,
    });
  }

  public getReportById(id: string): Observable<WasteReportDetail> {
    return this.http.get<WasteReportDetail>(`${this.baseUrl}/waste-reports/${id}`, {
      withCredentials: true,
    });
  }

  public updateReportStatus(id: string, status: string): Observable<{ success: boolean }> {
    return this.http.patch<{ success: boolean }>(
      `${this.baseUrl}/waste-reports/${id}/status`,
      { status },
      {
        withCredentials: true,
      },
    );
  }

  public getWasteReportStats(): Observable<WasteReportsStats> {
    return this.http.get<WasteReportsStats>(`${this.baseUrl}/waste-reports/stats`, {
      withCredentials: true,
    });
  }
}
