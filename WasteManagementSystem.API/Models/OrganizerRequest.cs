using WasteManagementSystem.API.Enum;

namespace WasteManagementSystem.API.Models
{
    public class OrganizerRequest
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User User { get; set; }
        public string Reason { get; set; }
        public RequestStatus Status { get; set; } // Pending, Approved, Rejected
        public Guid? ReviewedByAdminId { get; set; }
        public User? ReviewedByAdmin { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ReviewedAt { get; set; }
        public bool IsDeleted { get; set; } = false;
    }
}
