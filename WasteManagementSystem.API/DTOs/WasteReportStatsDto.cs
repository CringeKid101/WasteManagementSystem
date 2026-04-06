namespace WasteManagementSystem.API.DTOs
{
    internal class WasteReportStatsDto
    {
        public int TotalReports { get; set; }
        public int PendingReports { get; set; }
        public int ApprovedReports { get; set; }
        public int RejectedReports { get; set; }
    }
}
