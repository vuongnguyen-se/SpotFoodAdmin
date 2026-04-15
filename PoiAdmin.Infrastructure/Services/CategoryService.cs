using Microsoft.EntityFrameworkCore;
using PoiAdmin.Application.DTOs.Category;
using PoiAdmin.Application.Interfaces;
using PoiAdmin.Domain.Entities;
using PoiAdmin.Infrastructure.Data;

namespace PoiAdmin.Infrastructure.Services;

public class CategoryService : ICategoryService
{
    private readonly AppDbContext _context;

    public CategoryService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CategoryDto>> GetAllAsync()
    {
        return await _context.PoiCategories
            .Select(x => new CategoryDto
            {
                CategoryId = x.CategoryId,
                CategoryName = x.CategoryName,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<int> CreateAsync(CreateCategoryRequest request)
    {
        var category = new PoiCategory
        {
            CategoryName = request.CategoryName,
            CreatedAt = DateTime.UtcNow
        };

        _context.PoiCategories.Add(category);
        await _context.SaveChangesAsync();

        return category.CategoryId;
    }

    public async Task<bool> UpdateAsync(int id, CreateCategoryRequest request)
    {
        var category = await _context.PoiCategories.FirstOrDefaultAsync(x => x.CategoryId == id);
        if (category == null) return false;

        category.CategoryName = request.CategoryName;
        await _context.SaveChangesAsync();

        return true;
    }
}