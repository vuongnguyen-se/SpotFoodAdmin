namespace PoiAdmin.Application.DTOs.Poi;

public class CreatePoiRequest
{
    public string Name { get; set; } = string.Empty;
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? ImageUrl { get; set; }
    public int? CategoryId { get; set; }
    public string? Address { get; set; }
    public string? MapLink { get; set; }
    public int Priority { get; set; }
}