using projact.models.DTO;
using projact.models;

public interface ICustomerService
{
    Task AddAsync(CustomerDto dto);
    Task<List<Customer>> GetAllAsync();
    Task<Customer?> GetByEmailAsync(string email);
}
