using projact.models;

namespace projact.models.DTO
{
    
    public class PurchasesResponseDto
    {
        public int Id { get; set; }
        public int GiftId { get; set; }
        public string GiftName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }
        public PurchaseStatus Status { get; set; }
    }
}
