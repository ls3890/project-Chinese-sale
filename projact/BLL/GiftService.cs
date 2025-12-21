using projact.DAL;
using projact.models;

namespace projact.BLL
{
    public class GiftService : IGiftService
    {
        private readonly IGiftDal _giftDal;

        // קונסטרקטור שמקבל את DAL דרך Dependency Injection
        public GiftService(IGiftDal giftDal)
        {
            _giftDal = giftDal;
        }

        // 1️⃣ הוספת מתנה
        public void Add(Gift gift)
        {
            // ולידציה: שם חייב להיות מלא
            if (string.IsNullOrWhiteSpace(gift.Name))
                throw new Exception("שם המתנה הוא שדה חובה");

            // ולידציה: מחיר חייב להיות חיובי
            if (gift.Price <= 0)
                throw new Exception("מחיר חייב להיות גדול מ-0");

            // ולידציה: מספר לקוחות חייב להיות חיובי
            if (gift.NumOfCostermes < 0)
                throw new Exception("מספר הלקוחות לא יכול להיות שלילי");

            // ולידציה: שם תורם חייב להיות מלא
            if (string.IsNullOrWhiteSpace(gift.DonatorName))
                throw new Exception("שם התורם הוא שדה חובה");

            // בדיקה אם כבר קיימת מתנה עם אותו שם
            var existingGift = _giftDal.GetByName(gift.Name);
            if (existingGift != null)
                throw new Exception("כבר קיימת מתנה עם אותו שם");

            // הוספה ל-DAL
            _giftDal.Add(gift);
        }

        // 2️⃣ הסרת מתנה
        public void Remove(Gift gift)
        {
            // ולידציה: המתנה חייבת להיות קיימת
            var existingGift = _giftDal.GetByName(gift.Name);
            if (existingGift == null)
                throw new Exception("המתנה לא קיימת במערכת");

            _giftDal.Remove(gift);
        }

        // 3️⃣ עדכון מתנה
        public void updete(Gift gift)
        {
            // ולידציה: חייב להיות ID חוקי
            if (gift.Id <= 0)
                throw new Exception("Id לא חוקי");

            // ולידציה: שם חייב להיות מלא
            if (string.IsNullOrWhiteSpace(gift.Name))
                throw new Exception("שם המתנה הוא שדה חובה");

            // ולידציה: מחיר חייב להיות חיובי
            if (gift.Price <= 0)
                throw new Exception("מחיר חייב להיות גדול מ-0");

            // ולידציה: מספר לקוחות חייב להיות חיובי
            if (gift.NumOfCostermes < 0)
                throw new Exception("מספר הלקוחות לא יכול להיות שלילי");

            _giftDal.updete(gift);
        }

        // 4️⃣ קבלת מתנה לפי שם
        public Gift? GetByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new Exception("השם לא יכול להיות ריק");

            return _giftDal.GetByName(name);
        }

        // 5️⃣ קבלת כל המתנות של תורם מסוים
        public List<Gift> GetByDonator(string donatorName)
        {
            if (string.IsNullOrWhiteSpace(donatorName))
                throw new Exception("שם התורם לא יכול להיות ריק");

            return _giftDal.GetByDonator(donatorName);
        }

        // 6️⃣ קבלת מתנה לפי מספר לקוחות
        public Gift? GetNumOfCostemes(int numOfCostemes)
        {
            if (numOfCostemes < 0)
                throw new Exception("מספר הלקוחות לא יכול להיות שלילי");

            return _giftDal.GetNumOfCostemes(numOfCostemes);
        }
    }
}
