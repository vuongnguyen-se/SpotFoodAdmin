using Microsoft.AspNetCore.Mvc;
using PoiAdmin.Application.DTOs.Content;
using PoiAdmin.Application.Interfaces;

namespace PoiAdmin.Api.Controllers;

[ApiController]
[Route("api/pois/{poiId}/contents")]
public class PoiContentsController : ControllerBase
{
    private readonly IContentService _contentService;

    public PoiContentsController(IContentService contentService)
    {
        _contentService = contentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByPoiId(int poiId)
    {
        var result = await _contentService.GetByPoiIdAsync(poiId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(int poiId, [FromBody] CreateContentRequest request)
    {
        var id = await _contentService.CreateAsync(poiId, request);

        if (id == 0) return NotFound("POI not found.");
        if (id == -1) return BadRequest("Audio file not found.");

        return Ok(new { id });
    }
}