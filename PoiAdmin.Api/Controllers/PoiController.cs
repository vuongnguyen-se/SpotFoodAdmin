using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PoiAdmin.Application.DTOs.Poi;
using PoiAdmin.Application.Interfaces;
using PoiAdmin.Domain.Entities;
using PoiAdmin.Infrastructure.Data;

namespace PoiAdmin.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PoiController : ControllerBase
{
    private readonly IPoiService _poiService;
    private readonly AppDbContext _context;

    public PoiController(IPoiService poiService, AppDbContext context)
    {
        _poiService = poiService;
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? keyword, [FromQuery] int? categoryId)
    {
        var result = await _poiService.GetAllAsync(keyword, categoryId);
        return Ok(result);
    }

    //[HttpGet("{id}")]
    //public async Task<IActionResult> GetById(int id)
    //{
    //    var result = await _poiService.GetByIdAsync(id);
    //    if (result == null) return NotFound();
    //    return Ok(result);
    //}

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _poiService.GetByIdAsync(id);

        var deviceId = Request.Headers["x-device-id"].ToString();

        var log = new ApiAccessLog
        {
            DeviceId = string.IsNullOrWhiteSpace(deviceId) ? "unknown-device" : deviceId,
            Endpoint = $"/api/pois/{id}",
            HttpMethod = "GET",
            PoiId = id,
            StatusCode = result == null ? 404 : 200,
            CreatedAt = DateTime.UtcNow
        };

        _context.ApiAccessLogs.Add(log);
        await _context.SaveChangesAsync();

        if (result == null) return NotFound();

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreatePoiRequest request)
    {
        var id = await _poiService.CreateAsync(request);
        return Ok(new { id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreatePoiRequest request)
    {
        var updated = await _poiService.UpdateAsync(id, request);
        if (!updated) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _poiService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}