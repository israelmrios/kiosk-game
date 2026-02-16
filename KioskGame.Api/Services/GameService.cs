using KioskGame.Api.Models;
using KioskGame.Api.Repositories;

namespace KioskGame.Api.Services
{
    public class GameService
    {
        private readonly IPlayerRepository _playerRepository;
        private readonly IPlayHistoryRepository _playHistoryRepository;
        private readonly IPrizeRepository _prizeRepository;
        private readonly PrizePicker _prizePicker;

        public GameService(IPlayerRepository playerRepository, PrizePicker prizePicker, IPlayHistoryRepository playHistoryRepository, IPrizeRepository prizeRepository)
        {
            _playerRepository = playerRepository;
            _prizePicker = prizePicker;
            _playHistoryRepository = playHistoryRepository;
            _prizeRepository = prizeRepository;
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

            var prizes = _prizeRepository.GetActivePrizes();
            if (prizes.Count == 0)
                throw new InvalidOperationException("No active prizes configured.");

            var prize = _prizePicker.PickPrize(prizes);

            var isWin = prize.Code != "nothing";

            _playHistoryRepository.Add(new PlayHistory
            {
                PlayerId = player.Id,
                PlayedAtUtc = now,
                PrizeId = prize.Id,
                PrizeCode = prize.Code,
                PrizeName = prize.Name,
                IsWin = isWin
            });

            if (prize.Code == "gift")
            {
                player.HasWonGift = true;
                _playerRepository.Save(player);
            }

            return (prize, player.PlaysRemaining, player.SessionExpiresAtUtc);
        }
    }
}
