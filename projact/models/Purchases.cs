namespace projact.models
{
    public enum PurchaseStatus
    {
        Draft = 0,
        Approved = 1
    }

    public class Purchases
    {
        public int Id { get; set; }

        public int CustomerId { get; set; }
        public User? Customer { get; set; }

        public int GiftId { get; set; }
        public Gift? Gift { get; set; }

        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal TotalPrice { get; set; }

        public PurchaseStatus Status { get; set; } = PurchaseStatus.Draft;
    }
}
