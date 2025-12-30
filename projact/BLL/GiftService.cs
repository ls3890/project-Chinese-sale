using AutoMapper;
using Microsoft.EntityFrameworkCore;
using projact.DAL;
using projact.models;
using projact.models.DTO;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace projact.BLL
{
    public class GiftService : IGiftService
    {
        private readonly IGiftDal _giftDal;
        private readonly IDonatorDal _donatorDal;
        private readonly IMapper _mapper;


        // קונסטרקטור מקבל גם את DonatorDal כדי לבדוק קיום תורם
        public GiftService(IGiftDal giftDal, IDonatorDal donatorDal,IMapper mapper)
        {
            _giftDal = giftDal;
            _donatorDal = donatorDal;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper), "המיפוי לא מאותחל");

        }

        // 1️ הוספת מתנה
        public async Task Add(GiftDto gift)
        {
            // שלב 1: בדיקות וולידציה
            if (string.IsNullOrWhiteSpace(gift.Name))
                throw new Exception("שם המתנה הוא שדה חובה");

            if (gift.Price <= 0)
                throw new Exception("מחיר חייב להיות גדול מ-0");

            if (gift.NumOfCostermes < 0)
                throw new Exception("מספר הלקוחות לא יכול להיות שלילי");

            if (gift.DonatorId <= 0)
                throw new Exception("Id של התורם חייב להיות מסופק");

            // שלב 2: בדיקת קיום התורם
            var donator = await _donatorDal.GetById(gift.DonatorId);
            if (donator == null)
                throw new Exception("התורם עם המזהה שסופק לא נמצא");

            // שלב 3: בדיקת קיום מתנה עם אותו שם
            var existingGift = await _giftDal.SearchGiftsAsync(gift.Name);
            if (existingGift != null && existingGift.Count > 0)
                throw new Exception("כבר קיימת מתנה עם אותו שם");

            if (gift == null)
            {
                throw new ArgumentNullException(nameof(gift), "המתנה לא יכולה להיות ריקה");
            }
            // שלב 4: מיפוי ה-DTO לאובייקט Gift
            var g = _mapper.Map<Gift>(gift);  // מיפוי ה-DTO ל-Model (Gift)

            // שלב 5: הוספת המתנה למסד הנתונים
            _giftDal.Add(g);
        }

        // 2️ הסרת מתנה
        public async Task Remove(Gift gift)
        {
            // ולידציה: המתנה חייבת להיות קיימת
            var existingGift = _giftDal.SearchGiftsAsync(gift.Name);
            if (existingGift == null)
                throw new Exception("המתנה לא קיימת במערכת");

            _giftDal.Remove(gift);
        }

        // 3️ עדכון מתנה
        public async Task updete(Gift gift)
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

            // ולידציה: DonatorId חייב להיות תקין ולקיים
            if (gift.DonatorId <= 0)
                throw new Exception("Id של התורם חייב להיות תקין");

            var donator = _donatorDal.GetById(gift.DonatorId);
            if (donator == null)
                throw new Exception("התורם עם המזהה שסופק לא נמצא");

            _giftDal.updete(gift);
        }

        // 4️ קבלת מתנה לפי שם
        public async Task<List<Gift>> GetByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new Exception("השם לא יכול להיות ריק");

            return await _giftDal.SearchGiftsAsync(name);
        }

        // 5️ קבלת כל המתנות של תורם מסוים
        public async Task<List<Gift>> GetByDonator(string donatorName)
        {
            if (string.IsNullOrWhiteSpace(donatorName))
                throw new Exception("שם התורם לא יכול להיות ריק");

            return await _giftDal.SearchGiftsAsync(donatorName);
        }

        // 6️ קבלת מתנה לפי מספר לקוחות
        /////////////////////////////////////////////////////
        //public async Task<Gift?> GetNumOfCostemes(int numOfCostemes)
        //{
        //    if (numOfCostemes < 0)
        //        throw new Exception("מספר הלקוחות לא יכול להיות שלילי");

        //    //return _giftDal.SearchGiftsAsync(numOfCostemes);
        //    return null;
        //}

        //קבלת כל המתנות הקיימת במכירה  הסינית
        /////////////////////////////////////////////////////////////////////
        public async Task<object?> GetAllGifts()
        {
            var gifts = await _giftDal.GetAllGifts();
            return gifts?.ToList();
        }

        Gift? IGiftService.GetNumOfCostemes(int NumOfCostemes)
        {
            throw new NotImplementedException();
        }
    }
}