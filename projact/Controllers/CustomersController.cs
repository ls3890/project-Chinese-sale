using Microsoft.AspNetCore.Mvc;
using projact.models.DTO;
using Microsoft.AspNetCore.Authorization;


[ApiController]
[Route("api/[controller]")]
public class CustomersController : ControllerBase
{
    private readonly ICustomerService _service;

    public CustomersController(ICustomerService service)
    {
        _service = service;
    }
    [Authorize(Roles = "manager")]
    [HttpPost]
    public async Task<IActionResult> Add(CustomerDto dto)
    {
        await _service.AddAsync(dto);
        return Ok();
    }
    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }
    [Authorize]
    [HttpGet("{email}")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var customer = await _service.GetByEmailAsync(email);
        if (customer == null)
            return NotFound();

        return Ok(customer);
    }
}
