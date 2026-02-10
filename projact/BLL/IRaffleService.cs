public interface IRaffleService
{
    Task<User> RunRaffleAsync(int giftId);
}