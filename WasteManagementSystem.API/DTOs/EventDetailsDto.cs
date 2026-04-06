namespace WasteManagementSystem.API.DTOs
{
    public class EventDetailsDto
    {
        public Guid EventId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

        public double Latitude { get; set; }
        public double Longitude { get; set; }

        public string Address { get; set; }
        public DateTime EventDate { get; set; }

        public List<string> WasteImages { get; set; }

        public List<WasteLocationDto> WasteLocations { get; set; }
    }

    public class WasteLocationDto
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }
}
