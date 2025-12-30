using projact.models.DTO;
using projact.models;

public interface ICustomerService
{
    Task AddAsync(CustomerDto dto);
    Task<List<User>> GetAllAsync();
    Task<User?> GetByEmailAsync(string email);
}
