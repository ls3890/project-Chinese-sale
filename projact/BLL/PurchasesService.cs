using projact.models.DTO;
using projact.models;

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

        if (dto.GiftId <= 0)
            throw new Exception("GiftId לא תקין");

        if (dto.Quantity <= 0)
            throw new Exception("Quantity חייב להיות גדול מ-0");

        if (dto.UnitPrice <= 0)
            throw new Exception("מחיר לא תקין");

        var purchase = new Purchases
        {
            CustomerId = dto.CustomerId,
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
