using NetTopologySuite.Geometries;
using WasteManagementSystem.API.Enum;

namespace WasteManagementSystem.API.Models
{
    public class WasteReport
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public WasteType WasteType { get; set; }
        public Point Location { get; set; }
        public string Address { get; set; }
        public string Landmark { get; set; }
        public ReportStatus Status { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public Guid? EventId { get; set; }
        public Event Event { get; set; }
        public Guid? ApprovedById { get; set; }
        public User ApprovedBy { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsDeleted { get; set; } = false;
        public List<WasteReportImage> Images { get; set; } = new();
    }
}
