using Microsoft.EntityFrameworkCore;
using projact.models;

namespace projact.DAL
{
    public class DonatorDal : IDonatorDal
    {
        private readonly ProjectDbContext _context;

        public DonatorDal(ProjectDbContext context)
        {
            _context = context;
        }

        public async Task AddDonatorAsync(Donator donator)
        {
            await _context.Donators.AddAsync(donator);
            await _context.SaveChangesAsync();
        }

        public async Task<Donator?> GetByEmailDonatorAsync(string email)
        {
            return await _context.Donators
                .Include(d => d.Gifts)
                .FirstOrDefaultAsync(d => d.Email == email);
        }

        public async Task<List<Donator>> GetAllDonatorAsync()
        {
            // מומלץ להוסיף Include אם את רוצה לראות את המתנות ברשימה הכללית
            return await _context.Donators.Include(d => d.Gifts).ToListAsync();
        }

        public async Task RemoveDonatorAsync(Donator donator)
        {
            _context.Donators.Remove(donator);
            await _context.SaveChangesAsync();
        }

        public async Task<Donator?> GetById(int id)
        {
            return await _context.Donators.FirstOrDefaultAsync(d => d.Id == id);
        }

        // מימוש פונקציית העדכון
        public async Task UpdateDonatorAsync(Donator donator)
        {
            _context.Donators.Update(donator);
            await _context.SaveChangesAsync();
        }
    }
}