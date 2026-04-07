using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using Org.BouncyCastle.Asn1;
using QRCoder;
using WasteManagementSystem.API.Data;
using WasteManagementSystem.API.DTOs;
using WasteManagementSystem.API.Enum;
using WasteManagementSystem.API.Models;
using WasteManagementSystem.API.Services;

namespace WasteManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IImageService _imageService;

        public EventController(AppDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        [Authorize]
        [HttpGet("get-events")]
        public async Task<IActionResult> GetEvents([FromQuery] EventSearchFilterDto? filters)
        {
            var query = _context.Events.AsQueryable();

            if (!string.IsNullOrWhiteSpace(filters.SearchText))
            {
                query = query.Where(w =>
                    w.Description.ToLower().Contains(filters.SearchText.ToLower())
                    || w.Title.ToLower().Contains(filters.SearchText.ToLower())
                );
            }

            if (!String.IsNullOrEmpty(filters.EventStatus))
            {
                System.Enum.TryParse<EventStatus>(
                    filters.EventStatus,
                    true,
                    out EventStatus status
                );

                query = query.Where(w => (int)w.Status == (int)status);
            }
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var events = await query
                .Select(e => new
                {
                    e.Id,
                    e.Title,
                    e.Location,
                    e.LocationName,
                    e.Status,
                    e.EventDate,
                    IsJoined = e.Attendances.Any(a => a.UserId == Guid.Parse(userId)),
                    TotalVolunteers = e.Attendances.Count(),
                })
                .ToListAsync();

            var result = events
                .Select(e =>
                {
                    var parts = e.LocationName?.Split(',');

                    string shortAddress = e.LocationName;

                    if (parts != null && parts.Length >= 3)
                    {
                        shortAddress = $"{parts[1].Trim()}, {parts[2].Trim()}";
                    }

                    return new EventAllDto
                    {
                        EventId = e.Id,
                        Title = e.Title,
                        Latitude = e.Location.Y,
                        Longitude = e.Location.X,
                        Address = shortAddress,
                        Status = e.Status.ToString(),
                        EventDate = e.EventDate,
                        IsJoined = e.IsJoined,
                        TotalVolunteers = e.TotalVolunteers,
                    };
                })
                .ToList();

            return Ok(result);
        }

        [Authorize]
        [HttpGet("event-details/{id}")]
        public async Task<IActionResult> GetEventDetails(Guid id)
        {
            var eventData = await _context
                .Events.Where(e => e.Id == id)
                .Select(e => new EventDetailsDto
                {
                    EventId = e.Id,
                    Title = e.Title,
                    Description = e.Description,
                    Latitude = e.Location.Y,
                    Longitude = e.Location.X,
                    Address = e.LocationName,
                    EventDate = e.EventDate,

                    WasteImages = e
                        .WasteReports.SelectMany(w => w.Images)
                        .Select(i => i.ImageUrl)
                        .ToList(),

                    WasteLocations = e
                        .WasteReports.Select(w => new WasteLocationDto
                        {
                            Lat = w.Location.Y,
                            Lng = w.Location.X,
                        })
                        .ToList(),
                })
                .FirstOrDefaultAsync();

            if (eventData == null)
                return NotFound();

            var parts = eventData.Address?.Split(',');
            string shortAddress = eventData.Address;
            if (parts != null && parts.Length >= 3)
            {
                shortAddress = $"{parts[1].Trim()}, {parts[2].Trim()}";
            }

            eventData.Address = shortAddress;

            return Ok(eventData);
        }

        [Authorize]
        [HttpPost("create-event")]
        public async Task<IActionResult> CreateEvent([FromBody] CreateEventDto dto)
        {
            var eventId = Guid.NewGuid();
            var qrValue = $"event:{eventId}";
            var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var qrImageBytes = GenerateQrCode(qrValue);
            var eventEntity = new Event
            {
                Id = eventId,
                OrganizerId = userid != null ? Guid.Parse(userid) : Guid.Empty,
                Title = dto.Title,
                Description = dto.Description,
                QrCodeValue = qrValue,
                EventDate = dto.EventDate,
                Status = Enum.EventStatus.Upcoming,
                LocationName = dto.Address,
                MaxParticipants = dto.MaxParticipants,
                CreatedAt = DateTime.UtcNow,
                Location = new Point(dto.Longitude, dto.Latitude) { SRID = 4326 },
            };

            _context.Events.Add(eventEntity);

            var images = await _imageService.UploadQrAsync(
                qrImageBytes,
                eventId.ToString(),
                "events"
            );

            var imageEntities = images
                .Select(img => new EventImage
                {
                    EventId = eventId,
                    ImageUrl = img.Url,
                    PublicId = img.PublicId,
                })
                .ToList();

            _context.EventImages.AddRange(imageEntities);
            await _context.SaveChangesAsync();

            if (dto.WasteReportIds != null && dto.WasteReportIds.Any())
            {
                var reports = await _context
                    .WasteReports.Where(r => dto.WasteReportIds.Contains(r.Id))
                    .ToListAsync();

                foreach (var report in reports)
                {
                    report.EventId = eventEntity.Id;
                    report.UpdatedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { success = true, eventId = eventEntity.Id });
        }

        [Authorize]
        [HttpPost("handle-event/{eventId}")]
        public async Task<IActionResult> ToggleJoin(Guid eventId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var attendance = await _context.EventAttendances.FirstOrDefaultAsync(a =>
                a.EventId == eventId && a.UserId == Guid.Parse(userId)
            );

            if (attendance == null)
            {
                var newAttendance = new EventAttendance
                {
                    Id = Guid.NewGuid(),
                    EventId = eventId,
                    UserId = Guid.Parse(userId),
                    JoinedAt = DateTime.UtcNow,
                };

                _context.EventAttendances.Add(newAttendance);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Joined event", isJoined = true });
            }

            if (attendance.IsAttended)
            {
                return BadRequest("Already attended. Cannot cancel.");
            }

            _context.EventAttendances.Remove(attendance);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Left event", isJoined = false });
        }

        public byte[] GenerateQrCode(string value)
        {
            using var qrGenerator = new QRCodeGenerator();
            var qrData = qrGenerator.CreateQrCode(value, QRCodeGenerator.ECCLevel.Q);

            var qrCode = new PngByteQRCode(qrData);

            return qrCode.GetGraphic(20);
        }
    }
}
