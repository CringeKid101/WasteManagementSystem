using Org.BouncyCastle.Bcpg.OpenPgp;
using WasteManagementSystem.API.Enum;

namespace WasteManagementSystem.API.DTOs
{
    public class EventAllDto
    {
        public Guid? EventId { get; set; }
        public string Title { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Status { get; set; }
        public DateTime EventDate { get; set; }
        public string Address { get; set; }
        public bool IsJoined { get; set; }
        public int? TotalVolunteers { get; set; }
    }
}
