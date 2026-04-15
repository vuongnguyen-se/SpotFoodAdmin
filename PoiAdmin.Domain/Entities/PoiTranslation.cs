namespace PoiAdmin.Domain.Entities;

public class PoiTranslation
{
    public int TranslationId { get; set; }
    public int PoiId { get; set; }
    public string LanguageCode { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Address { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    public Poi Poi { get; set; } = null!;
}