namespace WasteManagementSystem.API.DTOs
{
    public class AdminDashboardDto
    {
        public int TotalUsers { get; set; }
        public int TotalWasteReports { get; set; }
        public int PendingOrganizerRequests { get; set; }
        public int TotalEvents { get; set; }

        public List<EventStatDto> UpcomingEvents { get; set; }
        public List<WasteReportStatDto> RecentReports { get; set; }
    }
}
