using KioskGame.Api.Models;
using System.Runtime.CompilerServices;

namespace KioskGame.Api.Data
{
    public static class DbSeeder
    {
        public static void Seed(GameDbContext db)
        {
            if (db.Prizes.Any()) return;

            db.Prizes.AddRange(
                new Prize { Code = "nothing", Name = "No Prize", Weight = 50, IsActive = true },
                new Prize { Code = "five", Name = "$5 EasyPlay", Weight = 25, IsActive = true },
                new Prize { Code = "ten", Name = "$10 EasyPlay", Weight = 15, IsActive = true },
                new Prize { Code = "food", Name = "Food Voucher", Weight = 7, IsActive = true },
                new Prize { Code = "gift", Name = "Gift Item", Weight = 3, IsActive = true }
                );

            db.SaveChanges();
        }
    }
}
