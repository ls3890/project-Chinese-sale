using projact.DAL;
using projact.models;
using Microsoft.EntityFrameworkCore;

public class CustomerDal : ICustomerDal
{
    private readonly ProjectDbContext _context;

    public CustomerDal(ProjectDbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(Customer customer)
    {
        await _context.Customers.AddAsync(customer);
        await _context.SaveChangesAsync();
    }

    public async Task<List<Customer>> GetAllAsync()
    {
        return await _context.Customers.ToListAsync();
    }

    public async Task<Customer?> GetByEmailAsync(string email)
    {
        return await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);
    }
}
