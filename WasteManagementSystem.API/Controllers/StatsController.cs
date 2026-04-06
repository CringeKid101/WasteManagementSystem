using Microsoft.AspNetCore.Authorization;
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
    public class StatsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public StatsController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("stats")]
        public async Task<IActionResult> GetDashboardData()
        {
            var now = DateTime.UtcNow;

            var data = new AdminDashboardDto
            {
                TotalUsers = await _context.Users.CountAsync(),

                TotalWasteReports = await _context.WasteReports.CountAsync(),

                PendingOrganizerRequests = await _context.OrganizerRequests.CountAsync(r =>
                    r.Status == RequestStatus.Pending
                ),

                TotalEvents = await _context.Events.CountAsync(),

                UpcomingEvents = _context
                    .Events.Where(e => e.Status == 0)
                    .OrderBy(e => e.EventDate)
                    .Take(5)
                    .AsEnumerable()
                    .Select(e =>
                    {
                        var parts = e.LocationName?.Split(',');
                        return new EventStatDto
                        {
                            Id = e.Id,
                            Title = e.Title,
                            EventDate = e.EventDate,
                            LocationName =
                                (parts != null && parts.Length >= 3)
                                    ? $"{parts[1].Trim()}, {parts[2].Trim()}"
                                    : e.LocationName,
                            Status = e.Status.ToString(),
                        };
                    })
                    .ToList(),

                RecentReports = await _context
                    .WasteReports.OrderByDescending(w => w.CreatedAt)
                    .Take(5)
                    .Select(w => new WasteReportStatDto
                    {
                        Id = w.Id,
                        Description = w.Description,
                        Address = w.Address,
                        CreatedAt = w.CreatedAt,
                        ReportedBy = w.User.FirstName + " " + w.User.LastName,
                        Status = w.Status.ToString(),
                    })
                    .ToListAsync(),
            };

            return Ok(data);
        }
    }
}
