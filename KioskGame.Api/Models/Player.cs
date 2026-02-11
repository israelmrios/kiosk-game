namespace KioskGame.Api.Models
{
    public class Player
    {
        public string Id { get; set; } = default!;
        public int PlaysRemaining { get; set; }
        public DateOnly LastPlayDate { get; set; }

        public DateTimeOffset? SessionStartedAtUtc { get; set; }
        public DateTimeOffset? SessionExpiresAtUtc { get; set; }

        public bool HasWonGift { get; set; }
    }
}
