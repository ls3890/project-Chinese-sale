using projact.models;

public interface IPurchasesDal
{
    Task AddAsync(Purchases purchase);
    Task<List<Purchases>> GetAllAsync();
    Task<Purchases?> GetByIdAsync(int id);
}
