namespace WasteManagementSystem.API.Models
{
    public class WasteReportImage
    {
        public Guid Id { get; set; }
        public Guid WasteReportId { get; set; }
        public string ImageUrl { get; set; }
        public string PublicId { get; set; }
        public WasteReport WasteReport { get; set; }
    }
}
