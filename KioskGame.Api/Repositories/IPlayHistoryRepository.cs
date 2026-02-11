using KioskGame.Api.Models;

namespace KioskGame.Api.Repositories
{
    public interface IPlayHistoryRepository
    {
        void Add(PlayHistory play);
        int CountPlaysForDay(string playerId, DateOnly dayUtc);
        bool HasEverWonGift(string playerId);
    }
}
