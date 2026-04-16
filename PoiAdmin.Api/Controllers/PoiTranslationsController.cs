using Microsoft.AspNetCore.Mvc;
using PoiAdmin.Application.DTOs.Translation;
using PoiAdmin.Application.Interfaces;

namespace PoiAdmin.Api.Controllers;

[ApiController]
[Route("api/pois/{poiId}/translations")]
public class PoiTranslationsController : ControllerBase
{
    private readonly ITranslationService _translationService;

    public PoiTranslationsController(ITranslationService translationService)
    {
        _translationService = translationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetByPoiId(int poiId)
    {
        var result = await _translationService.GetByPoiIdAsync(poiId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(int poiId, [FromBody] CreateTranslationRequest request)
    {
        var id = await _translationService.CreateAsync(poiId, request);
        if (id == 0) return NotFound("POI not found.");

        return Ok(new { id });
    }
}