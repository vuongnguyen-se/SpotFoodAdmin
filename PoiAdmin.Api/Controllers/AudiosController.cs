using Microsoft.AspNetCore.Mvc;
using PoiAdmin.Api.Models;
using PoiAdmin.Application.Interfaces;

namespace PoiAdmin.Api.Controllers;

[ApiController]
[Route("api/audios")]
public class AudiosController : ControllerBase
{
    private readonly IAudioService _audioService;

    public AudiosController(IAudioService audioService)
    {
        _audioService = audioService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _audioService.GetAllAsync();
        return Ok(result);
    }

    [HttpPost("upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Upload([FromForm] UploadAudioRequest request)
    {
        if (request.File == null || request.File.Length == 0)
        {
            return BadRequest("File is required.");
        }

        await using var stream = request.File.OpenReadStream();
        var id = await _audioService.UploadAsync(request.File.FileName, stream, request.File.Length);

        if (id == 0)
        {
            return BadRequest("Upload failed.");
        }

        return Ok(new { id });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _audioService.DeleteAsync(id);
        if (!deleted) return NotFound();

        return NoContent();
    }
}