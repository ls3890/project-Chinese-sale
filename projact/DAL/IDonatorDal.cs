using projact.models;

namespace projact.DAL
{
    public interface IDonatorDal
    {
        Task AddAsync(Donator donator);
        Task<Donator?> GetByEmailAsync(string email);
        Task<List<Donator>> GetAllAsync();
        Task RemoveAsync(Donator donator);
    }
}
