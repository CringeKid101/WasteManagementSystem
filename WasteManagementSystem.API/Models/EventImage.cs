namespace WasteManagementSystem.API.Models
{
    public class EventImage
    {
        public Guid Id { get; set; }
        public Guid EventId { get; set; }
        public string ImageUrl { get; set; }
        public string PublicId { get; set; }
        public Event Event { get; set; }
    }
}
