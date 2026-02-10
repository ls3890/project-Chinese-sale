using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using projact.models;
using projact.Services;
using System.Threading.Tasks;

namespace projact.Controllers
{
    [ApiController]
    [Route("api/admin/purchases")]
    [Authorize(Roles = "manager")]
    public class AdminPurchasesController : ControllerBase
    {
        private readonly IPurchasesService _service;

        public AdminPurchasesController(IPurchasesService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAllApprovedAsync());
        }

        [HttpGet("by-gift/{giftId}")]
        public async Task<IActionResult> ByGift(int giftId)
        {
            return Ok(await _service.GetByGiftAsync(giftId));
        }
    }
}
