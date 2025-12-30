using projact.models;

public class Purchases
{
    public int Id { get; set; }

    // קשר ללקוח
    //מפתח זר למשתמש
    public int CustomerId { get; set; }
    //ניווט למשתמש
    public User Customer { get; set; }

    // קשר למתנה
    public int GiftId { get; set; }
    // ניווט למתנה
    public Gift Gift { get; set; }

    // נתוני רכישה
    public int Quantity { get; set; }
    // מחיר ליחידה וסך הכל
    public decimal UnitPrice { get; set; }
    // מחיר כולל
    public decimal TotalPrice { get; set; }
}
