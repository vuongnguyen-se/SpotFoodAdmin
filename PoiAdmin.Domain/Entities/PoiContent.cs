namespace PoiAdmin.Domain.Entities;

public class PoiContent
{
    public int ContentId { get; set; }
    public int PoiId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int? AudioId { get; set; }

    public Poi Poi { get; set; } = null!;
    public AudioFile? AudioFile { get; set; }
}