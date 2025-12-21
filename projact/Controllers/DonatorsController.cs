using Microsoft.AspNetCore.Mvc;
using projact.BLL;
using projact.models.DTO;

[ApiController]
[Route("api/[controller]")]
public class DonatorsController : ControllerBase
{
    private readonly IDonatorService _service;

    public DonatorsController(IDonatorService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Add(DonatorDto dto)
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
        var donator = await _service.GetByEmailAsync(email);
        if (donator == null)
            return NotFound();

        return Ok(donator);
    }

    [HttpDelete("{email}")]
    public async Task<IActionResult> Delete(string email)
    {
        await _service.RemoveAsync(email);
        return NoContent();
    }
}
