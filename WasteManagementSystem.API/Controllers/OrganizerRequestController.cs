using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WasteManagementSystem.API.Data;

namespace WasteManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganizerRequestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public OrganizerRequestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("organizer-requests")]
        public async Task<IActionResult> GetOrganizerRequests()
        {
            var requests = await _context.OrganizerRequests.ToListAsync();
            if (requests.Any())
            {
                return Ok(requests);
            }

            return Ok();
        }
    }
}
