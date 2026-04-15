using Microsoft.EntityFrameworkCore;
using PoiAdmin.Infrastructure.Data;
// reference to API sections.
using PoiAdmin.Application.Interfaces;
using PoiAdmin.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IPoiService, PoiService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
// Configure Entity Framework with SQL Server.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();