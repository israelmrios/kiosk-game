using KioskGame.Api.Models;
using KioskGame.Api.Repositories;

namespace KioskGame.Api.Services
{
    public class GameService
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IPlayHistoryRepository _playHistoryRepository;
        private readonly PrizePicker _prizePicker;

        private static readonly List<Prize> Prizes = new()
        {
            new Prize { Id = "nothing", Name = "No Prize", Weight = 50 },
            new Prize { Id = "five", Name = "$5 Free Play", Weight = 25 },
            new Prize { Id = "ten", Name = "$10 Free Play", Weight = 15 },
            new Prize { Id = "food", Name = "Food Voucher", Weight = 7 },
            new Prize { Id = "gift", Name = "Gift Item", Weight = 3 }
        };

        public GameService(IPlayerRepository playerRepository, PrizePicker prizePicker, IPlayHistoryRepository playHistoryRepository)
        {
            _playerRepository = playerRepository;
            _prizePicker = prizePicker;
            _playHistoryRepository = playHistoryRepository;
        }

        public (Prize prize, int playsRemaining, DateTimeOffset? sessionExpiresAtUtc) Play(string playerId)
        {
            var player = _playerRepository.Get(playerId);

            if (player == null)
                throw new InvalidOperationException("Player not found");

            var now = DateTimeOffset.UtcNow;

            if (player.SessionExpiresAtUtc != null && now > player.SessionExpiresAtUtc.Value)
            {
                player.PlaysRemaining = 0;
                player.SessionStartedAtUtc = null;
                player.SessionExpiresAtUtc = null;
                _playerRepository.Save(player);

                throw new InvalidOperationException("Session expired. Remaining plays were lost.");
            }

            if (player.PlaysRemaining <= 0)
                throw new InvalidOperationException("No plays remaining");

            if (player.SessionStartedAtUtc == null)
            {
                player.SessionStartedAtUtc = now;
                player.SessionExpiresAtUtc = now.Add(GameRules.SessionWindow);
            }

            player.PlaysRemaining--;
            _playerRepository.Save(player);

            var prize = _prizePicker.PickPrize(Prizes);

            var isWin = prize.Id != "nothing";

            _playHistoryRepository.Add(new PlayHistory
            {
                PlayerId = player.Id,
                PlayedAtUtc = now,
                PrizeId = prize.Id,
                PrizeName = prize.Name,
                IsWin = isWin
            });

            if (prize.Id == "gift")
            {
                player.HasWonGift = true;
                _playerRepository.Save(player);
            }

            return (prize, player.PlaysRemaining, player.SessionExpiresAtUtc);
        }
    }
}
