namespace PoiAdmin.Application.DTOs.Translation;

public class CreateTranslationRequest
{
    public string? LanguageCode { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Address { get; set; }
}