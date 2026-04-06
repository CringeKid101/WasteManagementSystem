namespace WasteManagementSystem.API.DTOs
{
    public class CreateEventDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime EventDate { get; set; }
        public string Address { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int? MaxParticipants { get; set; }
        public List<Guid> WasteReportIds { get; set; }
    }
}
