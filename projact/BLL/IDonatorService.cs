using projact.models;
using projact.models.DTO;

namespace projact.BLL
{
    public interface IDonatorService
    {
        Task AddDonatorAsync(DonatorDto dto);
        Task<List<Donator>> GetAllDonatorAsync();
        Task<Donator?> GetByEmailDonatorAsync(string email);
        Task RemoveDonatorAsync(string email);
    }
}
