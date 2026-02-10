using AutoMapper;
using Microsoft.EntityFrameworkCore;
using projact.DAL;
using projact.models;
using projact.models.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace projact.BLL
{
    public class GiftService : IGiftService
    {
        private readonly IGiftDal _giftDal;
        private readonly IDonatorDal _donatorDal;
        private readonly IMapper _mapper;

        public GiftService(IGiftDal giftDal, IDonatorDal donatorDal, IMapper mapper)
        {
            _giftDal = giftDal;
            _donatorDal = donatorDal;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper), "המיפוי לא מאותחל");
        }

        // 1. הוספת מתנה
        public async Task Add(GiftDto giftDto)
        {
            if (giftDto == null) throw new ArgumentNullException(nameof(giftDto));

            // 1. ולידציות בסיסיות
            if (string.IsNullOrWhiteSpace(giftDto.Name))
                throw new Exception("שם המתנה הוא שדה חובה");
            if (giftDto.Price <= 0)
                throw new Exception("מחיר חייב להיות גדול מ-0");

            // 2. בדיקת קיום תורם - ודאי שה-ID הזה באמת קיים בטבלה
            var donator = await _donatorDal.GetById(giftDto.DonatorId);
            if (donator == null)
                throw new Exception($"התורם עם מזהה {giftDto.DonatorId} לא נמצא במערכת. לא ניתן להוסיף מתנה ללא תורם קיים.");

            // 3. בדיקה אם שם המתנה כבר תפוס
            var existingGifts = await _giftDal.SearchGiftsAsync(name: giftDto.Name);
            if (existingGifts != null && existingGifts.Any())
                throw new Exception("כבר קיימת מתנה עם אותו שם");

            // 4. מיפוי DTO ל-Entity
            var giftEntity = _mapper.Map<Gift>(giftDto);

            // --- התיקון הקריטי ---
            // אנחנו מוודאים שה-Entity Framework לא ינסה ליצור תורם חדש.
            // אנחנו אומרים לו: "התורם הוא null, תשתמש רק ב-DonatorId שכבר מופיע ב-Entity".
            giftEntity.Donator = null;
            giftEntity.DonatorId = giftDto.DonatorId;

            _giftDal.Add(giftEntity);
        }

        // 2. הסרת מתנה
        public async Task Remove(Gift gift)
        {
            // בדיקה שהמתנה קיימת לפני מחיקה
            if (gift == null) throw new ArgumentNullException(nameof(gift));

            _giftDal.Remove(gift);
            await Task.CompletedTask; // DAL משתמש ב-SaveChanges סינכרוני
        }

        // 3. עדכון מתנה
        public async Task updete(Gift gift)
        {
            if (gift.Id <= 0) throw new Exception("Id לא חוקי לעדכון");

            // בדיקת קיום תורם לפני עדכון
            var donator = await _donatorDal.GetById(gift.DonatorId);
            if (donator == null)
                throw new Exception("התורם החדש שצוין לא נמצא");

            _giftDal.updete(gift);
        }

        // 4. קבלת מתנות לפי שם - מחזיר DTO כולל שם תורם
        public async Task<List<GiftDto>> GetByName(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new Exception("השם לחיפוש לא יכול להיות ריק");

            var gifts = await _giftDal.SearchGiftsAsync(name: name);
            return _mapper.Map<List<GiftDto>>(gifts);
        }

        // 5. קבלת כל המתנות - כאן קורה המיפוי החשוב ל-Angular
        public async Task<List<GiftDto>> GetAllGifts()
        {
            var gifts = await _giftDal.GetAllGifts();
            if (gifts == null) return new List<GiftDto>();

            // כאן AutoMapper לוקח את ה-Include(g => g.Donator) מה-DAL 
            // ומכניס את Donator.Name לתוך השדה DonatorName ב-DTO
            return _mapper.Map<List<GiftDto>>(gifts);
        }

        // 6. קבלת מתנות לפי תורם
        public async Task<List<GiftDto>> GetByDonator(string donatorName)
        {
            if (string.IsNullOrWhiteSpace(donatorName))
                throw new Exception("שם התורם לא יכול להיות ריק");

            var gifts = await _giftDal.SearchGiftsAsync(donatorName: donatorName);
            return _mapper.Map<List<GiftDto>>(gifts);
        }

        // מימוש פונקציית ממשק נוספת אם קיימת
        public Gift? GetNumOfCostemes(int NumOfCostemes)
        {
            // לוגיקה ספציפית אם נדרשת
            throw new NotImplementedException();
        }
    }
}