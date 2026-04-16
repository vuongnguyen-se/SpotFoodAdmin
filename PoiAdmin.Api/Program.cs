using Microsoft.EntityFrameworkCore;
using PoiAdmin.Infrastructure.Data;
// reference to API sections.
using PoiAdmin.Application.Interfaces;
using PoiAdmin.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddScoped<IPoiService, PoiService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<ITranslationService, TranslationService>();
builder.Services.AddScoped<IContentService, ContentService>();
builder.Services.AddScoped<IAudioService, AudioService>();
// Configure Entity Framework with SQL Server.
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//CORS.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:5174", "https://localhost:5173", "https://localhost:5174")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseStaticFiles(); // files were stored in wwwroot/audios.
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();