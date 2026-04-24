namespace PoiAdmin.Application.DTOs;

public class PoiApiStatsDto
{
    public int TotalApiCalls { get; set; }
    public int UniqueUsersCalledApi { get; set; }
    public int ActiveToday { get; set; }
    public int ActiveThisWeek { get; set; }
    public int OnlineNow { get; set; }
}