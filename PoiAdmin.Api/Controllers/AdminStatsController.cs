using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PoiAdmin.Application.DTOs;
using PoiAdmin.Infrastructure.Data;

namespace PoiAdmin.Api.Controllers;

[ApiController]
[Route("api/admin/stats")]
public class AdminStatsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminStatsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("overview")]
    public async Task<IActionResult> GetOverview()
    {
        var now = DateTime.UtcNow;
        var today = now.Date;
        var weekThreshold = now.AddDays(-7);
        var onlineThreshold = now.AddMinutes(-2);

        var totalApiCalls = await _context.ApiAccessLogs.CountAsync();

        var uniqueUsersCalledApi = await _context.ApiAccessLogs
            .Select(x => x.DeviceId)
            .Distinct()
            .CountAsync();

        var activeToday = await _context.ApiAccessLogs
            .Where(x => x.CreatedAt >= today)
            .Select(x => x.DeviceId)
            .Distinct()
            .CountAsync();

        var activeThisWeek = await _context.ApiAccessLogs
            .Where(x => x.CreatedAt >= weekThreshold)
            .Select(x => x.DeviceId)
            .Distinct()
            .CountAsync();

        var onlineNow = await _context.ApiAccessLogs
            .Where(x => x.CreatedAt >= onlineThreshold)
            .Select(x => x.DeviceId)
            .Distinct()
            .CountAsync();

        var result = new PoiApiStatsDto
        {
            TotalApiCalls = totalApiCalls,
            UniqueUsersCalledApi = uniqueUsersCalledApi,
            ActiveToday = activeToday,
            ActiveThisWeek = activeThisWeek,
            OnlineNow = onlineNow
        };

        return Ok(result);
    }

    // Get heatmap data for POIs based on API access logs in the last 7 days.
    [HttpGet("heatmap")]
    public async Task<IActionResult> GetHeatmap()
    {
        var fromDate = DateTime.UtcNow.AddDays(-7);

        var heatmapPoints = await _context.ApiAccessLogs
            .Where(x => x.PoiId != null && x.CreatedAt >= fromDate)
            .Join(
                _context.Pois,
                log => log.PoiId,
                poi => poi.PoiId,
                (log, poi) => new { log, poi }
            )
            .Where(x => x.poi.Latitude != null && x.poi.Longitude != null)
            .GroupBy(x => new
            {
                x.poi.PoiId,
                x.poi.Name,
                x.poi.Latitude,
                x.poi.Longitude
            })
            .Select(g => new PoiHeatmapPointDto
            {
                PoiId = g.Key.PoiId,
                Name = g.Key.Name,
                Latitude = (double)g.Key.Latitude!.Value,
                Longitude = (double)g.Key.Longitude!.Value,
                ViewCount = g.Count()
            })
            .OrderByDescending(x => x.ViewCount)
            .ToListAsync();

        return Ok(heatmapPoints);
    }
}