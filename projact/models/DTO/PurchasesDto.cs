namespace projact.models.DTO
{
    public class PurchasesDto
    {
        public int GiftId { get; set; }
        public int Quantity { get; set; } = 1;
        public decimal UnitPrice { get; set; }
    }
    public class UpdateCartDto
    {
        public int Quantity { get; set; }
    }
}
