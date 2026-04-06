namespace WasteManagementSystem.API.Models
{
    public class EventAttendance
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public Event Event { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
        public bool IsAttended { get; set; } = false;
        public DateTime? AttendedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
    }
}
