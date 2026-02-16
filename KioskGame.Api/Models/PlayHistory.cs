namespace KioskGame.Api.Models
{
    public class PlayHistory
    {
        public long Id { get; set; }
        public string PlayerId { get; set; } = "";
        public DateTimeOffset PlayedAtUtc { get; set; }

        public int PrizeId { get; set; }
        public string PrizeCode { get; set; } = "";
        public string PrizeName { get; set; } = ""!;
        public bool IsWin { get; set; }
    }
}
