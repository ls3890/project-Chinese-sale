using projact.models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace projact.DAL
{
    public interface IDonatorDal
    {
        Task AddDonatorAsync(Donator donator);
        Task<Donator?> GetByEmailDonatorAsync(string email);
        Task<List<Donator>> GetAllDonatorAsync();
        Task RemoveDonatorAsync(Donator donator);

        // חדש: בדיקה/קבלת תורם לפי Id (סינכרוני/סימפלי)
        Task <Donator?> GetById(int id);
    }
}