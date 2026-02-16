using KioskGame.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace KioskGame.Api.Data
{
    public class GameDbContext : DbContext
    {
        public GameDbContext(DbContextOptions<GameDbContext> options) : base(options) { }

        public DbSet<Player> Players => Set<Player>();
        public DbSet<PlayHistory> PlayHistory => Set<PlayHistory>();
        public DbSet<Prize> Prizes => Set<Prize>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Prize>()
                .HasIndex(p => p.Code)
                .IsUnique();
        }
    }
}
