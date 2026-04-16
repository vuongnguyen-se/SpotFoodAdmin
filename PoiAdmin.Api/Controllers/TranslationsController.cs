using Microsoft.AspNetCore.Mvc;
using PoiAdmin.Application.DTOs.Translation;
using PoiAdmin.Application.Interfaces;

namespace PoiAdmin.Api.Controllers;

[ApiController]
[Route("api/translations")]
public class TranslationsController : ControllerBase
{
    private readonly ITranslationService _translationService;

    public TranslationsController(ITranslationService translationService)
    {
        _translationService = translationService;
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateTranslationRequest request)
    {
        var updated = await _translationService.UpdateAsync(id, request);
        if (!updated) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _translationService.DeleteAsync(id);
        if (!deleted) return NotFound();

        return NoContent();
    }
}