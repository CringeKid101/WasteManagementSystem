using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WasteManagementSystem.API.Data;
using WasteManagementSystem.API.DTOs;
using WasteManagementSystem.API.Enum;
using WasteManagementSystem.API.Models;

namespace WasteManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrganizerRequestController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly UserManager<User> _userManager;

        public OrganizerRequestController(AppDbContext context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [Authorize]
        [HttpGet("organizer-requests")]
        public async Task<IActionResult> GetOrganizerRequests([FromQuery] RequestSearchFilterDto? filters)
        {

            var query = _context.OrganizerRequests.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filters.SearchText))
            {
                query = query.Where(w =>
                    w.User.FirstName.ToLower().Contains(filters.SearchText.ToLower())
                    || w.User.LastName.ToLower().Contains(filters.SearchText.ToLower())
                );
            }

            if (!String.IsNullOrEmpty(filters.RequestStatus))
            {
                System.Enum.TryParse<RequestStatus>(
                    filters.RequestStatus,
                    true,
                    out RequestStatus status
                );

                query = query.Where(w => (int)w.Status == (int)status);
            }
            var requests = await query.Where(o => o.ReviewedByAdminId == null)
                .Select(req => new OrganizerRequestDetailsDto
                {
                    Id = req.Id,
                    UserId = req.UserId,

                    UserName = _context
                        .Users.Where(u => u.Id == req.UserId)
                        .Select(u => u.FirstName + " " + u.LastName)
                        .FirstOrDefault(),

                    Email = _context
                        .Users.Where(u => u.Id == req.UserId)
                        .Select(u => u.Email)
                        .FirstOrDefault(),

                    EventsAttended = _context.EventAttendances.Count(e =>
                        e.UserId == req.UserId && e.IsAttended
                    ),

                    ReportsSubmitted = _context.WasteReports.Count(w => w.UserId == req.UserId),

                    Reason = req.Reason,
                    Status = req.Status.ToString(),
                    CreatedAt = req.CreatedAt,
                })
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();

            return Ok(requests);
        }

        [Authorize]
        [HttpPost("organizer-requests/request")]
        public async Task<IActionResult> CreateOrganizerRequest(
            [FromBody] CreateOrganizerRequestDto dto
        )
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var existing = await _context.OrganizerRequests.FirstOrDefaultAsync(x =>
                x.UserId == Guid.Parse(userId) && (x.Status == RequestStatus.Pending || x.Status == RequestStatus.Approved)
            );

            if (existing != null)
                return BadRequest("You already have a pending request.");

            var request = new OrganizerRequest
            {
                UserId = Guid.Parse(userId),
                Reason = dto.Reason,
                CreatedAt = DateTime.UtcNow,
                Status = RequestStatus.Pending,
            };

            _context.OrganizerRequests.Add(request);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Request submitted successfully" });
        }

        [Authorize]
        [HttpPost("organizer-requests/handle")]
        public async Task<IActionResult> HandleOrganizerRequest(
            [FromBody] HandleOrganizerRequestDto dto
        )
        {
            var request = await _context.OrganizerRequests.FirstOrDefaultAsync(x =>
                x.Id == dto.RequestId
            );

            if (request == null)
                return NotFound();

            if (request.Status != RequestStatus.Pending)
                return BadRequest("Request already handled");

            request.Status = dto.IsApproved ? RequestStatus.Approved : RequestStatus.Rejected;
            request.ReviewedByAdminId = Guid.Parse(
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            );
            if (dto.IsApproved)
            {
                var user = await _userManager.FindByIdAsync(request.UserId.ToString());
                if (user != null)
                {
                    if (await _userManager.IsInRoleAsync(user, "Admin"))
                    {
                        return BadRequest("Admins cannot be assigned as Organizer");
                    }
                    var result = await _userManager.AddToRoleAsync(user, "Organizer");

                    if (!result.Succeeded)
                        return BadRequest(result.Errors);
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Request handled successfully" });
        }

        [Authorize]
        [HttpGet("organizer-requests/eligibility")]
        public async Task<IActionResult> CheckOrganizerEligibility()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userId == null)
                return Unauthorized();

            var eventsAttended = await _context.EventAttendances.CountAsync(e =>
                e.UserId == Guid.Parse(userId) && e.IsAttended
            );

            var reportsSubmitted = await _context.WasteReports.CountAsync(w =>
                w.UserId == Guid.Parse(userId)
            );

            int minEvents = 1;
            int minReports = 1;

            bool isEligible = eventsAttended >= minEvents || reportsSubmitted >= minReports;

            return Ok(new { isEligible });
        }
    }
}
