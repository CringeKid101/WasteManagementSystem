using WasteManagementSystem.API.Enum;

namespace WasteManagementSystem.API.DTOs
{
    public class WasteReportDto
    {
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string Landmark { get; set; }
        public WasteType WasteType { get; set; }
        public List<IFormFile> Images { get; set; }
    }
}
