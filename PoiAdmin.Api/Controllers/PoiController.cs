using Microsoft.AspNetCore.Mvc;
using PoiAdmin.Application.DTOs.Poi;
using PoiAdmin.Application.Interfaces;

namespace PoiAdmin.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PoiController : ControllerBase
{
    private readonly IPoiService _poiService;

    public PoiController(IPoiService poiService)
    {
        _poiService = poiService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? keyword, [FromQuery] int? categoryId)
    {
        var result = await _poiService.GetAllAsync(keyword, categoryId);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _poiService.GetByIdAsync(id);
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