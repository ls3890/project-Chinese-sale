using projact.models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace projact.DAL
{
    public interface IPurchasesDal
    {
        Task AddAsync(Purchases purchase);
        Task<Purchases?> GetByIdAsync(int id);
        Task<List<Purchases>> GetAllAsync();
        Task<List<Purchases>> GetDraftsByUserAsync(int userId);
        Task<List<Purchases>> GetApprovedAsync();
        Task<List<Purchases>> GetByGiftAsync(int giftId);
        Task UpdateAsync(Purchases purchase);
        Task UpdateRangeAsync(List<Purchases> purchases);
        Task DeleteAsync(Purchases purchase);
    }
}
