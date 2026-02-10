using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using projact.models.DTO;
using projact.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace projact.Controllers
{
    [ApiController]
    [Route("api/purchases")]
    [Authorize]
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
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await _service.AddToCartAsync(dto, userId);
            return Ok();
        }

        [HttpGet("cart")]
        public async Task<IActionResult> GetCart()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            return Ok(await _service.GetMyCartAsync(userId));
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> Confirm()
        {
            int userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            await _service.ConfirmOrderAsync(userId);
            return Ok();
        }
    }
}
