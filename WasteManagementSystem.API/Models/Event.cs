namespace WasteManagementSystem.API.Models
{
    public class Event
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public string LocationName { get; set; }
        public string QrCodeValue { get; set; }
        public Guid OrganizerId { get; set; }
        public User Organizer { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public ICollection<EventAttendance> Attendances { get; set; }
        public ICollection<WasteReport> WasteReports { get; set; }
    }
}
    
