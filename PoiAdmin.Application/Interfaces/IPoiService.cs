using PoiAdmin.Application.DTOs.Poi;

namespace PoiAdmin.Application.Interfaces;

public interface IPoiService
{
    Task<List<PoiDto>> GetAllAsync(string? keyword, int? categoryId);
    Task<PoiDto?> GetByIdAsync(int id);
    Task<int> CreateAsync(CreatePoiRequest request);
    Task<bool> UpdateAsync(int id, CreatePoiRequest request);
    Task<bool> DeleteAsync(int id);
}