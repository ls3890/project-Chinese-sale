using projact.models;

namespace projact.DAL
{
    public class GiftDal : IGiftDal
    {
        private readonly ProjectDbContext _context;

        public GiftDal(ProjectDbContext context)
        {
            _context = context;
        }

        public void Add(Gift gift)
        {
            _context.Gifts.Add(gift);
            _context.SaveChanges();
        }

        public void Remove(Gift gift)
        {
            _context.Gifts.Remove(gift);
            _context.SaveChanges();
        }

        public void updete(Gift gift)
        {
            _context.Gifts.Update(gift);
            _context.SaveChanges();
        }

        public Gift? GetByName(string name)
        {
            return _context.Gifts.FirstOrDefault(g => g.Name == name);
        }

        public List<Gift> GetByDonator(string donatorName)
        {
            return _context.Gifts
                .Where(g => g.DonatorName == donatorName)
                .ToList();
        }

        public Gift? GetNumOfCostemes(int numOfCostemes)
        {
            return _context.Gifts
                .FirstOrDefault(g => g.NumOfCostermes == numOfCostemes);
        }
    }
}
