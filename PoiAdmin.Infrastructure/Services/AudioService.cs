using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using PoiAdmin.Application.DTOs.Audio;
using PoiAdmin.Application.Interfaces;
using PoiAdmin.Domain.Entities;
using PoiAdmin.Infrastructure.Data;

namespace PoiAdmin.Infrastructure.Services;

public class AudioService : IAudioService
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public AudioService(AppDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    public async Task<List<AudioDto>> GetAllAsync()
    {
        return await _context.AudioFiles
            .Select(x => new AudioDto
            {
                AudioId = x.AudioId,
                FilePath = x.FilePath,
                Duration = x.Duration,
                FileSize = x.FileSize,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<int> UploadAsync(string fileName, Stream fileStream, long fileSize)
    {
        if (string.IsNullOrWhiteSpace(fileName) || fileStream == null || fileSize <= 0)
        {
            return 0;
        }

        var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
        var uploadsFolder = Path.Combine(webRoot, "audios");

        if (!Directory.Exists(uploadsFolder))
        {
            Directory.CreateDirectory(uploadsFolder);
        }

        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        var physicalPath = Path.Combine(uploadsFolder, uniqueFileName);

        await using (var stream = new FileStream(physicalPath, FileMode.Create))
        {
            await fileStream.CopyToAsync(stream);
        }

        var audio = new AudioFile
        {
            FilePath = $"/audios/{uniqueFileName}",
            FileSize = fileSize,
            Duration = null,
            CreatedAt = DateTime.UtcNow
        };

        _context.AudioFiles.Add(audio);
        await _context.SaveChangesAsync();

        return audio.AudioId;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var audio = await _context.AudioFiles.FirstOrDefaultAsync(x => x.AudioId == id);
        if (audio == null) return false;

        if (!string.IsNullOrWhiteSpace(audio.FilePath))
        {
            var webRoot = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
            var relativePath = audio.FilePath.TrimStart('/').Replace('/', Path.DirectorySeparatorChar);
            var physicalPath = Path.Combine(webRoot, relativePath);

            if (File.Exists(physicalPath))
            {
                File.Delete(physicalPath);
            }
        }

        _context.AudioFiles.Remove(audio);
        await _context.SaveChangesAsync();
        return true;
    }
}