using Microsoft.AspNetCore.Http;

namespace PoiAdmin.Api.Models;

public class UploadAudioRequest
{
    public IFormFile File { get; set; } = default!;
}