using projact.models;

public interface ICustomerDal
{
    Task AddAsync(User customer);
    Task<List<User>> GetAllAsync();
    Task<User?> GetByEmailAsync(string email);
}
