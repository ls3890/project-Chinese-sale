using Microsoft.EntityFrameworkCore;
using projact.models;
using System.Threading.Tasks;

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
            var existing = _context.Gifts.Find(gift.Id);
            if (existing == null)
            {
                throw new InvalidOperationException($"Gift with Id {gift.Id} not found.");
            }
            _context.Gifts.Remove(existing);
            _context.SaveChanges();
        }

        public void updete(Gift gift)
        {
            var existing = _context.Gifts.Find(gift.Id);
            if (existing == null)
            {
                throw new InvalidOperationException($"Gift with Id {gift.Id} not found.");
            }

            existing.Name = gift.Name;
            existing.Price = gift.Price;
            existing.DonatorId = gift.DonatorId;
            existing.NumOfCostermes = gift.NumOfCostermes;

            _context.SaveChanges();
        }
        public async Task<IEnumerable<Gift>> GetAllGifts()
        {
            return await _context.Gifts.ToListAsync();
        }

        // חיפוש דינמי לפי שם מתנה / שם תורם (דרך Donator.Name) / מספר רוכשים
        public async Task<List<Gift>> SearchGiftsAsync(string? name = null, string? donatorName = null, int? numOfCostemes = null)
        {
            var query = await _context.Gifts
                .Include(g => g.Donator)
                .ToListAsync();

            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.FindAll(g => g.Name == name);
            }

            if (!string.IsNullOrWhiteSpace(donatorName))
            {
                query = query.FindAll(g => g.Donator.Name == donatorName);
            }
            if (numOfCostemes.HasValue)
            {
                    query = query.FindAll(g => g.NumOfCostermes == numOfCostemes);
                }

                return  query;
        }

        //public Gift? GetNumOfCostemes(int NumOfCostemes)
        //{
        //    throw new NotImplementedException();
        //}



        //public object GetByName(string name)
        //{
        //    throw new NotImplementedException();
        //}
    }
}
