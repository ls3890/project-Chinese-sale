using Microsoft.AspNetCore.Mvc;
using projact.models.DTO;

[ApiController]
[Route("api/[controller]")]
public class PurchasesController : ControllerBase
{
    private readonly IPurchasesService _service;

    public PurchasesController(IPurchasesService service)
    {
        _service = service;
    }

    [HttpPost]
    public async Task<IActionResult> Add(PurchasesDto dto)
    {
        await _service.AddAsync(dto);
        return Ok();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _service.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var purchase = await _service.GetByIdAsync(id);
        if (purchase == null)
            return NotFound();

        return Ok(purchase);
    }
}
