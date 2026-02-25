namespace WasteManagementSystem.API.Models
{
    public class User
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? ProfileImageUrl { get; set; }
        public int EventsAttendedCount { get; set; } = 0;
        public int WasteReportsCount { get; set; } = 0;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
    }
}
