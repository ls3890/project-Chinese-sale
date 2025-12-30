using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using projact.BLL;
using projact.DAL;
using projact.models;
using projact.models.DTO;

[ApiController]
[Route("api/[controller]")]
public class GiftsController : ControllerBase
{
    private readonly IGiftService _giftService;


    public GiftsController(IGiftService giftService)
    {
        _giftService = giftService;
    }

    [Authorize(Roles = "manager")]
    [HttpPost]
    public async Task<IActionResult> Create(GiftDto gift)
    {
        await _giftService.Add(gift);  
        return Ok(gift);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _giftService.GetAllGifts());
    }

    [Authorize]
    [HttpGet("by-name/{name}")]
    public async Task<IActionResult> GetByName(string name)
    {
        var gift = await _giftService.GetByName(name);
        if (gift == null)
            return NotFound();

        return Ok(gift);
    }

    [Authorize(Roles = "manager")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var allObj = await _giftService.GetAllGifts();
        var gifts = (allObj as IEnumerable<Gift>)?.ToList() ?? new List<Gift>();
        var gift = gifts.FirstOrDefault(g => g.Id == id);
        if (gift == null)
            return NotFound();

        await _giftService.Remove(gift);
        return NoContent();
    }

    [Authorize(Roles = "manager")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, GiftDto dto)
    {
        var allObj = await _giftService.GetAllGifts();
        var gifts = (allObj as IEnumerable<Gift>)?.ToList() ?? new List<Gift>();
        var existing = gifts.FirstOrDefault(g => g.Id == id);
        if (existing == null)
            return NotFound();

        // copy fields from DTO to entity
        existing.Name = dto.Name;
        existing.Price = dto.Price;
        existing.NumOfCostermes = dto.NumOfCostermes;
        existing.DonatorId = dto.DonatorId;
        existing.Category = dto.Category;

        await _giftService.updete(existing);
        return Ok(existing);
    }

}
