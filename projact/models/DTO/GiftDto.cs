namespace projact.models.DTO
{
    public class GiftDto
    {
        public string Name { get; set; }
        public string DonatorEmail { get; set; }
        /// <summary>
        /// איך יודע שזה של התורם
        /// </summary>
        public int Price { get; set; }
    }
}
