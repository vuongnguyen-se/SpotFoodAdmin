namespace PoiAdmin.Domain.Entities;

public class AudioFile
{
    public int AudioId { get; set; }
    public string FilePath { get; set; } = string.Empty;
    public int? Duration { get; set; }
    public long? FileSize { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<PoiContent> PoiContents { get; set; } = new List<PoiContent>();
}