namespace PoiAdmin.Application.DTOs.Content;

public class CreateContentRequest
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public int? AudioId { get; set; }
}