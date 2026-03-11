using Microsoft.AspNetCore.Identity;

namespace WasteManagementSystem.API.Models
{
    public class PasswordResetOtp
    {
        public Guid Id { get; set; }

        public Guid UserId { get; set; }

        public string OtpCode { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }

        public DateTime ExpiresAt { get; set; }

        public bool IsUsed { get; set; }

        public IdentityUser<Guid>? User { get; set; }
    }
}