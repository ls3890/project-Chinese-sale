using Microsoft.EntityFrameworkCore;
using projact.models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace projact.DAL
{
    public class PurchasesDal : IPurchasesDal
    {
        private readonly ProjectDbContext _context;

        public PurchasesDal(ProjectDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Purchases purchase)
        {
            _context.Purchases.Add(purchase);
            await _context.SaveChangesAsync();
        }

        public async Task<Purchases?> GetByIdAsync(int id)
        {
            return await _context.Purchases
                .Include(p => p.Gift)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Purchases>> GetAllAsync()
        {
            return await _context.Purchases
                .Include(p => p.Gift)
                .ToListAsync();
        }

        public async Task<List<Purchases>> GetDraftsByUserAsync(int userId)
        {
            return await _context.Purchases
                .Include(p => p.Gift)
                .Where(p => p.CustomerId == userId && p.Status == PurchaseStatus.Draft)
                .ToListAsync();
        }

        public async Task<List<Purchases>> GetApprovedAsync()
        {
            return await _context.Purchases
                .Include(p => p.Gift)
                .Where(p => p.Status == PurchaseStatus.Approved)
                .ToListAsync();
        }

        public async Task<List<Purchases>> GetByGiftAsync(int giftId)
        {
            return await _context.Purchases
                .Include(p => p.Gift)
                .Where(p => p.GiftId == giftId && p.Status == PurchaseStatus.Approved)
                .ToListAsync();
        }

        public async Task UpdateAsync(Purchases purchase)
        {
            _context.Purchases.Update(purchase);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRangeAsync(List<Purchases> purchases)
        {
            _context.Purchases.UpdateRange(purchases);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Purchases purchase)
        {
            _context.Purchases.Remove(purchase);
            await _context.SaveChangesAsync();
        }
    }
}
