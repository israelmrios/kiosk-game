using KioskGame.Api.Data;
using KioskGame.Api.Models;

namespace KioskGame.Api.Repositories
{
    public class EfPlayHistoryRepository : IPlayHistoryRepository
    {
        private readonly GameDbContext _db;

        public EfPlayHistoryRepository(GameDbContext db)
        {
            _db = db;
        }

        public void Add(PlayHistory play)
        {
            _db.PlayHistory.Add(play);
            _db.SaveChanges();
        }

        public int CountPlaysForDay(string playerId, DateOnly dayUtc)
        {
            var start = dayUtc.ToDateTime(TimeOnly.MinValue, DateTimeKind.Utc);
            var end = dayUtc.ToDateTime(TimeOnly.MaxValue, DateTimeKind.Utc);

            return _db.PlayHistory.Count(p =>
                p.PlayerId == playerId &&
                p.PlayedAtUtc.UtcDateTime >= start &&
                p.PlayedAtUtc.UtcDateTime <= end);
        }

        public bool HasEverWonGift(string playerId)
        {
            return _db.PlayHistory.Any(p =>
                p.PlayerId == playerId &&
                p.PrizeId == "gift" &&
                p.IsWin);
        }
    }
}
