using KioskGame.Api.Models;

namespace KioskGame.Api.Repositories
{
    public interface IPlayerRepository
    {
        Player? Get(string playerId);
        Player Save(Player player);
    }
}
