using PoiAdmin.Application.DTOs.Content;

namespace PoiAdmin.Application.Interfaces;

public interface IContentService
{
    Task<List<ContentDto>> GetAllAsync();
    Task<ContentDto?> GetByIdAsync(int id);
    Task<List<ContentDto>> GetByPoiIdAsync(int poiId);
    Task<int> CreateAsync(int poiId, CreateContentRequest request);
    Task<bool> UpdateAsync(int id, CreateContentRequest request);
    Task<bool> DeleteAsync(int id);
}