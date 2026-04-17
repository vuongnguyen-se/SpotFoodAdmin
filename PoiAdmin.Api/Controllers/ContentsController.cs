using Microsoft.AspNetCore.Mvc;
using PoiAdmin.Application.DTOs.Content;
using PoiAdmin.Application.Interfaces;

namespace PoiAdmin.Api.Controllers;

[ApiController]
[Route("api/contents")]
public class ContentsController : ControllerBase
{
    private readonly IContentService _contentService;

    public ContentsController(IContentService contentService)
    {
        _contentService = contentService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _contentService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _contentService.GetByIdAsync(id);
        if (result == null) return NotFound();

        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateContentRequest request)
    {
        var updated = await _contentService.UpdateAsync(id, request);
        if (!updated) return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _contentService.DeleteAsync(id);
        if (!deleted) return NotFound();

        return NoContent();
    }
}