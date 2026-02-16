namespace KioskGame.Api.Models
{
    public class Prize
    {
        public int Id { get; set; }
        public string Code { get; set; } = "";
        public string Name { get; set; } = "";
        public int Weight { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
