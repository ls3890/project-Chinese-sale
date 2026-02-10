using projact.DAL;
using projact.models;
using projact.models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace projact.Services
{
    public class PurchasesService : IPurchasesService
    {
        private readonly IPurchasesDal _dal;

        public PurchasesService(IPurchasesDal dal)
        {
            _dal = dal;
        }

        public async Task AddToCartAsync(PurchasesDto dto, int userId)
        {
            var purchase = new Purchases
            {
                CustomerId = userId,
                GiftId = dto.GiftId,
                Quantity = dto.Quantity,
                UnitPrice = dto.UnitPrice,
                TotalPrice = dto.Quantity * dto.UnitPrice
            };

            await _dal.AddAsync(purchase);
        }

        public async Task<List<PurchasesResponseDto>> GetMyCartAsync(int userId)
        {
            return (await _dal.GetDraftsByUserAsync(userId))
                .Select(ToDto)
                .ToList();
        }

        public async Task UpdateDraftAsync(int purchaseId, UpdateCartDto dto)
        {
            var purchase = await _dal.GetByIdAsync(purchaseId);
            if (purchase == null || purchase.Status != PurchaseStatus.Draft)
                throw new Exception("לא ניתן לעדכן רכישה מאושרת");

            purchase.Quantity = dto.Quantity;
            purchase.TotalPrice = dto.Quantity * purchase.UnitPrice;

            await _dal.UpdateAsync(purchase);
        }

        public async Task DeleteDraftAsync(int purchaseId)
        {
            var purchase = await _dal.GetByIdAsync(purchaseId);
            if (purchase == null || purchase.Status != PurchaseStatus.Draft)
                throw new Exception("לא ניתן למחוק רכישה מאושרת");

            await _dal.DeleteAsync(purchase);
        }

        public async Task ConfirmOrderAsync(int userId)
        {
            var drafts = await _dal.GetDraftsByUserAsync(userId);
            drafts.ForEach(p => p.Status = PurchaseStatus.Approved);
            await _dal.UpdateRangeAsync(drafts);
        }

        public async Task<List<PurchasesResponseDto>> GetMyApprovedOrdersAsync(int userId)
        {
            return (await _dal.GetApprovedAsync())
                .Where(p => p.CustomerId == userId)
                .Select(ToDto)
                .ToList();
        }

        public async Task<List<PurchasesResponseDto>> GetAllApprovedAsync()
        {
            return (await _dal.GetApprovedAsync()).Select(ToDto).ToList();
        }

        public async Task<List<PurchasesResponseDto>> GetByGiftAsync(int giftId)
        {
            return (await _dal.GetByGiftAsync(giftId)).Select(ToDto).ToList();
        }

        private PurchasesResponseDto ToDto(Purchases p) =>
            new()
            {
                Id = p.Id,
                GiftId = p.GiftId,
                GiftName = p.Gift?.Name ?? "",
                Quantity = p.Quantity,
                UnitPrice = p.UnitPrice,
                TotalPrice = p.TotalPrice,
                Status = p.Status
            };
    }
}
