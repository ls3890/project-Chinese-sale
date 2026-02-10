using projact.models;

namespace projact.DAL
{
    public interface IGiftDal
    {
        void Add(Gift gift);
        void Remove(Gift gift);
        void updete(Gift gift);
        Task<IEnumerable<Gift>> GetAllGifts();
        //Gift? GetByName(int donatorId);
        //List<Gift> GetByDonator(string donatorName);
        //Gift? GetNumOfCostemes(int NumOfCostemes);

        Task<List<Gift>> SearchGiftsAsync(string? name = null, string? donatorName = null, int? numOfCostemes = null);
        //object GetByName(string name);
    }
}
