using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using projact.BLL;
using projact.models.DTO;
using projact.models; // ודאי שזה קיים עבור מודל Donator

[ApiController]
[Route("api/[controller]")]
public class DonatorsController : ControllerBase
{
    private readonly IDonatorService _service;

    public DonatorsController(IDonatorService service)
    {
        _service = service;
    }

    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllDonatorAsync());
    }

    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> Add([FromBody] DonatorDto dto)
    {
        try
        {
            await _service.AddDonatorAsync(dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // שורה 47 המתוקנת נמצאת כאן - המחיקה מקבלת string email
    [AllowAnonymous]
    [HttpDelete("{email}")] // כאן אנחנו מגדירים שהפרמטר מה-URL הוא טקסט
    public async Task<IActionResult> Delete(string email) // כאן הוא string
    {
        try
        {
            // כאן ה-email הוא string, ולכן ה-Service חייב לקבל string
            await _service.RemoveDonatorAsync(email);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [AllowAnonymous]
    [HttpPut("{email}")]
    public async Task<IActionResult> Update(string email, [FromBody] DonatorDto dto)
    {
        try
        {
            await _service.UpdateDonatorAsync(email, dto);
            return Ok();
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}