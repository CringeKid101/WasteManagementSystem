using Org.BouncyCastle.Bcpg.OpenPgp;

namespace WasteManagementSystem.API.DTOs
{
    public class ReportSearchFilterDto
    {
        public string? SearchText { get; set; }
        public string? ReportStatus { get; set; }
        public string? WasteType { get; set; }
    }
}
