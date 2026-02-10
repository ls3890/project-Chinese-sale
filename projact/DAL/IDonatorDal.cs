using projact.models;

namespace projact.DAL
{
    public interface IDonatorDal
    {
        Task AddDonatorAsync(Donator donator);
        Task<Donator?> GetByEmailDonatorAsync(string email);
        Task<List<Donator>> GetAllDonatorAsync();
        Task RemoveDonatorAsync(Donator donator);
        Task<Donator?> GetById(int id);

        // השורה שחסרה כדי לסגור את המעגל
        Task UpdateDonatorAsync(Donator donator);
    }
}