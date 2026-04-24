namespace PoiAdmin.Application.DTOs;

public class PoiHeatmapPointDto
{
    public int PoiId { get; set; }
    public string Name { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int ViewCount { get; set; }
}