using Microsoft.AspNetCore.Identity;

namespace WasteManagementSystem.API.Models
{
    public class User: IdentityUser<Guid>
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int EventsAttendedCount { get; set; }
        public int WasteReportsSubmittedCount { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<WasteReport> WasteReports { get; set; }
        public ICollection<Event> CreatedEvents { get; set; }
        public ICollection<EventAttendance> EventAttendances { get; set; }
        public ICollection<OrganizerRequest> OrganizerRequests { get; set; }

    }
}
