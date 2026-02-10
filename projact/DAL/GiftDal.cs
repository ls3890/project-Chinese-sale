using Microsoft.EntityFrameworkCore;
using projact.models;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

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
            gift.Donator = null;

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

        // --- שינוי כאן: הוספת Include כדי להביא את נתוני התורם ---
        public async Task<IEnumerable<Gift>> GetAllGifts()
        {
            return await _context.Gifts
                .Include(g => g.Donator)
                .ToListAsync();
        }

        // --- שינוי כאן: ייעול החיפוש כך שירוץ ב-SQL (IQueryable) ולא בזיכרון ---
        public async Task<List<Gift>> SearchGiftsAsync(string? name = null, string? donatorName = null, int? numOfCostemes = null)
        {
            // יוצרים בסיס לשילתה עם הקישור לתורם
            IQueryable<Gift> query = _context.Gifts.Include(g => g.Donator);

            // סינון לפי שם מתנה (במידה ונשלח)
            if (!string.IsNullOrWhiteSpace(name))
            {
                query = query.Where(g => g.Name.Contains(name));
            }

            // סינון לפי שם תורם - כאן אנחנו ניגשים לאובייקט המקושר
            if (!string.IsNullOrWhiteSpace(donatorName))
            {
                query = query.Where(g => g.Donator.Name.Contains(donatorName));
            }

            // סינון לפי מספר רוכשים
            if (numOfCostemes.HasValue)
            {
                query = query.Where(g => g.NumOfCostermes == numOfCostemes.Value);
            }

            // רק כאן השאילתה נשלחת למסד הנתונים ומחזירה רשימה
            return await query.ToListAsync();
        }
    }
}