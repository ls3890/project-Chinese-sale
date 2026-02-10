namespace projact.models.DTO
{
    public class GiftDto
    {
        public int Id { get; set; } // כדאי להוסיף Id ל-DTO כדי שיחזור מהשרת
        public string Name { get; set; }
        public int DonatorId { get; set; }
        public string? DonatorName { get; set; } = string.Empty; // <--- הוספה: שם התורם
        public int Price { get; set; }
        public string? Category { get; set; }
        public int NumOfCostermes { get; set; }
    }
}
