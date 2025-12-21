using projact.models;

namespace projact.DAL
{
    public interface IGiftDal
    {
        void Add (Gift gift);
        void Remove (Gift gift);
        void updete(Gift gift);
        //void Get(Gift gift);
        Gift? GetByName(string name);
      List<Gift> GetByDonator(string donatorName);
        Gift? GetNumOfCostemes(int NumOfCostemes);


    }
}
