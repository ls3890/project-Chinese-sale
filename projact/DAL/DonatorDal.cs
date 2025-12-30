using Microsoft.EntityFrameworkCore;
using projact.models;
using System.Xml.Linq;

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
            return await _context.Donators.ToListAsync();
        }

        public async Task RemoveDonatorAsync(Donator donator)
        {
            Microsoft.EntityFrameworkCore.ChangeTracking.EntityEntry<Donator> entityEntry = _context.Donators.Remove(donator);
            await _context.SaveChangesAsync();
        }

        // מימוש חדש: קבלת תורם לפי Id
      
        public async Task<Donator> GetById(int id)
        {
            return await _context.Donators.FirstOrDefaultAsync(d => d.Id == id);
        }

   
    }
}