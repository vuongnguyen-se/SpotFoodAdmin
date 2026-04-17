using Microsoft.EntityFrameworkCore;
using PoiAdmin.Application.DTOs.Translation;
using PoiAdmin.Application.Interfaces;
using PoiAdmin.Domain.Entities;
using PoiAdmin.Infrastructure.Data;

namespace PoiAdmin.Infrastructure.Services;

public class TranslationService : ITranslationService
{
    private readonly AppDbContext _context;

    public TranslationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<TranslationDto>> GetAllAsync()
    {
        return await _context.PoiTranslations
            .Select(x => new TranslationDto
            {
                TranslationId = x.TranslationId,
                PoiId = x.PoiId,
                LanguageCode = x.LanguageCode,
                Name = x.Name,
                Description = x.Description,
                Address = x.Address,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<TranslationDto?> GetByIdAsync(int id)
    {
        return await _context.PoiTranslations
            .Where(x => x.TranslationId == id)
            .Select(x => new TranslationDto
            {
                TranslationId = x.TranslationId,
                PoiId = x.PoiId,
                LanguageCode = x.LanguageCode,
                Name = x.Name,
                Description = x.Description,
                Address = x.Address,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .FirstOrDefaultAsync();
    }

    public async Task<List<TranslationDto>> GetByPoiIdAsync(int poiId)
    {
        return await _context.PoiTranslations
            .Where(x => x.PoiId == poiId)
            .Select(x => new TranslationDto
            {
                TranslationId = x.TranslationId,
                PoiId = x.PoiId,
                LanguageCode = x.LanguageCode,
                Name = x.Name,
                Description = x.Description,
                Address = x.Address,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();
    }

    public async Task<int> CreateAsync(int poiId, CreateTranslationRequest request)
    {
        var poiExists = await _context.Pois.AnyAsync(x => x.PoiId == poiId);
        if (!poiExists)
        {
            return 0;
        }

        var translation = new PoiTranslation
        {
            PoiId = poiId,
            LanguageCode = request.LanguageCode,
            Name = request.Name,
            Description = request.Description,
            Address = request.Address,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null
        };

        _context.PoiTranslations.Add(translation);
        await _context.SaveChangesAsync();

        return translation.TranslationId;
    }

    public async Task<bool> UpdateAsync(int id, CreateTranslationRequest request)
    {
        var translation = await _context.PoiTranslations
            .FirstOrDefaultAsync(x => x.TranslationId == id);

        if (translation == null)
        {
            return false;
        }

        translation.LanguageCode = request.LanguageCode;
        translation.Name = request.Name;
        translation.Description = request.Description;
        translation.Address = request.Address;
        translation.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var translation = await _context.PoiTranslations
            .FirstOrDefaultAsync(x => x.TranslationId == id);

        if (translation == null)
        {
            return false;
        }

        _context.PoiTranslations.Remove(translation);
        await _context.SaveChangesAsync();
        return true;
    }
}