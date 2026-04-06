using NetTopologySuite.Geometries;
using WasteManagementSystem.API.Enum;

namespace WasteManagementSystem.API.Models
{
    public class Event
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public string LocationName { get; set; }
        public Point Location { get; set; }
        public string QrCodeValue { get; set; }
        public int? MaxParticipants { get; set; }
        public EventStatus Status { get; set; }
        public Guid OrganizerId { get; set; }
        public User Organizer { get; set; }
        public bool IsDeleted { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public ICollection<EventAttendance> Attendances { get; set; }
        public ICollection<WasteReport> WasteReports { get; set; }
    }
}
