using WasteManagementSystem.API.Enum;

namespace WasteManagementSystem.API.DTOs
{
    public class WasteReportAllDto
    {
        public Guid Id { get; set; }
        public Guid? EventId { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Status { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string Landmark { get; set; }
        public WasteType WasteType { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
