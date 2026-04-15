namespace PoiAdmin.Domain.Entities;

public class PoiCategory
{
    public int CategoryId { get; set; }
    public string CategoryName { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }

    public ICollection<Poi> Pois { get; set; } = new List<Poi>();
}