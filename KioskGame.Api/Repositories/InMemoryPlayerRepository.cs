using KioskGame.Api.Models;

namespace KioskGame.Api.Repositories
{
    public class InMemoryPlayerRepository : IPlayerRepository
    {
        private static readonly Dictionary<string, Player> _players = new();

        public Player? Get(string playerId)
        {
            _players.TryGetValue(playerId, out var  player);
            return player;
        }

        public Player Save(Player player)
        {
            _players[player.Id] = player;
            return player;
        }
    }
}
