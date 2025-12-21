namespace projact.models
{
    public class Donator
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public List<Gift> Gifts { get; set; } = new List<Gift>();
    }
}
