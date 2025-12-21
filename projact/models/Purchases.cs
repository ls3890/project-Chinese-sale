namespace projact.models
{
    public class Purchases
    {
        public int Id { get; set; }// מזהה רכישה
        public string CustomerId { get; set; }// מזהה לקוח
        public int GiftId { get; set; }// מזהה המתנה
        public int Quantity { get; set; } // מספר כרטיסים
        public decimal UnitPrice { get; set; }// מחיר ליחידה
        public decimal TotalPrice { get; set; }// מחיר כולל
        //public Boolean PaymentStatus { get; set; }// סטטוס תשלום


    }
}
