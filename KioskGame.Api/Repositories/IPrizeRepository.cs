using KioskGame.Api.Models;

namespace KioskGame.Api.Repositories
{
    public interface IPrizeRepository
    {
        List<Prize> GetActivePrizes();
    }
}
