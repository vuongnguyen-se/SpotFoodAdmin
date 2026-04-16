namespace PoiAdmin.Application.DTOs.Translation;

public class TranslationDto
{
    public int TranslationId { get; set; }
    public int PoiId { get; set; }
    public string? LanguageCode { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}