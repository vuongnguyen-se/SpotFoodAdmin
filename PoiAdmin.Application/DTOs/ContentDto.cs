namespace PoiAdmin.Application.DTOs.Content;

public class ContentDto
{
    public int ContentId { get; set; }
    public int PoiId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int? AudioId { get; set; }
}