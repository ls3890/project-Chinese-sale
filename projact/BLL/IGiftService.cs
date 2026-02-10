using projact.models;
using projact.models.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace projact.BLL
{
    public interface IGiftService
    {
        // הוספה - מקבלת DTO
        Task Add(GiftDto gift);

        // הסרה ועדכון - עובדים מול ה-Model (Entity)
        Task Remove(Gift gift);
        Task updete(Gift gift);

        // שליפה - מחזירות רשימה של DTO כדי לכלול את שם התורם
        Task<List<GiftDto>> GetByName(string name);
        Task<List<GiftDto>> GetByDonator(string donatorName);

        // החזרת כל המתנות כרשימת DTO מסודרת
        Task<List<GiftDto>> GetAllGifts();

        // פונקציות עזר נוספות
        Gift? GetNumOfCostemes(int NumOfCostemes);
    }
}