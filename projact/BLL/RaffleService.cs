using Microsoft.EntityFrameworkCore;
using projact.models; 
using projact.DAL;   
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

public class RaffleService : IRaffleService
{

    private readonly ProjectDbContext _context;

    public RaffleService(ProjectDbContext context)
    {
        _context = context;
    }

    public async Task<User> RunRaffleAsync(int giftId)
    {
  
        var gift = await _context.Gifts 
            .Include(g => g.Purchases)       // טוען את רשימת הרכישות של המתנה
            .ThenInclude(p => p.Customer)      // טוען את הלקוח עבור כל רכישה
            .FirstOrDefaultAsync(g => g.Id == giftId);// מוצא את המתנה לפי ה-Id

        // 2. בדיקת תקינות
        if (gift == null || gift.Purchases == null || !gift.Purchases.Any())
        {
            return null;
        }

      // 3. יצירת רשימת מועמדים
        var candidates = gift.Purchases
            .SelectMany(p => Enumerable.Repeat(p.Customer, 1))
            .ToList();

        // 4. הגרלה אקראית
        var random = new Random();
        var winnerIndex = random.Next(candidates.Count);
        var winner = candidates[winnerIndex];

        // 5. שמירת הזוכה
        gift.WinnerId = winner.Id;

        await _context.SaveChangesAsync();

        return winner;
    }
}