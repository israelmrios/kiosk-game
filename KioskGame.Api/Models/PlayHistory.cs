namespace KioskGame.Api.Models
{
    public class PlayHistory
    {
        public long Id { get; set; }
        public string PlayerId { get; set; } = default!;
        public DateTimeOffset PlayedAtUtc { get; set; }

        public string PrizeId { get; set; } = default!;
        public string PrizeName { get; set; } = default!;
        public bool IsWin { get; set; }
    }
}
