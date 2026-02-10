using projact.models.DTO;
using projact.models;

public class CustomerService : ICustomerService
{
    private readonly ICustomerDal _customerDal;

    public CustomerService(ICustomerDal customerDal)
    {
        _customerDal = customerDal;
    }

    public async Task AddAsync(CustomerDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Name))
            throw new Exception("שם חובה");

        if (string.IsNullOrWhiteSpace(dto.Email))
            throw new Exception("אימייל חובה");

        var exists = await _customerDal.GetByEmailAsync(dto.Email);
        if (exists != null)
            throw new Exception("לקוח כבר קיים");

        var customer = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Phone = dto.Phone,
            Address = dto.Address
        };

        await _customerDal.AddAsync(customer);
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _customerDal.GetAllAsync();
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            throw new Exception("אימייל לא תקין");

        return await _customerDal.GetByEmailAsync(email);
    }
}
