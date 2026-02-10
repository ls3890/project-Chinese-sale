namespace projact.models
{
    public class Gift
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public int DonatorId { get; set; }
        public Donator Donator { get; set; }

        public decimal Price { get; set; } // מחירים כדאי שיהיו decimal ולא int

        public int NumOfCustomers { get; set; } // שימי לב לשם המדויק
        
        public string Category { get; set; }
        
        public int? WinnerId { get; set; }
        public User Winner { get; set; }
        //רשימת רכישות של המתנה זו
        public List<Purchases> Purchases { get; set; } = new List<Purchases>();
        public int NumOfCostermes { get; internal set; }
    }
}
