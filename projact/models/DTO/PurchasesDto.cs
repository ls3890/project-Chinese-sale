namespace projact.models.DTO
{
    public class PurchasesDto
    {
        public string CustomerId { get; set; }
        public int GiftId { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
    }
}
