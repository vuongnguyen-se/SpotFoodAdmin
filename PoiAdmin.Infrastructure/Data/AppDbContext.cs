using Microsoft.EntityFrameworkCore;
using PoiAdmin.Domain.Entities;

namespace PoiAdmin.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Poi> Pois => Set<Poi>();
    public DbSet<PoiCategory> PoiCategories => Set<PoiCategory>();
    public DbSet<PoiTranslation> PoiTranslations => Set<PoiTranslation>();
    public DbSet<PoiContent> PoiContents => Set<PoiContent>();
    public DbSet<AudioFile> AudioFiles => Set<AudioFile>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<PoiCategory>(entity =>
        {
            entity.ToTable("POI_CATEGORY");
            entity.HasKey(x => x.CategoryId);
            entity.Property(x => x.CategoryId).HasColumnName("category_id");
            entity.Property(x => x.CategoryName).HasColumnName("category_name");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<Poi>(entity =>
        {
            entity.ToTable("POI");
            entity.HasKey(x => x.PoiId);
            entity.Property(x => x.PoiId).HasColumnName("poi_id");
            entity.Property(x => x.Name).HasColumnName("name");
            entity.Property(x => x.Latitude).HasColumnName("latitude");
            entity.Property(x => x.Longitude).HasColumnName("longitude");
            entity.Property(x => x.ImageUrl).HasColumnName("image_url");
            entity.Property(x => x.CategoryId).HasColumnName("category_id");
            entity.Property(x => x.Address).HasColumnName("address");
            entity.Property(x => x.MapLink).HasColumnName("map_link");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");

            entity.HasOne(x => x.Category)
                .WithMany(x => x.Pois)
                .HasForeignKey(x => x.CategoryId);
        });

        modelBuilder.Entity<PoiTranslation>(entity =>
        {
            entity.ToTable("POI_TRANSLATION");
            entity.HasKey(x => x.TranslationId);
            entity.Property(x => x.TranslationId).HasColumnName("translation_id");
            entity.Property(x => x.PoiId).HasColumnName("poi_id");
            entity.Property(x => x.LanguageCode).HasColumnName("language_code");
            entity.Property(x => x.Name).HasColumnName("name");
            entity.Property(x => x.Description).HasColumnName("description");
            entity.Property(x => x.Address).HasColumnName("address");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
            entity.Property(x => x.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(x => x.Poi)
                .WithMany(x => x.Translations)
                .HasForeignKey(x => x.PoiId);
        });

        modelBuilder.Entity<AudioFile>(entity =>
        {
            entity.ToTable("AUDIO_FILE");
            entity.HasKey(x => x.AudioId);
            entity.Property(x => x.AudioId).HasColumnName("audio_id");
            entity.Property(x => x.FilePath).HasColumnName("file_path");
            entity.Property(x => x.Duration).HasColumnName("duration");
            entity.Property(x => x.FileSize).HasColumnName("file_size");
            entity.Property(x => x.CreatedAt).HasColumnName("created_at");
        });

        modelBuilder.Entity<PoiContent>(entity =>
        {
            entity.ToTable("POI_CONTENT");
            entity.HasKey(x => x.ContentId);
            entity.Property(x => x.ContentId).HasColumnName("content_id");
            entity.Property(x => x.PoiId).HasColumnName("poi_id");
            entity.Property(x => x.Title).HasColumnName("title");
            entity.Property(x => x.Description).HasColumnName("description");
            entity.Property(x => x.AudioId).HasColumnName("audio_id");

            entity.HasOne(x => x.Poi)
                .WithMany(x => x.Contents)
                .HasForeignKey(x => x.PoiId);

            entity.HasOne(x => x.AudioFile)
                .WithMany(x => x.PoiContents)
                .HasForeignKey(x => x.AudioId);
        });
    }
}