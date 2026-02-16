using KioskGame.Api.Data;
using KioskGame.Api.Models;

namespace KioskGame.Api.Repositories
{
    public class EfPrizeRepository : IPrizeRepository
    {
        private readonly GameDbContext _db;

        public EfPrizeRepository(GameDbContext db)
        {
            _db = db;
        }

        public List<Prize> GetActivePrizes()
        {
            return _db.Prizes
                .Where(p => p.IsActive)
                .ToList();
        }
    }
}
