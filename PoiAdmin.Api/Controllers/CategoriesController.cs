using Microsoft.AspNetCore.Mvc;
using PoiAdmin.Application.DTOs.Category;
using PoiAdmin.Application.Interfaces;

namespace PoiAdmin.Api.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly ICategoryService _categoryService;

    public CategoriesController(ICategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _categoryService.GetAllAsync();
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCategoryRequest request)
    {
        var id = await _categoryService.CreateAsync(request);
        return Ok(new { id });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] CreateCategoryRequest request)
    {
        var updated = await _categoryService.UpdateAsync(id, request);
        if (!updated) return NotFound();

        return NoContent();
    }
}