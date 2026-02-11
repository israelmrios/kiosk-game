using KioskGame.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KioskGame.Api.Data
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }

        public DbSet<Player> Players => Set<Player>();
        public DbSet<PlayHistory> PlayHistory => Set<PlayHistory>();
    }
}
