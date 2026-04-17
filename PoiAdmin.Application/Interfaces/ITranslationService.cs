using PoiAdmin.Application.DTOs.Translation;

namespace PoiAdmin.Application.Interfaces;

public interface ITranslationService
{
    Task<List<TranslationDto>> GetAllAsync();
    Task<TranslationDto?> GetByIdAsync(int id);
    Task<List<TranslationDto>> GetByPoiIdAsync(int poiId);
    Task<int> CreateAsync(int poiId, CreateTranslationRequest request);
    Task<bool> UpdateAsync(int id, CreateTranslationRequest request);
    Task<bool> DeleteAsync(int id);
}