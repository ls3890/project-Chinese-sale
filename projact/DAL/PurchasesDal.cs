using Microsoft.EntityFrameworkCore;
using projact.DAL;
using projact.models;

public class PurchasesDal : IPurchasesDal
{
    private readonly ProjectDbContext _context;

    public PurchasesDal(ProjectDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Purchases purchase)
    {
        await _context.Purchases.AddAsync(purchase);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Purchases>> GetAllAsync()
    {
        return await _context.Purchases.ToListAsync();
    }

    public async Task<Purchases?> GetByIdAsync(int id)
    {
        return await _context.Purchases.FirstOrDefaultAsync(p => p.Id == id);
    }
}
