namespace WasteManagementSystem.API.DTOs
{
    public class EventStatDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public DateTime EventDate { get; set; }
        public string LocationName { get; set; }
        public string Status { get; internal set; }
    }
}
