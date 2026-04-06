using System;
using System.Security.Claims;
using CloudinaryDotNet;
using Google.Apis.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using WasteManagementSystem.API.Data;
using WasteManagementSystem.API.DTOs;
using WasteManagementSystem.API.Enum;
using WasteManagementSystem.API.Models;
using WasteManagementSystem.API.Services;

namespace WasteManagementSystem.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WasteReportController : ControllerBase
    {
        private AppDbContext _context;
        private IImageService _imageService;

        public WasteReportController(AppDbContext context, IImageService imageService)
        {
            _context = context;
            _imageService = imageService;
        }

        [Authorize]
        [HttpGet("waste-reports")]
        public async Task<IActionResult> GetReports([FromQuery] ReportSearchFilterDto? filters)
        {
            var query = _context.WasteReports.AsQueryable();

            // 🔍 Search (description + location)
            if (!string.IsNullOrWhiteSpace(filters.SearchText))
            {
                query = query.Where(w =>
                    w.Description.ToLower().Contains(filters.SearchText.ToLower())
                    || w.Address.ToLower().Contains(filters.SearchText.ToLower())
                );
            }

            if (!String.IsNullOrEmpty(filters.WasteType))
            {
                System.Enum.TryParse<WasteType>(filters.WasteType, true, out WasteType type);
                query = query.Where(w => (int)w.WasteType == (int)type);
            }

            if (!String.IsNullOrEmpty(filters.ReportStatus))
            {
                System.Enum.TryParse<ReportStatus>(
                    filters.ReportStatus,
                    true,
                    out ReportStatus status
                );

                query = query.Where(w => (int)w.Status == (int)status);
            }

            var reports = await query
                .Select(r => new WasteReportAllDto
                {
                    Id = r.Id,
                    EventId = r.EventId,
                    Description = r.Description,
                    Address = r.Address,
                    Landmark = r.Landmark,
                    Latitude = r.Location.Y,
                    Longitude = r.Location.X,
                    Status = r.Status.ToString(),
                    CreatedAt = r.CreatedAt,
                })
                .OrderByDescending(w => w.CreatedAt)
                .ToListAsync();

            return Ok(reports);
        }

        [Authorize]
        [HttpGet("waste-reports/{id}")]
        public async Task<IActionResult> GetReportById(Guid id)
        {
            var report = await _context
                .WasteReports.Include(r => r.Images)
                .Where(r => r.Id == id)
                .Select(r => new WasteReportDetailsDto
                {
                    Id = r.Id,
                    Description = r.Description,
                    Address = r.Address,

                    Latitude = r.Location.Y,
                    Longitude = r.Location.X,
                    WasteType = ((WasteType)r.WasteType).ToString(),
                    Status = r.Status.ToString(),

                    Images = r
                        .Images.Select(img => new WasteReportImageDto
                        {
                            Id = img.Id,
                            ImageUrl = img.ImageUrl,
                        })
                        .ToList(),
                })
                .FirstOrDefaultAsync();

            if (report == null)
                return NotFound();

            return Ok(report);
        }

        [Authorize]
        [HttpPatch("waste-reports/{id}/status")]
        public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateReportStatusDto dto)
        {
            var report = await _context.WasteReports.FindAsync(id);
            var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (report == null)
                return NotFound();

            // validate input
            if (!System.Enum.TryParse<ReportStatus>(dto.Status, true, out var status))
                return BadRequest("Invalid status");

            report.Status = status;
            report.UpdatedAt = DateTime.UtcNow;
            report.ApprovedById = userid != null ? Guid.Parse(userid) : Guid.Empty;

            await _context.SaveChangesAsync();

            return Ok(new { success = true });
        }

        [Authorize]
        [HttpPost("waste-report")]
        public async Task<IActionResult> CreateReport([FromForm] WasteReportDto reportDto)
        {
            var userid = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var geometryFactory = NtsGeometryServices.Instance.CreateGeometryFactory(srid: 4326);
            Point Location = geometryFactory.CreatePoint(
                new Coordinate(reportDto.Longitude, reportDto.Latitude)
            );

            var wasteReport = new WasteReport
            {
                Id = Guid.NewGuid(),
                UserId = userid != null ? Guid.Parse(userid) : Guid.Empty,
                Location = Location,
                Description = reportDto.Description,
                Address = reportDto.Address,
                Landmark = reportDto.Landmark,
                WasteType = reportDto.WasteType,
                CreatedAt = DateTime.UtcNow,
                Status = ReportStatus.Pending,
            };

            _context.WasteReports.Add(wasteReport);
            await _context.SaveChangesAsync();

            var images = await _imageService.UploadImagesAsync(
                reportDto.Images,
                wasteReport.Id.ToString(),
                "waste_reports"
            );

            // 3. Save Image Records
            var imageEntities = images
                .Select(img => new WasteReportImage
                {
                    WasteReportId = wasteReport.Id,
                    ImageUrl = img.Url,
                    PublicId = img.PublicId,
                })
                .ToList();

            _context.WasteReportImages.AddRange(imageEntities);
            await _context.SaveChangesAsync();

            return Ok(new { success = true, Id = wasteReport.Id });
        }

        [Authorize]
        [HttpGet("waste-reports/stats")]
        public async Task<IActionResult> GetWasteReportStats()
        {
            var stats = new WasteReportStatsDto
            {
                TotalReports = await _context.WasteReports.CountAsync(),

                PendingReports = await _context.WasteReports.CountAsync(w =>
                    w.Status == ReportStatus.Pending
                ),

                ApprovedReports = await _context.WasteReports.CountAsync(w =>
                    w.Status == ReportStatus.Approved
                ),

                RejectedReports = await _context.WasteReports.CountAsync(w =>
                    w.Status == ReportStatus.Rejected
                ),
            };

            return Ok(stats);
        }
    }
}
