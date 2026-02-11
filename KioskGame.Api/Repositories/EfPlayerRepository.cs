using KioskGame.Api.Data;
using KioskGame.Api.Models;

namespace KioskGame.Api.Repositories
{
    public class EfPlayerRepository : IPlayerRepository
    {
        private readonly GameDbContext _db;

        public EfPlayerRepository(GameDbContext db)
        {
            _db = db;
        }

        public Player? Get(string playerId)
        {
            return _db.Players.Find(playerId);
        }

        public Player Save(Player player)
        {
            var exists = _db.Players.Find(player.Id) != null;

            if (exists)
                _db.Players.Update(player);
            else
                _db.Players.Add(player);

            _db.SaveChanges();
            return player;
        }
    }
}
