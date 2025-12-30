using projact.models;
using projact.models.DTO;

namespace projact.BLL
{
    public interface IGiftService
    {
        Task Add(GiftDto gift);
        Task Remove(Gift gift);
        Task updete(Gift gift);
        //void Get(Gift gift);
        Task<List<Gift>> GetByName(string name);
        Task<List<Gift>> GetByDonator(string donatorName);
        Gift? GetNumOfCostemes(int NumOfCostemes);
        Task<object?> GetAllGifts();
    }
}
