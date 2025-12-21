using projact.models;

public interface ICustomerDal
{
    Task AddAsync(Customer customer);
    Task<List<Customer>> GetAllAsync();
    Task<Customer?> GetByEmailAsync(string email);
}
