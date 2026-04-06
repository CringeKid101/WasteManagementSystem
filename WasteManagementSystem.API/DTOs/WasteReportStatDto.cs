using WasteManagementSystem.API.Enum;

namespace WasteManagementSystem.API.DTOs
{
    public class WasteReportStatDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public DateTime CreatedAt { get; set; }
        public string ReportedBy { get; internal set; }
        public string Status { get; internal set; }
    }
}
