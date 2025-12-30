using projact.models.DTO;
using projact.models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

public class PurchasesService : IPurchasesService
{
    private readonly IPurchasesDal _purchasesDal;

    public PurchasesService(IPurchasesDal purchasesDal)
    {
        _purchasesDal = purchasesDal;
    }

    public async Task AddAsync(PurchasesDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.CustomerId))
            throw new Exception("CustomerId חובה");

        if (!int.TryParse(dto.CustomerId, out int customerId))
            throw new Exception("CustomerId לא תקין");

        if (dto.GiftId <= 0)
            throw new Exception("GiftId לא תקין");

        if (dto.Quantity <= 0)
            throw new Exception("Quantity חייב להיות גדול מ-0");

        if (dto.UnitPrice <= 0)
            throw new Exception("מחיר לא תקין");

        var purchase = new Purchases
        {
            CustomerId = customerId,
            GiftId = dto.GiftId,
            Quantity = dto.Quantity,
            UnitPrice = dto.UnitPrice,
            TotalPrice = dto.Quantity * dto.UnitPrice
        };

        await _purchasesDal.AddAsync(purchase);
    }

    public async Task<List<Purchases>> GetAllAsync()
    {
        return await _purchasesDal.GetAllAsync();
    }

    public async Task<Purchases?> GetByIdAsync(int id)
    {
        if (id <= 0)
            throw new Exception("Id לא תקין");

        return await _purchasesDal.GetByIdAsync(id);
    }
}
