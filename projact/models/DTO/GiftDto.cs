namespace projact.models.DTO
{
    public class GiftDto
    {
        public string Name { get; set; }
        public int DonatorId { get; set; }
        /// <summary>
        /// איך יודע שזה של התורם
        /// </summary>
        public int Price { get; set; }
        public string Category { get; set; }
        public int NumOfCostermes { get; set; }
    }
}
