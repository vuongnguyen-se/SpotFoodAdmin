using Microsoft.EntityFrameworkCore;
using PoiAdmin.Application.DTOs.Poi;
using PoiAdmin.Application.Interfaces;
using PoiAdmin.Domain.Entities;
using PoiAdmin.Infrastructure.Data;

namespace PoiAdmin.Infrastructure.Services;

public class PoiService : IPoiService
{
    private readonly AppDbContext _context;

    public PoiService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<PoiDto>> GetAllAsync(string? keyword, int? categoryId)
    {
        var query = _context.Pois
            .Include(x => x.Category)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(keyword))
        {
            query = query.Where(x => x.Name.Contains(keyword));
        }

        if (categoryId.HasValue)
        {
            query = query.Where(x => x.CategoryId == categoryId);
        }

        return await query
            .Select(x => new PoiDto
            {
                PoiId = x.PoiId,
                Name = x.Name,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                ImageUrl = x.ImageUrl,
                CategoryId = x.CategoryId,
                CategoryName = x.Category != null ? x.Category.CategoryName : null,
                Address = x.Address,
                MapLink = x.MapLink,
                Priority = x.Priority,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<PoiDto?> GetByIdAsync(int id)
    {
        return await _context.Pois
            .Include(x => x.Category)
            .Where(x => x.PoiId == id)
            .Select(x => new PoiDto
            {
                PoiId = x.PoiId,
                Name = x.Name,
                Latitude = x.Latitude,
                Longitude = x.Longitude,
                ImageUrl = x.ImageUrl,
                CategoryId = x.CategoryId,
                CategoryName = x.Category != null ? x.Category.CategoryName : null,
                Address = x.Address,
                MapLink = x.MapLink,
                Priority = x.Priority,
                CreatedAt = x.CreatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<int> CreateAsync(CreatePoiRequest request)
    {
        var poi = new Poi
        {
            Name = request.Name,
            Latitude = request.Latitude,
            Longitude = request.Longitude,
            ImageUrl = request.ImageUrl,
            CategoryId = request.CategoryId,
            Address = request.Address,
            MapLink = request.MapLink,
            Priority = request.Priority,
            CreatedAt = DateTime.UtcNow
        };

        _context.Pois.Add(poi);
        await _context.SaveChangesAsync();

        return poi.PoiId;
    }

    public async Task<bool> UpdateAsync(int id, CreatePoiRequest request)
    {
        var poi = await _context.Pois.FirstOrDefaultAsync(x => x.PoiId == id);
        if (poi == null) return false;

        poi.Name = request.Name;
        poi.Latitude = request.Latitude;
        poi.Longitude = request.Longitude;
        poi.ImageUrl = request.ImageUrl;
        poi.CategoryId = request.CategoryId;
        poi.Address = request.Address;
        poi.MapLink = request.MapLink;
        poi.Priority = request.Priority;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var poi = await _context.Pois.FirstOrDefaultAsync(x => x.PoiId == id);
        if (poi == null) return false;

        _context.Pois.Remove(poi);
        await _context.SaveChangesAsync();
        return true;
    }
}