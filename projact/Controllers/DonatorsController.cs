using Microsoft.AspNetCore.Mvc;
using projact.BLL;
using projact.models.DTO;
using Microsoft.AspNetCore.Authorization;



[ApiController]
[Route("api/[controller]")]
public class DonatorsController : ControllerBase
{
    private readonly IDonatorService _service;

    public DonatorsController(IDonatorService service)
    {
        _service = service;
    }
    [Authorize(Roles = "manager")]
    [HttpPost]
    public async Task<IActionResult> Add(DonatorDto dto)
    {
        await _service.AddDonatorAsync(dto);
        return Ok();
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllDonatorAsync());
    }
    [Authorize]
    [HttpGet("{email}")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var donator = await _service.GetByEmailDonatorAsync(email);
        if (donator == null)
            return NotFound();

        return Ok(donator);
    }
    [Authorize(Roles = "manager")]
    [HttpDelete("{email}")]
    public async Task<IActionResult> Delete(string email)
    {
        await _service.RemoveDonatorAsync(email);
        return NoContent();
    }
}
