using PoiAdmin.Application.DTOs.Category;

namespace PoiAdmin.Application.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryDto>> GetAllAsync();
    Task<int> CreateAsync(CreateCategoryRequest request);
    Task<bool> UpdateAsync(int id, CreateCategoryRequest request);
}