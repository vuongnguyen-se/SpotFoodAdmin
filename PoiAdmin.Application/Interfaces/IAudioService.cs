using PoiAdmin.Application.DTOs.Audio;

namespace PoiAdmin.Application.Interfaces;

public interface IAudioService
{
    Task<List<AudioDto>> GetAllAsync();
    Task<int> UploadAsync(string fileName, Stream fileStream, long fileSize);
    Task<bool> DeleteAsync(int id);
}