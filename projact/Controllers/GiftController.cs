using Microsoft.AspNetCore.Mvc;
using projact.BLL;
using projact.models;

[ApiController]
[Route("api/[controller]")]
public class GiftsController : ControllerBase
{
    private readonly IGiftService _giftService;

    public GiftsController(IGiftService giftService)
    {
        _giftService = giftService;
    }

    [HttpPost]
    public IActionResult Create(Gift gift)
    {
        _giftService.Add(gift);
        return Ok(gift);
    }

    [HttpGet("by-name/{name}")]
    public IActionResult GetByName(string name)
    {
        var gift = _giftService.GetByName(name);
        if (gift == null)
            return NotFound();

        return Ok(gift);
    }
}
