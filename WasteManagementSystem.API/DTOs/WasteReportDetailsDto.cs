using WasteManagementSystem.API.Enum;

namespace WasteManagementSystem.API.DTOs
{
    public class WasteReportDetailsDto
    {
        public Guid Id { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string WasteType { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Status { get; set; }
        public List<WasteReportImageDto> Images { get; set; }
    }
}
