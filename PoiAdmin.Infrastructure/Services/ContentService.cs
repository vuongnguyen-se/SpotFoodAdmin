using Microsoft.EntityFrameworkCore;
using PoiAdmin.Application.DTOs.Content;
using PoiAdmin.Application.Interfaces;
using PoiAdmin.Domain.Entities;
using PoiAdmin.Infrastructure.Data;

namespace PoiAdmin.Infrastructure.Services;

public class ContentService : IContentService
{
    private readonly AppDbContext _context;

    public ContentService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<ContentDto>> GetByPoiIdAsync(int poiId)
    {
        return await _context.PoiContents
            .Where(x => x.PoiId == poiId)
            .Select(x => new ContentDto
            {
                ContentId = x.ContentId,
                PoiId = x.PoiId,
                Title = x.Title,
                Description = x.Description,
                AudioId = x.AudioId
            })
            .ToListAsync();
    }

    public async Task<int> CreateAsync(int poiId, CreateContentRequest request)
    {
        var poiExists = await _context.Pois.AnyAsync(x => x.PoiId == poiId);
        if (!poiExists)
        {
            return 0;
        }

        if (request.AudioId.HasValue)
        {
            var audioExists = await _context.AudioFiles.AnyAsync(x => x.AudioId == request.AudioId.Value);
            if (!audioExists)
            {
                return -1;
            }
        }

        var content = new PoiContent
        {
            PoiId = poiId,
            Title = request.Title,
            Description = request.Description,
            AudioId = request.AudioId
        };

        _context.PoiContents.Add(content);
        await _context.SaveChangesAsync();

        return content.ContentId;
    }

    public async Task<bool> UpdateAsync(int id, CreateContentRequest request)
    {
        var content = await _context.PoiContents.FirstOrDefaultAsync(x => x.ContentId == id);
        if (content == null)
        {
            return false;
        }

        if (request.AudioId.HasValue)
        {
            var audioExists = await _context.AudioFiles.AnyAsync(x => x.AudioId == request.AudioId.Value);
            if (!audioExists)
            {
                return false;
            }
        }

        content.Title = request.Title;
        content.Description = request.Description;
        content.AudioId = request.AudioId;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var content = await _context.PoiContents.FirstOrDefaultAsync(x => x.ContentId == id);
        if (content == null)
        {
            return false;
        }

        _context.PoiContents.Remove(content);
        await _context.SaveChangesAsync();
        return true;
    }
}