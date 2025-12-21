using projact.models;
using projact.models.DTO;

namespace projact.BLL
{
    public interface IDonatorService
    {
        Task AddAsync(DonatorDto dto);
        Task<List<Donator>> GetAllAsync();
        Task<Donator?> GetByEmailAsync(string email);
        Task RemoveAsync(string email);
    }
}
