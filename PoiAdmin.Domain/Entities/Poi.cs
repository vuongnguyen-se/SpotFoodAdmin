namespace PoiAdmin.Domain.Entities;

public class Poi
{
    public int PoiId { get; set; }
    public string Name { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? ImageUrl { get; set; }
    public int? CategoryId { get; set; }
    public string? Address { get; set; }
    public string? MapLink { get; set; }
    public DateTime CreatedAt { get; set; }

    public PoiCategory? Category { get; set; }
    public ICollection<PoiTranslation> Translations { get; set; } = new List<PoiTranslation>();
    public ICollection<PoiContent> Contents { get; set; } = new List<PoiContent>();
}