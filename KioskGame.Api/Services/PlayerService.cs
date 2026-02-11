using KioskGame.Api.Models;
using KioskGame.Api.Repositories;

namespace KioskGame.Api.Services
{
    public class PlayerService
    {
        private const int DailyPlays = 3;

        private readonly IPlayerRepository _repository;

        public PlayerService(IPlayerRepository repository)
        {
            _repository = repository;
        }

        public Player Login(string playerId)
        {
            var player = _repository.Get(playerId);

            if (player == null)
            {
                player = new Player
                {
                    Id = playerId,
                    PlaysRemaining = DailyPlays,
                    LastPlayDate = DateOnly.FromDateTime(DateTime.UtcNow),
                    SessionStartedAtUtc = null,
                    SessionExpiresAtUtc = null
                };

                return _repository.Save(player);
            }

            if (player.LastPlayDate != DateOnly.FromDateTime(DateTime.UtcNow))
            {
                player.PlaysRemaining = DailyPlays;
                player.LastPlayDate = DateOnly.FromDateTime(DateTime.UtcNow);
                player.SessionStartedAtUtc = null;
                player.SessionExpiresAtUtc = null;
                _repository.Save(player);
            }

            return player;
        }

        public PlayerStatusResult GetStatus(string playerId)
        {
            var player = _repository.Get(playerId);
            if (player == null)
                return PlayerStatusResult.NotFound(playerId);

            var now = DateTimeOffset.UtcNow;

            var sessionExpired = player.SessionExpiresAtUtc != null && now > player.SessionExpiresAtUtc.Value;

            if (sessionExpired && player.PlaysRemaining > 0)
            {
                player.PlaysRemaining = 0;
                player.SessionStartedAtUtc = null;
                player.SessionExpiresAtUtc = null;
                _repository.Save(player);
            }

            var canPlay = player.PlaysRemaining > 0;

            return PlayerStatusResult.Found(
                playerId: player.Id,
                playsRemaining: player.PlaysRemaining,
                canPlay: canPlay,
                sessionExpiresAtUtc: player.SessionExpiresAtUtc
             );
        }
    }

    public record PlayerStatusResult(
        bool Exists,
        string PlayerId,
        int PlaysRemaining,
        bool CanPlay,
        DateTimeOffset? SessionExpiresAtUtc
     )
    {
        public static PlayerStatusResult NotFound(string playerId) =>
            new(false, playerId, 0, false, null);

        public static PlayerStatusResult Found(string playerId, int playsRemaining, bool canPlay, DateTimeOffset? sessionExpiresAtUtc) =>
            new(true, playerId, playsRemaining, canPlay, sessionExpiresAtUtc);
    }
}
