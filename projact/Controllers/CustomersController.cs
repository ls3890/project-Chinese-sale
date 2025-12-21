using Microsoft.AspNetCore.Mvc;
using projact.models.DTO;

[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _service;

    public CustomersController(ICustomerService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Add(CustomerDto dto)
    {
        await _service.AddAsync(dto);
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{email}")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var customer = await _service.GetByEmailAsync(email);
        if (customer == null)
            return NotFound();

        return Ok(customer);
    }
}
