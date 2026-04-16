namespace PoiAdmin.Application.DTOs.Audio;

public class AudioDto
{
    public int AudioId { get; set; }
    public string? FilePath { get; set; }
    public decimal? Duration { get; set; }
    public long? FileSize { get; set; }
    public DateTime CreatedAt { get; set; }
}