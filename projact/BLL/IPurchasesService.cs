using projact.models.DTO;
using projact.models;

public interface IPurchasesService
{
    Task AddAsync(PurchasesDto dto);
    Task<List<Purchases>> GetAllAsync();
    Task<Purchases?> GetByIdAsync(int id);
}
