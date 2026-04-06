import { EventStats } from './event-stats.model';
import { WasteReportStats } from './waste-report-stats.model';

export interface DashboardStats {
  totalEvents: number;
  totalWasteReports: number;
  totalUsers: number;
  pendingOrganizerRequests: number;
  upcomingEvents: EventStats[];
  recentReports: WasteReportStats[];
}
