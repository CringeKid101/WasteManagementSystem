namespace WasteManagementSystem.API.DTOs
{
    public class OrganizerRequestDetailsDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public int EventsAttended { get; set; }
        public int ReportsSubmitted { get; set; }
        public string? Reason { get; set; }
        public string Status { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
