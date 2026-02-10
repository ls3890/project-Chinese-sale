using projact.models.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace projact.Services
{
    public interface IPurchasesService
    {
        Task AddToCartAsync(PurchasesDto dto, int userId);
        Task<List<PurchasesResponseDto>> GetMyCartAsync(int userId);
        Task UpdateDraftAsync(int purchaseId, UpdateCartDto dto);
        Task DeleteDraftAsync(int purchaseId);
        Task ConfirmOrderAsync(int userId);
        Task<List<PurchasesResponseDto>> GetMyApprovedOrdersAsync(int userId);
        Task<List<PurchasesResponseDto>> GetAllApprovedAsync();
        Task<List<PurchasesResponseDto>> GetByGiftAsync(int giftId);
    }
}
