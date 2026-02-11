using KioskGame.Api.Models;

namespace KioskGame.Api.Services
{
    public class PrizePicker
    {
        private readonly Random _random = new();

        public Prize PickPrize(List<Prize> prizes)
        {
            var totalWeight = prizes.Sum(p => p.Weight);
            var roll = _random.Next(1, totalWeight + 1);

            var cumulative = 0;

            foreach (var prize in prizes)
            {
                cumulative += prize.Weight;
                if (roll <= cumulative)
                    return prize;
            }

            throw new InvalidOperationException("No prize selected");
        }
    }
}
